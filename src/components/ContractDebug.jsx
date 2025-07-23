import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Alert,
  Badge,
  ListGroup,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useWeb3 } from "../contexts/Web3Context";

const ContractDebug = () => {
  const {
    web3,
    account,
    chainId,
    isConnected,
    CONTRACT_ADDRESS,
    testContractConnection,
    getVoteCount,
    resetVoter,
    resetAllVotes,
  } = useWeb3();

  const [contractStatus, setContractStatus] = useState("Unknown");
  const [candidates, setCandidates] = useState([]);
  const [blockNumber, setBlockNumber] = useState(null);
  const [resetAddress, setResetAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (isConnected && web3) {
      checkContractStatus();
      getCurrentBlock();
      checkOwnership();
    }
  }, [isConnected, web3]);

  const checkOwnership = async () => {
    if (!web3 || !account) return;

    try {
      const contract = new web3.eth.Contract(
        [
          {
            inputs: [],
            name: "owner",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        CONTRACT_ADDRESS
      );

      const owner = await contract.methods.owner().call();
      setIsOwner(account.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.error("Failed to check ownership:", error);
    }
  };

  const checkContractStatus = async () => {
    try {
      const isConnected = await testContractConnection();
      setContractStatus(isConnected ? "Connected" : "Not Found");

      if (isConnected) {
        await loadCandidates();
      }
    } catch (error) {
      setContractStatus("Error");
      console.error("Contract check failed:", error);
    }
  };

  const getCurrentBlock = async () => {
    if (web3) {
      try {
        const block = await web3.eth.getBlockNumber();
        setBlockNumber(block);
      } catch (error) {
        console.error("Failed to get block number:", error);
      }
    }
  };

  const loadCandidates = async () => {
    if (!web3) return;

    try {
      const contract = new web3.eth.Contract(
        [
          {
            inputs: [],
            name: "getAllCandidates",
            outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "string", name: "candidate", type: "string" },
            ],
            name: "getVotes",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        CONTRACT_ADDRESS
      );

      const candidateNames = await contract.methods.getAllCandidates().call();

      const candidatesWithVotes = await Promise.all(
        candidateNames.map(async (name) => {
          const votes = await getVoteCount(name);
          return { name, votes };
        })
      );

      setCandidates(candidatesWithVotes);
    } catch (error) {
      console.error("Failed to load candidates:", error);
    }
  };

  const handleResetVoter = async () => {
    if (!resetAddress) {
      setMessage({ type: "warning", text: "Please enter a wallet address" });
      return;
    }

    try {
      setMessage({ type: "info", text: "Resetting voter..." });
      await resetVoter(resetAddress);
      setMessage({
        type: "success",
        text: `Successfully reset voter: ${resetAddress}`,
      });
      setResetAddress("");
    } catch (error) {
      setMessage({
        type: "danger",
        text: `Failed to reset voter: ${error.message}`,
      });
    }
  };

  const handleResetAllVotes = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset ALL votes? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      setMessage({ type: "info", text: "Resetting all votes..." });
      await resetAllVotes();
      setMessage({ type: "success", text: "Successfully reset all votes" });
      await loadCandidates(); // Refresh candidates
    } catch (error) {
      setMessage({
        type: "danger",
        text: `Failed to reset all votes: ${error.message}`,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Connected":
        return "success";
      case "Not Found":
        return "danger";
      case "Error":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <i className="fas fa-bug me-2"></i>
            Contract Debug Information
          </h5>
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <strong>Network Status:</strong>
            <Badge
              bg={chainId === 31337 ? "success" : "warning"}
              className="ms-2"
            >
              Chain ID: {chainId || "Not Connected"}
            </Badge>
          </div>

          <div className="mb-3">
            <strong>Current Block:</strong>
            <Badge bg="info" className="ms-2">
              #{blockNumber || "Unknown"}
            </Badge>
          </div>

          <div className="mb-3">
            <strong>Contract Address:</strong>
            <br />
            <code>{CONTRACT_ADDRESS}</code>
          </div>

          <div className="mb-3">
            <strong>Contract Status:</strong>
            <Badge bg={getStatusColor(contractStatus)} className="ms-2">
              {contractStatus}
            </Badge>
          </div>

          <div className="mb-3">
            <strong>Connected Account:</strong>
            <br />
            <code>{account || "Not Connected"}</code>
            {isOwner && (
              <Badge bg="warning" className="ms-2">
                Contract Owner
              </Badge>
            )}
          </div>

          {candidates.length > 0 && (
            <div className="mb-3">
              <strong>Blockchain Candidates & Votes:</strong>
              <ListGroup className="mt-2">
                {candidates.map((candidate, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {candidate.name}
                    <Badge bg="primary" pill>
                      {candidate.votes} votes
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          <Button
            variant="outline-primary"
            onClick={checkContractStatus}
            className="me-2"
          >
            <i className="fas fa-sync me-1"></i>
            Refresh Status
          </Button>

          <Button
            variant="outline-secondary"
            onClick={() => window.open(`http://localhost:8545`, "_blank")}
          >
            <i className="fas fa-external-link-alt me-1"></i>
            Open RPC
          </Button>
        </Card.Body>
      </Card>

      {/* Admin Reset Functions */}
      {isOwner && (
        <Card>
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">
              <i className="fas fa-tools me-2"></i>
              Admin Testing Tools
            </h5>
          </Card.Header>
          <Card.Body>
            {message.text && (
              <Alert variant={message.type} className="mb-3">
                {message.text}
              </Alert>
            )}

            <div className="mb-4">
              <h6>Reset Individual Voter</h6>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter wallet address (0x...)"
                  value={resetAddress}
                  onChange={(e) => setResetAddress(e.target.value)}
                />
                <Button
                  variant="warning"
                  onClick={handleResetVoter}
                  disabled={!resetAddress}
                >
                  <i className="fas fa-undo me-1"></i>
                  Reset Voter
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                This allows the specified address to vote again.
              </Form.Text>
            </div>

            <div className="mb-3">
              <h6>Reset All Votes</h6>
              <Button variant="danger" onClick={handleResetAllVotes}>
                <i className="fas fa-trash me-1"></i>
                Reset All Votes
              </Button>
              <Form.Text className="text-muted d-block">
                ⚠️ This will reset ALL vote counts to zero. Use for testing
                only.
              </Form.Text>
            </div>

            <Alert variant="info">
              <strong>🔑 Available Test Accounts:</strong>
              <br />
              Run <code>node scripts/show-accounts.js</code> in the blockchain
              folder to see all available test accounts. Import different
              private keys into MetaMask to test with multiple voters.
            </Alert>
          </Card.Body>
        </Card>
      )}

      {!isOwner && isConnected && (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          You are not the contract owner. Admin tools are only available to the
          contract deployer.
        </Alert>
      )}
    </div>
  );
};

export default ContractDebug;
