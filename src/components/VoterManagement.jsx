import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  Table,
  Row,
  Col,
  Alert,
  Modal,
  Badge,
} from "react-bootstrap";
import { voterAPI, sessionAPI } from "../services/api";

const VoterManagement = () => {
  const [voters, setVoters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sessionId: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    fetchVoters();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchVotersBySession();
    } else {
      fetchVoters();
    }
  }, [selectedSession]);

  const fetchVoters = async () => {
    try {
      const response = await voterAPI.getAllVoters();
      setVoters(response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to fetch voters" });
    }
  };

  const fetchVotersBySession = async () => {
    try {
      const response = await voterAPI.getVotersBySession(selectedSession);
      setVoters(response.data);
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Failed to fetch voters for session",
      });
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await sessionAPI.getAllSessions();
      setSessions(response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to fetch sessions" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createVoterRequest = {
        name: formData.name,
        email: formData.email,
        sessionId: parseInt(formData.sessionId),
      };

      await voterAPI.createVoter(createVoterRequest);
      setMessage({
        type: "success",
        text: "Voter registered successfully! An email with voter ID has been sent.",
      });
      setShowModal(false);
      setFormData({ name: "", email: "", sessionId: "" });

      if (selectedSession) {
        fetchVotersBySession();
      } else {
        fetchVoters();
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to register voter";
      setMessage({
        type: "danger",
        text:
          typeof errorMessage === "string"
            ? errorMessage
            : "Failed to register voter",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getSessionTitle = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    return session ? session.title : "Unknown Session";
  };

  const handleResendEmail = async (voterId) => {
    try {
      setMessage({
        type: "info",
        text: "Sending voter ID email... This may take a few moments.",
      });

      await voterAPI.resendVoterEmail(voterId);
      setMessage({
        type: "success",
        text: "Voter ID email resent successfully!",
      });
    } catch (error) {
      console.error("Resend email error:", error);
      setMessage({
        type: "danger",
        text:
          "Failed to resend email: " +
          (error.response?.data?.message || error.message),
      });
    }
  };

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center bg-success text-white">
              <h4 className="mb-0">🆔 Registered Voters</h4>
              <Button variant="light" onClick={() => setShowModal(true)}>
                <i className="fas fa-user-plus me-2"></i>
                Register Voter
              </Button>
            </Card.Header>
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} className="mb-3">
                  {message.text}
                </Alert>
              )}

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Filter by Session</Form.Label>
                    <Form.Select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                    >
                      <option value="">All Sessions</option>
                      {sessions.map((session) => (
                        <option key={session.id} value={session.id}>
                          {session.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {voters.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-id-card fa-3x text-muted mb-3"></i>
                  <p className="text-muted">
                    No voters registered. Register your first voter!
                  </p>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Voter ID</th>
                      <th>Session</th>
                      <th>Voting Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voters.map((voter) => (
                      <tr key={voter.id}>
                        <td>{voter.id}</td>
                        <td>
                          <strong>{voter.name || "N/A"}</strong>
                        </td>
                        <td>
                          <small className="text-muted">
                            {voter.email || "N/A"}
                          </small>
                        </td>
                        <td>
                          <code>{voter.voterId}</code>
                        </td>
                        <td>
                          {voter.session
                            ? getSessionTitle(voter.session.id)
                            : "N/A"}
                        </td>
                        <td>
                          <Badge bg={voter.hasVoted ? "success" : "warning"}>
                            {voter.hasVoted ? (
                              <>
                                <i className="fas fa-check me-1"></i>
                                Voted
                              </>
                            ) : (
                              <>
                                <i className="fas fa-clock me-1"></i>
                                Not Voted
                              </>
                            )}
                          </Badge>
                        </td>
                        <td>
                          {voter.email && (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleResendEmail(voter.voterId)}
                              title="Resend voter ID email"
                            >
                              <i className="fas fa-envelope"></i>
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              <div className="mt-4">
                <Row>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <h3 className="text-primary">{voters.length}</h3>
                        <p className="text-muted mb-0">Total Voters</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <h3 className="text-success">
                          {voters.filter((v) => v.hasVoted).length}
                        </h3>
                        <p className="text-muted mb-0">Voted</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <h3 className="text-warning">
                          {voters.filter((v) => !v.hasVoted).length}
                        </h3>
                        <p className="text-muted mb-0">Not Voted</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <h3 className="text-info">
                          {voters.length > 0
                            ? Math.round(
                                (voters.filter((v) => v.hasVoted).length /
                                  voters.length) *
                                  100
                              )
                            : 0}
                          %
                        </h3>
                        <p className="text-muted mb-0">Turnout</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Register Voter Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Voter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter voter's full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Form.Text className="text-muted">
                This will be used in the email notification
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter voter's email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Form.Text className="text-muted">
                Voter ID will be sent to this email address
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Voting Session *</Form.Label>
              <Form.Select
                name="sessionId"
                value={formData.sessionId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a session...</option>
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register Voter"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VoterManagement;
