
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Faq from './pages/Faq';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import CreateSessions from './pages/Dashboard/CreateSessions';
import NotFountPage from './pages/NotFountPage';
import ActiveSessions from './pages/Dashboard/ActiveSessions';
import Voting from './pages/Dashboard/Voting';
import LiveResults from './pages/Dashboard/LiveResults';
import Login from './pages/Login';
import Register from './pages/Register';
import HandleVoters from './pages/Dashboard/HandleVoters';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/faq" element={<Faq />}/>
          <Route path="/contactus" element={<ContactUs />}/>
          <Route path="/login" element={<Login />}/>          <Route path="/register" element={<Register />}/>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/dashboard/createsession" element={<CreateSessions />}/>
          <Route path="/dashboard/handleVoters" element={<HandleVoters />}/>
          <Route path="/dashboard/activeSessions" element={<ActiveSessions />}/>
          <Route path="/dashboard/voting" element={<Voting />}/>
          <Route path="/dashboard/liveResults" element={<LiveResults />}/>
          <Route path="*" element={<NotFountPage />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
