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
  Spinner,
} from "react-bootstrap";
import { sessionAPI, testConnection } from "../services/api";

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("checking");

  useEffect(() => {
    checkBackendConnection();
    fetchSessions();
  }, []);

  const checkBackendConnection = async () => {
    console.log("Checking backend connection...");
    const result = await testConnection();
    setConnectionStatus(result.success ? "connected" : "disconnected");

    if (!result.success) {
      console.error("Connection failed:", result);
      setMessage({
        type: "danger",
        text: `Backend connection failed: ${result.error}. Please ensure the Spring Boot backend is running on http://localhost:8080`,
      });
    } else {
      setMessage({ type: "", text: "" }); // Clear error messages
    }
  };

  useEffect(() => {
    checkBackendConnection();
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      console.log("Fetching sessions...");
      const response = await sessionAPI.getAllSessions();
      console.log("Sessions response:", response.data);
      setSessions(response.data || []);
      setMessage({ type: "", text: "" }); // Clear any previous error messages
    } catch (error) {
      console.error("Error fetching sessions:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch sessions. Please check if the backend server is running.";
      setMessage({ type: "danger", text: errorMessage });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      await sessionAPI.createSession(sessionData);
      setMessage({ type: "success", text: "Session created successfully!" });
      setShowModal(false);
      setFormData({ title: "", startTime: "", endTime: "" });
      fetchSessions();
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to create session" });
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

  const getSessionStatus = (session) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);

    if (now < start) return { status: "upcoming", variant: "secondary" };
    if (now >= start && now <= end)
      return { status: "active", variant: "success" };
    return { status: "ended", variant: "danger" };
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      {/* Connection Status Indicator */}
      <Row className="mb-3">
        <Col>
          <Alert
            variant={
              connectionStatus === "connected"
                ? "success"
                : connectionStatus === "disconnected"
                ? "danger"
                : "warning"
            }
          >
            <div className="d-flex align-items-center">
              {connectionStatus === "checking" && (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Checking backend connection...
                </>
              )}
              {connectionStatus === "connected" && (
                <>
                  <i className="fas fa-check-circle me-2"></i>
                  Backend server connected (http://localhost:8080)
                </>
              )}
              {connectionStatus === "disconnected" && (
                <>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Backend server not reachable! Please start your Spring Boot
                  backend on port 8080.
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="ms-2"
                    onClick={checkBackendConnection}
                  >
                    Retry
                  </Button>
                </>
              )}
            </div>
          </Alert>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center bg-info text-white">
              <h4 className="mb-0">📝 Voting Sessions</h4>
              <div>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="me-2"
                  onClick={fetchSessions}
                  disabled={connectionStatus !== "connected"}
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  Refresh
                </Button>
                <Button
                  variant="light"
                  onClick={() => setShowModal(true)}
                  disabled={connectionStatus !== "connected"}
                >
                  <i className="fas fa-plus me-2"></i>
                  Create Session
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} className="mb-3">
                  {message.text}
                </Alert>
              )}

              {sessions.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <p className="text-muted">
                    No voting sessions found. Create your first session!
                  </p>
                </div>
              ) : (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => {
                      const sessionStatus = getSessionStatus(session);
                      return (
                        <tr key={session.id}>
                          <td>{session.id}</td>
                          <td>
                            <strong>{session.title}</strong>
                          </td>
                          <td>{formatDateTime(session.startTime)}</td>
                          <td>{formatDateTime(session.endTime)}</td>
                          <td>
                            <Badge bg={sessionStatus.variant}>
                              {sessionStatus.status.toUpperCase()}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Session Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Voting Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Session Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter session title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Session"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SessionManagement;
