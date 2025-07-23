import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { authAPI } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setMessage({ type: "danger", text: "Username is required" });
      return false;
    }

    if (formData.username.length < 3) {
      setMessage({
        type: "danger",
        text: "Username must be at least 3 characters long",
      });
      return false;
    }

    if (!formData.name.trim()) {
      setMessage({ type: "danger", text: "Full name is required" });
      return false;
    }

    if (formData.password.length < 6) {
      setMessage({
        type: "danger",
        text: "Password must be at least 6 characters long",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "danger", text: "Passwords do not match" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      console.log("📝 Attempting registration for:", formData.username);

      const response = await authAPI.register({
        username: formData.username.trim(),
        password: formData.password,
        name: formData.name.trim(),
      });

      console.log("✅ Registration successful:", response.data);

      setMessage({
        type: "success",
        text: "Registration successful! You can now login with your credentials.",
      });

      // Clear form
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("❌ Registration failed:", error);

      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      setMessage({ type: "danger", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Create Account
              </h2>
              <p className="mb-0 mt-2">Join the Blockchain Voting System</p>
            </Card.Header>
            <Card.Body className="p-4">
              {message.text && (
                <Alert
                  variant={message.type}
                  className="mb-4"
                  dismissible
                  onClose={() => setMessage({ type: "", text: "" })}
                >
                  {message.text}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-user me-2"></i>
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-user-circle me-2"></i>
                    Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Username must be at least 3 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="fas fa-lock me-2"></i>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <i className="fas fa-lock me-2"></i>
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="py-2"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none">
                    <i className="fas fa-sign-in-alt me-1"></i>
                    Sign In
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
