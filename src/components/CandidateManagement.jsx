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
import { candidateAPI, sessionAPI } from "../services/api";

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sessionId: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");

  useEffect(() => {
    fetchCandidates();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchCandidatesBySession();
    } else {
      fetchCandidates();
    }
  }, [selectedSession]);

  const fetchCandidates = async () => {
    try {
      const response = await candidateAPI.getAllCandidates();
      setCandidates(response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to fetch candidates" });
    }
  };

  const fetchCandidatesBySession = async () => {
    try {
      const response = await candidateAPI.getCandidatesBySession(
        selectedSession
      );
      setCandidates(response.data);
    } catch (error) {
      setMessage({
        type: "danger",
        text: "Failed to fetch candidates for session",
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
      const candidateData = {
        name: formData.name,
        session: { id: parseInt(formData.sessionId) },
      };

      await candidateAPI.createCandidate(candidateData);
      setMessage({ type: "success", text: "Candidate added successfully!" });
      setShowModal(false);
      setFormData({ name: "", sessionId: "" });

      if (selectedSession) {
        fetchCandidatesBySession();
      } else {
        fetchCandidates();
      }
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to add candidate" });
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

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center bg-warning text-dark">
              <h4 className="mb-0">👥 Candidates</h4>
              <Button variant="dark" onClick={() => setShowModal(true)}>
                <i className="fas fa-user-plus me-2"></i>
                Add Candidate
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

              {candidates.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <p className="text-muted">
                    No candidates found. Add your first candidate!
                  </p>
                </div>
              ) : (
                <div>
                  <Row>
                    {candidates.map((candidate) => (
                      <Col md={4} key={candidate.id} className="mb-3">
                        <Card className="h-100">
                          <Card.Body className="text-center">
                            <div className="candidate-avatar mb-3">
                              <i className="fas fa-user-circle fa-4x text-primary"></i>
                            </div>
                            <h5 className="card-title">{candidate.name}</h5>
                            <Badge bg="info" className="mb-2">
                              ID: {candidate.id}
                            </Badge>
                            {candidate.session && (
                              <p className="text-muted small">
                                Session: {getSessionTitle(candidate.session.id)}
                              </p>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Candidate Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Candidate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Candidate Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter candidate name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Voting Session</Form.Label>
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
                {loading ? "Adding..." : "Add Candidate"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CandidateManagement;
