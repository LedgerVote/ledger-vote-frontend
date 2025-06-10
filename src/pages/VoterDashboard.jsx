import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { voterAuthAPI, sessionAPI } from "../services/api";
import toast from "react-hot-toast";

function VoterDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserData();
    loadVotingSessions();
  }, []);

  const loadUserData = () => {
    try {
      const userData = localStorage.getItem("voterUser");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        navigate("/voter/login");
      }
    } catch (err) {
      navigate("/voter/login");
    }
  };

  const loadVotingSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getVoterSessions();

      if (response.success) {
        setSessions(response.sessions || []);
      } else {
        setError("Failed to load voting sessions");
      }
    } catch (err) {
      setError("Failed to load voting sessions");
      console.error("Load sessions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("voterToken");
    localStorage.removeItem("voterUser");
    toast.success("Logged out successfully");
    navigate("/voter/login");
  };

  const getSessionStatus = (session) => {
    const now = new Date();
    const endDate = new Date(session.end_date);
    const startDate = new Date(session.start_date);

    if (!session.is_active) {
      return { status: "Inactive", color: "bg-gray-100 text-gray-800" };
    } else if (now < startDate) {
      return { status: "Upcoming", color: "bg-yellow-100 text-yellow-800" };
    } else if (now > endDate) {
      return { status: "Ended", color: "bg-red-100 text-red-800" };
    } else {
      return { status: "Active", color: "bg-green-100 text-green-800" };
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Voter Dashboard
              </h1>
              {user && (
                <p className="text-gray-600">
                  Welcome, {user.first_name} {user.last_name}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {user.wallet_address && (
                    <p className="text-xs text-gray-500">
                      {user.wallet_address.slice(0, 6)}...
                      {user.wallet_address.slice(-4)}
                    </p>
                  )}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Total Sessions
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {sessions.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Active Sessions
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {
                  sessions.filter((s) => {
                    const now = new Date();
                    const end = new Date(s.end_date);
                    const start = new Date(s.start_date);
                    return s.is_active && now >= start && now <= end;
                  }).length
                }
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900">Votes Cast</h3>
              <p className="text-3xl font-bold text-purple-600">
                {sessions.filter((s) => s.user_voted).length}
              </p>
            </div>
          </div>

          {/* Sessions List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Available Voting Sessions
              </h2>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
                <button
                  onClick={loadVotingSessions}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {sessions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">
                  No voting sessions available at the moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sessions.map((session) => {
                  const statusInfo = getSessionStatus(session);
                  return (
                    <div
                      key={session.id}
                      className="px-6 py-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {session.title || "Untitled Session"}
                          </h3>
                          {session.description && (
                            <p className="text-gray-600 mt-1">
                              {session.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Ends: {formatDate(session.end_date)}</span>
                            {session.user_voted && (
                              <span className="text-green-600 font-medium">
                                ✓ Voted
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}
                          >
                            {statusInfo.status}
                          </span>
                          {statusInfo.status === "Active" &&
                            !session.user_voted && (
                              <button
                                onClick={() =>
                                  navigate(`/voter/vote/${session.id}`)
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                Vote Now
                              </button>
                            )}
                          {session.user_voted && (
                            <button
                              onClick={() =>
                                navigate(`/voter/results/${session.id}`)
                              }
                              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                              View Results
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default VoterDashboard;
