import { createContext, useContext, useState, useEffect, useRef } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import VotingABI from "../abis/Voting.json";

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce mechanism for contract calls
  const callInProgress = useRef({});
  const DEBOUNCE_DELAY = 2000; // 2 seconds between identical calls

  // Replace with your actual deployed contract address
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update this

  useEffect(() => {
    initializeWeb3();
    setupEventListeners();
  }, []);

  const initializeWeb3 = async () => {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);

        // Check if already connected
        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);

          const chainId = await web3Instance.eth.getChainId();
          setChainId(Number(chainId)); // Convert BigInt to number
        }
      } else {
        setError(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
      }
    } catch (error) {
      console.error("Error initializing Web3:", error);
      setError("Failed to initialize Web3");
    }
  };

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
  };

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16));
    window.location.reload(); // Recommended by MetaMask
  };

  const handleDisconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
  };

  const connectWallet = async () => {
    if (!web3) {
      setError("Web3 not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);

        const chainId = await web3.eth.getChainId();
        setChainId(Number(chainId)); // Convert BigInt to number

        console.log("✅ Wallet connected:", accounts[0]);
        return accounts[0];
      }
    } catch (error) {
      console.error("❌ Error connecting wallet:", error);
      if (error.code === 4001) {
        setError("Please connect to MetaMask.");
      } else {
        setError("Failed to connect wallet");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    console.log("🔌 Wallet disconnected");
  };

  const switchToLocalNetwork = async () => {
    try {
      // Try to switch to localhost:8545 (Hardhat default)
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7A69" }], // 31337 in hex (Hardhat default)
      });
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7A69",
                chainName: "Hardhat Local",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["http://127.0.0.1:8545"],
                blockExplorerUrls: null,
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
          setError("Failed to add local network");
        }
      } else {
        console.error("Failed to switch network:", switchError);
        setError("Failed to switch network");
      }
    }
  };

  const voteOnBlockchain = async (candidateName) => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      console.log("🔗 Starting blockchain vote...");
      console.log("📍 Contract Address:", CONTRACT_ADDRESS);
      console.log("👤 Account:", account);
      console.log("🗳️ Candidate:", candidateName);
      console.log("🌐 Chain ID:", chainId);

      const contract = new web3.eth.Contract(VotingABI, CONTRACT_ADDRESS);

      // Test contract connection first
      console.log("🔍 Testing contract connection...");
      try {
        const candidates = await contract.methods.getAllCandidates().call();
        console.log("✅ Contract candidates:", candidates);

        if (!candidates.includes(candidateName)) {
          throw new Error(
            `Candidate "${candidateName}" not found in contract. Available candidates: ${candidates.join(
              ", "
            )}`
          );
        }
      } catch (contractError) {
        console.error("❌ Contract connection failed:", contractError);
        throw new Error(
          "Contract not found or not deployed. Please ensure blockchain is running and contract is deployed."
        );
      }

      // Check if user has already voted
      console.log("🔍 Checking if user has already voted...");
      const hasVoted = await contract.methods.checkVoteStatus(account).call();
      console.log("📊 Has voted:", hasVoted);

      if (hasVoted) {
        throw new Error("You have already voted on the blockchain");
      }

      // Get current gas price
      const gasPrice = await web3.eth.getGasPrice();
      console.log("⛽ Gas price:", gasPrice);

      // Estimate gas
      console.log("📊 Estimating gas...");
      const gasEstimate = await contract.methods
        .vote(candidateName)
        .estimateGas({
          from: account,
        });
      console.log("⛽ Gas estimate:", gasEstimate);

      // Convert BigInt values to regular numbers for calculation
      const gasPriceNumber = Number(gasPrice);
      const gasEstimateNumber = Number(gasEstimate);

      // Send transaction
      console.log("📤 Sending vote transaction...");
      const result = await contract.methods.vote(candidateName).send({
        from: account,
        gas: Math.floor(gasEstimateNumber * 1.2), // Add 20% buffer
        gasPrice: gasPriceNumber,
      });

      console.log("✅ Vote transaction successful:", result);
      console.log("🔗 Transaction hash:", result.transactionHash);

      return result;
    } catch (error) {
      console.error("❌ Blockchain vote failed:", error);

      // Enhanced error reporting
      if (error.message.includes("revert")) {
        console.error("Contract reverted. Possible reasons:");
        console.error("- Already voted");
        console.error("- Invalid candidate");
        console.error("- Contract not properly deployed");
      } else if (error.message.includes("call revert exception")) {
        console.error("Contract call failed - contract might not be deployed");
      }

      throw error;
    }
  };

  const getVoteCount = async (candidateName) => {
    if (!web3) return 0;

    try {
      const contract = new web3.eth.Contract(VotingABI, CONTRACT_ADDRESS);
      const votes = await contract.methods.getVotes(candidateName).call();
      return parseInt(votes);
    } catch (error) {
      console.error("Error getting vote count:", error);
      return 0;
    }
  };

  // Helper function to debounce contract calls
  const debouncedContractCall = async (callId, fn) => {
    const now = Date.now();

    // Check if this call is already in progress or was made recently
    if (
      callInProgress.current[callId] &&
      now - callInProgress.current[callId] < DEBOUNCE_DELAY
    ) {
      console.log(`⏱️ Skipping duplicate call to ${callId} (debounced)`);
      return null;
    }

    // Mark this call as in progress
    callInProgress.current[callId] = now;

    try {
      // Execute the function
      const result = await fn();

      // Remove from in-progress after a delay
      setTimeout(() => {
        delete callInProgress.current[callId];
      }, DEBOUNCE_DELAY);

      return result;
    } catch (error) {
      // Remove from in-progress immediately on error
      delete callInProgress.current[callId];
      throw error;
    }
  };

  const checkIfVoted = async (address = account) => {
    if (!web3 || !address) return false;

    const callId = `checkVote-${address}`;

    return debouncedContractCall(callId, async () => {
      try {
        const contract = new web3.eth.Contract(VotingABI, CONTRACT_ADDRESS);

        // Simplified logging to reduce noise
        console.log("🧪 Checking vote status for address:", address);

        // First try using checkVoteStatus (recommended approach)
        try {
          return await contract.methods.checkVoteStatus(address).call();
        } catch (err) {
          console.warn(
            "checkVoteStatus failed, falling back to hasVoted mapping:",
            err.message
          );

          // Fall back to using the mapping directly
          return await contract.methods.hasVoted(address).call();
        }
      } catch (error) {
        console.error("❌ Error checking vote status:", error);
        console.error("Error details:", error.message);
        return false;
      }
    });
  };

  // Test contract connection
  const testContractConnection = async () => {
    if (!web3) {
      console.log("❌ Web3 not initialized");
      return false;
    }

    const callId = "testContractConnection";

    return debouncedContractCall(callId, async () => {
      try {
        console.log("🔍 Testing contract connection...");
        console.log("📍 Contract Address:", CONTRACT_ADDRESS);
        console.log("🌐 Chain ID:", chainId);

        // Only log methods once to reduce console noise
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "📝 Available methods:",
            VotingABI.filter((item) => item.type === "function").map(
              (item) => item.name
            )
          );
        }

        const contract = new web3.eth.Contract(VotingABI, CONTRACT_ADDRESS);
        const candidates = await contract.methods.getAllCandidates().call();
        console.log(
          "✅ Contract connection successful. Candidates:",
          candidates
        );
        setError(null);
        return true;
      } catch (error) {
        console.error("❌ Contract connection failed:", error);
        setError(
          `Contract not found at ${CONTRACT_ADDRESS}. Please ensure blockchain is running and contract is deployed.`
        );
        return false;
      }
    });
  };

  // Admin function to reset voter (for testing)
  const resetVoter = async (voterAddress) => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      console.log("🔄 Resetting voter:", voterAddress);
      const contract = new web3.eth.Contract(VotingABI, CONTRACT_ADDRESS);

      // Check if current account is owner
      const owner = await contract.methods.owner().call();
      if (account.toLowerCase() !== owner.toLowerCase()) {
        throw new Error("Only contract owner can reset voters");
      }

      const result = await contract.methods.resetVoter(voterAddress).send({
        from: account,
      });

      console.log("✅ Voter reset successful:", result.transactionHash);
      return result;
    } catch (error) {
      console.error("❌ Reset voter failed:", error);
      throw error;
    }
  };

  // Admin function to reset all votes (for testing)
  const resetAllVotes = async () => {
    if (!web3 || !account) {
      throw new Error("Wallet not connected");
    }

    try {
      console.log("🔄 Resetting all votes...");
      const contract = new web3.eth.Contract(VotingABI, CONTRACT_ADDRESS);

      // Check if current account is owner
      const owner = await contract.methods.owner().call();
      if (account.toLowerCase() !== owner.toLowerCase()) {
        throw new Error("Only contract owner can reset all votes");
      }

      const result = await contract.methods.resetAllVotes().send({
        from: account,
      });

      console.log("✅ All votes reset successful:", result.transactionHash);
      return result;
    } catch (error) {
      console.error("❌ Reset all votes failed:", error);
      throw error;
    }
  };

  const value = {
    web3,
    account,
    chainId,
    isConnected,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchToLocalNetwork,
    voteOnBlockchain,
    getVoteCount,
    checkIfVoted,
    testContractConnection,
    resetVoter,
    resetAllVotes,
    CONTRACT_ADDRESS,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
