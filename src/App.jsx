import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import VoterProtectedRoute from "./components/VoterProtectedRoute";
import Home from "./pages/Home";
import Faq from "./pages/Faq";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";

import NotFountPage from "./pages/NotFountPage";
import ActiveSessions from "./pages/Dashboard/ActiveSessions";
import Voting from "./pages/Dashboard/Voting";
import LiveResults from "./pages/Dashboard/LiveResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HandleVoters from "./pages/Dashboard/HandleVoters";
// import CreateSessions from "./pages/Dashboard/CreateSessions";
import CreateSession from "./pages/Dashboard/CreateSession";
import VoterRegistration from "./pages/VoterRegistration";
import VoterLogin from "./pages/VoterLogin";
import VoterDashboard from "./pages/VoterDashboard";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<Faq />} />{" "}
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Voter Routes */}
            <Route
              path="/voter/register/:token"
              element={<VoterRegistration />}
            />
            <Route path="/voter/login" element={<VoterLogin />} />
            <Route
              path="/voter/dashboard"
              element={
                <VoterProtectedRoute>
                  <VoterDashboard />
                </VoterProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />{" "}
            <Route
              path="/dashboard/createsession"
              element={
                <ProtectedRoute requiredUserType="admin">
                  <CreateSession />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/handleVoters"
              element={
                <ProtectedRoute requiredUserType="admin">
                  <HandleVoters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/activeSessions"
              element={
                <ProtectedRoute>
                  <ActiveSessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/voting"
              element={
                <ProtectedRoute requiredUserType="voter">
                  <Voting />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/liveResults"
              element={
                <ProtectedRoute>
                  <LiveResults />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFountPage />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                theme: {
                  primary: "#4aed88",
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
