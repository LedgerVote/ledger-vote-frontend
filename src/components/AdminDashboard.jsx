import { useState } from "react";
import { Container, Navbar, Nav, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import SessionManagement from "./SessionManagement";
import CandidateManagement from "./CandidateManagement";
import VoterManagement from "./VoterManagement";
import Results from "./Results";
import DebugConnection from "./DebugConnection";
import ContractDebug from "./ContractDebug";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="App">
      <Navbar bg="danger" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>
            <i className="fas fa-shield-alt me-2"></i>
            Voting System - Admin Panel
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="me-3">
              Admin: {user?.name || user?.username}
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
          <Tab eventKey="sessions" title="📝 Sessions">
            <SessionManagement />
          </Tab>
          <Tab eventKey="candidates" title="👥 Candidates">
            <CandidateManagement />
          </Tab>
          <Tab eventKey="voters" title="🆔 Voters">
            <VoterManagement />
          </Tab>
          <Tab eventKey="results" title="📊 Results">
            <Results />
          </Tab>
          <Tab eventKey="debug" title="🔧 Debug">
            <DebugConnection />
          </Tab>
          <Tab eventKey="contract" title="⛓️ Contract">
            <ContractDebug />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default AdminDashboard;
