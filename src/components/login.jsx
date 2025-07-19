import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      console.log("🔐 Attempting login with:", formData.username);
      
      const response = await authAPI.login({
        username: formData.username,
        password: formData.password,
      });

      console.log("✅ Login successful:", response.data);
      
      const userData = response.data;
      login(userData);

      // Redirect based on role
      if (userData.role === "admin") {
        navigate("/admin");
        setMessage({ type: "success", text: `Welcome ${userData.name}! Redirecting to Admin Panel...` });
      } else {
        navigate("/user");
        setMessage({ type: "success", text: `Welcome ${userData.name}! Redirecting to Voter Dashboard...` });
      }

    } catch (error) {
      console.error("❌ Login failed:", error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Login failed. Please check your credentials.";
      
      setMessage({ type: "danger", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="fas fa-vote-yea me-2"></i>
                Login to Voting System
              </h4>
            </Card.Header>
            <Card.Body>
              {message.text && (
                <Alert variant={message.type} className="mb-3">
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoComplete="username"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </>
                  )}
                </Button>
              </Form>

              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="text-muted mb-2">
                  <i className="fas fa-info-circle me-2"></i>
                  Test Credentials:
                </h6>
                <div className="small">
                  <div className="mb-2">
                    <strong>👤 Admin Accounts:</strong>
                    <br />
                    <code>admin / admin123</code>
                    <br />
                    <code>manager / manager123</code>
                  </div>
                  <div>
                    <strong>👥 Voter Accounts:</strong>
                    <br />
                    <code>voter1 / voter123</code>
                    <br />
                    <code>voter2 / voter123</code>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;