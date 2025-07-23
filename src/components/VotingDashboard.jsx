import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { sessionAPI, candidateAPI, votingAPI } from "../services/api";
import { useWeb3 } from "../contexts/Web3Context";
import WalletConnection from "./WalletConnection";

const VotingDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [voterId, setVoterId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [hasVotedOnBlockchain, setHasVotedOnBlockchain] = useState(false);
  const [contractStatus, setContractStatus] = useState("unchecked");

  const {
    isConnected,
    account,
    voteOnBlockchain,
    checkIfVoted,
    testContractConnection,
    error: web3Error,
  } = useWeb3();

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchCandidates();
    }
  }, [selectedSession]);

  useEffect(() => {
    if (isConnected && account) {
      // Only check once when wallet is connected - no polling
      checkVotingStatusOnce();
      testContract();
    }
  }, [isConnected, account]);

  // New function to check voting status just once
  const checkVotingStatusOnce = async () => {
    try {
      console.log("🔍 Checking voting status once for:", account);
      const voted = await checkIfVoted();
      setHasVotedOnBlockchain(voted);
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  };

  const testContract = async () => {
    setContractStatus("testing");
    const isConnected = await testContractConnection();
    setContractStatus(isConnected ? "connected" : "failed");
  };

  const fetchSessions = async () => {
    try {
      const response = await sessionAPI.getAllSessions();
      setSessions(response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to fetch sessions" });
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await candidateAPI.getCandidatesBySession(
        selectedSession
      );
      setCandidates(response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to fetch candidates" });
    }
  };

  const checkVotingStatus = async () => {
    try {
      console.log("🔄 Refreshing voting status for address:", account);
      const voted = await checkIfVoted();
      setHasVotedOnBlockchain(voted);
      return voted;
    } catch (error) {
      console.error("Error checking vote status:", error);
      return false;
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();

    if (!selectedSession || !selectedCandidate || !voterId) {
      setMessage({ type: "warning", text: "Please fill in all fields" });
      return;
    }

    if (!isConnected) {
      setMessage({
        type: "warning",
        text: "Please connect your MetaMask wallet first",
      });
      return;
    }

    if (hasVotedOnBlockchain) {
      setMessage({
        type: "warning",
        text: "You have already voted on the blockchain",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // First, cast vote on blockchain using MetaMask
      console.log("🔗 Casting vote on blockchain...");
      console.log("Selected candidate:", selectedCandidate);
      setMessage({ type: "info", text: "Casting vote on blockchain..." });
      const blockchainResult = await voteOnBlockchain(selectedCandidate);

      console.log(
        "✅ Blockchain vote successful, transaction hash:",
        blockchainResult.transactionHash
      );
      setMessage({
        type: "info",
        text: "Blockchain vote successful! Saving to database...",
      });

      // Then, record vote in the database (only if blockchain vote succeeds)
      const voteData = {
        sessionId: parseInt(selectedSession),
        candidateName: selectedCandidate,
        voterId,
        walletAddress: account,
        transactionHash: blockchainResult.transactionHash, // Include blockchain transaction hash
      };

      console.log("�️ Recording vote in database...");
      await votingAPI.castVote(voteData);

      setMessage({
        type: "success",
        text: `🎉 Vote cast successfully! ✅ Blockchain recorded ✅ Database saved | Transaction: ${blockchainResult.transactionHash}`,
      });

      // Clear form
      setSelectedCandidate("");
      setVoterId("");
      setHasVotedOnBlockchain(true);
    } catch (error) {
      console.error("❌ Vote failed:", error);

      let errorMessage = "Failed to cast vote";
      let errorStage = "Unknown";

      // Determine if error is from blockchain or backend
      if (error.response) {
        // This is a backend API error (happened during database save)
        errorStage = "Database save";
        if (error.response?.data?.message) {
          errorMessage = `Database error: ${error.response.data.message}`;
        } else if (error.response?.data) {
          errorMessage =
            typeof error.response.data === "string"
              ? `Database error: ${error.response.data}`
              : "Database error occurred after blockchain vote";
        }
      } else {
        // This is a blockchain error (happened during blockchain vote)
        errorStage = "Blockchain transaction";
        if (error.message.includes("already voted")) {
          errorMessage =
            "Blockchain error: You have already voted with this wallet address";
        } else if (error.message.includes("User denied")) {
          errorMessage = "Blockchain error: Transaction cancelled by user";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Blockchain error: Insufficient funds for gas fee";
        } else if (error.message.includes("Contract not found")) {
          errorMessage =
            "Blockchain error: Smart contract not deployed. Please check blockchain setup.";
        } else if (error.message.includes("Invalid candidate")) {
          errorMessage =
            "Blockchain error: Candidate not found in smart contract";
        } else if (error.message) {
          errorMessage = `Blockchain error: ${error.message}`;
        }
      }

      setMessage({
        type: "danger",
        text: `${errorMessage} (Failed at: ${errorStage})`,
      });

      // Additional debugging info
      console.log("🔍 Error details:");
      console.log("  Error stage:", errorStage);
      console.log("  Error type:", error.constructor.name);
      console.log("  Error message:", error.message);
      if (error.response) {
        console.log("  Response status:", error.response?.status);
        console.log("  Response data:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const onWalletConnected = (connectedAccount) => {
    console.log("✅ Wallet connected:", connectedAccount);
    setMessage({ type: "success", text: "Wallet connected successfully!" });
    checkVotingStatus();
  };

  return (
    <div>
      <Row>
        <Col md={8} className="mx-auto">
          {/* MetaMask Wallet Connection */}
          <WalletConnection onWalletConnected={onWalletConnected} />

          {/* Voting Form */}
          <Card>
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-vote-yea me-2"></i>
                Cast Your Vote
              </h4>
            </Card.Header>
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} className="mb-3">
                  {message.text}
                </Alert>
              )}

              {web3Error && (
                <Alert variant="warning" className="mb-3">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {web3Error}
                  <hr />
                  <small>
                    <strong>Troubleshooting:</strong>
                    <br />• Ensure Hardhat network is running:{" "}
                    <code>npx hardhat node</code>
                    <br />• Deploy contract:{" "}
                    <code>
                      npx hardhat run scripts/deploy.js --network localhost
                    </code>
                    <br />• Update contract address in Web3Context.jsx
                  </small>
                </Alert>
              )}

              {/* Contract Status Indicator */}
              {isConnected && (
                <Alert
                  variant={
                    contractStatus === "connected"
                      ? "success"
                      : contractStatus === "failed"
                      ? "danger"
                      : "info"
                  }
                  className="mb-3"
                >
                  <i
                    className={`fas ${
                      contractStatus === "connected"
                        ? "fa-check-circle"
                        : contractStatus === "failed"
                        ? "fa-times-circle"
                        : "fa-spinner fa-spin"
                    } me-2`}
                  ></i>
                  Contract Status:{" "}
                  {contractStatus === "connected"
                    ? "✅ Connected"
                    : contractStatus === "failed"
                    ? "❌ Not Found"
                    : "🔍 Testing..."}
                  {contractStatus === "failed" && (
                    <div className="mt-2">
                      <small>
                        <strong>Steps to fix:</strong>
                        <br />
                        1. Run: <code>start-blockchain.bat</code>
                        <br />
                        2. Or manually: <code>npx hardhat node</code> then{" "}
                        <code>
                          npx hardhat run scripts/deploy.js --network localhost
                        </code>
                      </small>
                    </div>
                  )}
                </Alert>
              )}

              {hasVotedOnBlockchain && (
                <Alert variant="info" className="mb-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Now You have voted on the blockchain with this wallet address.
                </Alert>
              )}

              {isConnected && account && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="mb-3"
                  onClick={async () => {
                    try {
                      // Show loading state
                      setContractStatus("testing");
                      setMessage({
                        type: "info",
                        text: "Refreshing voting status...",
                      });

                      // Check voting status
                      const voted = await checkVotingStatus();

                      // Check contract connection
                      const isConnected = await testContractConnection();
                      setContractStatus(isConnected ? "connected" : "failed");

                      // Show success message
                      setMessage({
                        type: "success",
                        text: `Voting status refreshed: ${
                          voted ? "You have voted" : "You have not voted yet"
                        }`,
                      });

                      // Auto-clear message after 3 seconds
                      setTimeout(() => {
                        setMessage({ type: "", text: "" });
                      }, 3000);
                    } catch (error) {
                      console.error("Error refreshing status:", error);
                      setMessage({
                        type: "danger",
                        text:
                          "Failed to refresh voting status: " + error.message,
                      });
                    }
                  }}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh Voting Status
                </Button>
              )}

              <Form onSubmit={handleVote}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Select Voting Session</Form.Label>
                      <Form.Select
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        required
                      >
                        <option value="">Choose a session...</option>
                        {sessions.map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Voter ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your voter ID"
                        value={voterId}
                        onChange={(e) => setVoterId(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {candidates.length > 0 && (
                  <Form.Group className="mb-3">
                    <Form.Label>Select Candidate</Form.Label>
                    <div className="d-flex flex-wrap">
                      {candidates.map((candidate) => (
                        <Card
                          key={candidate.id}
                          className={`candidate-card ${
                            selectedCandidate === candidate.name
                              ? "border-primary"
                              : ""
                          }`}
                          style={{
                            cursor: "pointer",
                            margin: "10px",
                            width: "150px",
                          }}
                          onClick={() => setSelectedCandidate(candidate.name)}
                        >
                          <Card.Body className="text-center p-3">
                            <div className="candidate-avatar mb-2">
                              <i className="fas fa-user-circle fa-2x text-secondary"></i>
                            </div>
                            <h6 className="mb-1">{candidate.name}</h6>
                            {selectedCandidate === candidate.name && (
                              <Badge bg="primary">Selected</Badge>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Form.Group>
                )}

                {isConnected && account && (
                  <Alert variant="info" className="mb-3">
                    <strong>Connected Wallet:</strong> {account.substring(0, 6)}
                    ...{account.substring(account.length - 4)}
                    <br />
                    <small>
                      Your vote will be recorded using this wallet address
                    </small>
                  </Alert>
                )}

                <Button
                  variant="success"
                  type="submit"
                  size="lg"
                  className="w-100"
                  disabled={loading || !isConnected || hasVotedOnBlockchain}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing Vote...
                    </>
                  ) : hasVotedOnBlockchain ? (
                    <>
                      <i className="fas fa-check-circle me-2"></i>
                      Already Voted
                    </>
                  ) : !isConnected ? (
                    <>
                      <i className="fas fa-wallet me-2"></i>
                      Connect Wallet to Vote
                    </>
                  ) : (
                    <>
                      <i className="fas fa-vote-yea me-2"></i>
                      Vote on Blockchain & Save
                    </>
                  )}
                </Button>
              </Form>

              <div className="mt-3 text-center">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Your vote is first secured on blockchain, then saved to
                  database
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VotingDashboard;
