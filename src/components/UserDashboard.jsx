import { useState } from "react";
import { Container, Navbar, Nav, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import VotingDashboard from "./VotingDashboard";
import Results from "./Results";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("voting");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>
            <i className="fas fa-vote-yea me-2"></i>
            Voting System - Voter Panel
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="me-3">
              Welcome, {user?.name || user?.username}
            </Navbar.Text>
            <Nav>
              <Nav.Link onClick={handleLogout} className="text-light">
                <i className="fas fa-sign-out-alt me-1"></i>
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          variant="pills"
        >
          <Tab eventKey="voting" title="🗳️ Cast Vote">
            <VotingDashboard />
          </Tab>
          <Tab eventKey="results" title="📊 Results">
            <Results />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default UserDashboard;
