import { useState } from "react";
import { Card, Button, Alert, Form, Row, Col } from "react-bootstrap";
import axios from "axios";

const DebugConnection = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testEndpoints = [
    { name: "Root", url: "http://localhost:8080" },
    { name: "Sessions API", url: "http://localhost:8080/api/session" },
    { name: "Candidates API", url: "http://localhost:8080/api/candidate" },
    { name: "Voters API", url: "http://localhost:8080/api/voter" },
    { name: "Voting API", url: "http://localhost:8080/api/vote/results" },
  ];

  const testConnection = async (endpoint) => {
    try {
      const response = await axios.get(endpoint.url, { timeout: 5000 });
      return {
        ...endpoint,
        status: "success",
        message: `✅ Connected! Status: ${response.status}`,
        data: response.data,
      };
    } catch (error) {
      return {
        ...endpoint,
        status: "error",
        message: `❌ Failed: ${error.message}`,
        error: error.code || error.response?.status || "Unknown error",
      };
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    const testResults = [];
    for (const endpoint of testEndpoints) {
      const result = await testConnection(endpoint);
      testResults.push(result);
      setResults([...testResults]); // Update results as we go
    }

    setLoading(false);
  };

  return (
    <Card>
      <Card.Header className="bg-dark text-white">
        <h5 className="mb-0">🔧 Backend Connection Debugger</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col>
            <Button variant="primary" onClick={runAllTests} disabled={loading}>
              {loading ? "Testing..." : "Test All Endpoints"}
            </Button>
          </Col>
        </Row>

        {results.length > 0 && (
          <div>
            <h6>Test Results:</h6>
            {results.map((result, index) => (
              <Alert
                key={index}
                variant={result.status === "success" ? "success" : "danger"}
                className="mb-2"
              >
                <div>
                  <strong>{result.name}</strong> ({result.url})
                </div>
                <div>{result.message}</div>
                {result.error && (
                  <small className="text-muted">
                    Error Code: {result.error}
                  </small>
                )}
                {result.data && (
                  <details className="mt-2">
                    <summary>Response Data</summary>
                    <pre className="mt-2" style={{ fontSize: "0.8rem" }}>
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </Alert>
            ))}
          </div>
        )}

        <hr />
        <div className="mt-3">
          <h6>Backend Setup Checklist:</h6>
          <ul>
            <li>✅ Java 17+ installed</li>
            <li>❓ MySQL server running on localhost:3306</li>
            <li>❓ Database 'voting_db' created</li>
            <li>❓ Spring Boot application started</li>
            <li>❓ Application running on port 8080</li>
          </ul>

          <Alert variant="info">
            <h6>How to start the backend:</h6>
            <ol>
              <li>Navigate to the voting-backend directory</li>
              <li>
                Run: <code>./mvnw spring-boot:run</code> (Linux/Mac) or{" "}
                <code>mvnw.cmd spring-boot:run</code> (Windows)
              </li>
              <li>Wait for "Started VotingBackendApplication" message</li>
              <li>Backend should be available at http://localhost:8080</li>
            </ol>
          </Alert>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DebugConnection;
