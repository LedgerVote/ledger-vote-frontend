import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Alert,
  ProgressBar,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { votingAPI, sessionAPI } from "../services/api";

const Results = () => {
  const [results, setResults] = useState({});
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [sessionResults, setSessionResults] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOverallResults();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchSessionResults();
    }
  }, [selectedSession]);

  const fetchOverallResults = async () => {
    try {
      const response = await votingAPI.getResults();
      setResults(response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to fetch overall results" });
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

  const fetchSessionResults = async () => {
    setLoading(true);
    try {
      const response = await sessionAPI.getSessionResults(selectedSession);
      setSessionResults(response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Failed to fetch session results" });
      setSessionResults({});
    } finally {
      setLoading(false);
    }
  };

  const getTotalVotes = (resultsData) => {
    return Object.values(resultsData).reduce(
      (total, votes) => total + votes,
      0
    );
  };

  const getPercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const renderResultsChart = (resultsData, title) => {
    const totalVotes = getTotalVotes(resultsData);
    const sortedCandidates = Object.entries(resultsData).sort(
      (a, b) => b[1] - a[1]
    );

    return (
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">{title}</h5>
        </Card.Header>
        <Card.Body>
          {totalVotes === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
              <p className="text-muted">No votes cast yet</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <Row>
                  <Col md={6}>
                    <h6>
                      Total Votes: <Badge bg="info">{totalVotes}</Badge>
                    </h6>
                  </Col>
                  <Col md={6} className="text-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      <i className="fas fa-sync-alt me-1"></i>
                      Refresh
                    </Button>
                  </Col>
                </Row>
              </div>

              {sortedCandidates.map(([candidate, votes], index) => {
                const percentage = getPercentage(votes, totalVotes);
                const isWinner = index === 0 && votes > 0;

                return (
                  <div key={candidate} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">
                        {isWinner && (
                          <i className="fas fa-crown text-warning me-2"></i>
                        )}
                        {candidate}
                      </h6>
                      <div>
                        <Badge
                          bg={isWinner ? "success" : "secondary"}
                          className="me-2"
                        >
                          {votes} votes
                        </Badge>
                        <Badge bg={isWinner ? "warning" : "light"} text="dark">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar
                      now={percentage}
                      variant={isWinner ? "success" : "primary"}
                      style={{ height: "10px" }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div>
      {message.text && (
        <Alert variant={message.type} className="mb-3">
          {message.text}
        </Alert>
      )}

      <Row>
        <Col md={6}>
          {renderResultsChart(results, "📊 Overall Results (All Sessions)")}
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">🔍 Session-Specific Results</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Select Session</Form.Label>
                <Form.Select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                >
                  <option value="">Choose a session...</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {loading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {selectedSession &&
                !loading &&
                Object.keys(sessionResults).length > 0 && (
                  <div>
                    {Object.entries(sessionResults).map(
                      ([candidate, votes]) => {
                        const totalSessionVotes = getTotalVotes(sessionResults);
                        const percentage = getPercentage(
                          votes,
                          totalSessionVotes
                        );

                        return (
                          <div key={candidate} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>{candidate}</span>
                              <div>
                                <Badge bg="secondary" className="me-2">
                                  {votes} votes
                                </Badge>
                                <Badge bg="light" text="dark">
                                  {percentage}%
                                </Badge>
                              </div>
                            </div>
                            <ProgressBar
                              now={percentage}
                              variant="info"
                              style={{ height: "8px" }}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                )}

              {selectedSession &&
                !loading &&
                Object.keys(sessionResults).length === 0 && (
                  <div className="text-center py-4">
                    <i className="fas fa-vote-yea fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No votes in this session yet</p>
                  </div>
                )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mt-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-poll fa-3x text-primary mb-3"></i>
              <h4 className="text-primary">{sessions.length}</h4>
              <p className="text-muted mb-0">Total Sessions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-users fa-3x text-success mb-3"></i>
              <h4 className="text-success">{Object.keys(results).length}</h4>
              <p className="text-muted mb-0">Total Candidates</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-vote-yea fa-3x text-warning mb-3"></i>
              <h4 className="text-warning">{getTotalVotes(results)}</h4>
              <p className="text-muted mb-0">Total Votes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <i className="fas fa-crown fa-3x text-danger mb-3"></i>
              <h4 className="text-danger">
                {Object.keys(results).length > 0
                  ? Object.entries(results).sort(
                      (a, b) => b[1] - a[1]
                    )[0]?.[0] || "N/A"
                  : "N/A"}
              </h4>
              <p className="text-muted mb-0">Leading Candidate</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Results;
