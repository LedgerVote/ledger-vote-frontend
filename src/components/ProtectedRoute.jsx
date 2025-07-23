import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner, Container } from "react-bootstrap";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;
