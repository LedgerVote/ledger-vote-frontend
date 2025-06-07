import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SlideBar from "../../components/SlideBar";
import { sessionAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function ActiveSessions() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("active");
  const [walletConnected, setWalletConnected] = useState(false);

  // Simulate wallet connection check
  useEffect(() => {
    // Check if user has wallet address
    setWalletConnected(!!user?.wallet_address);
  }, [user]);

  // Fetch sessions based on user role
  useEffect(() => {
    fetchSessions();
  }, [activeFilter, user]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      let response;

      if (user?.user_type === "admin") {
        response = await sessionAPI.getAdminSessions({
          status:
            activeFilter === "active"
              ? "active"
              : activeFilter === "upcoming"
              ? "inactive"
              : "ended",
          limit: 20,
        });
      } else {
        response = await sessionAPI.getVoterSessions({
          status: activeFilter,
          limit: 20,
        });
      }

      setSessions(response.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate time remaining
  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes}m left`;
  };

  // Calculate progress percentage
  const getProgress = (startDate, endDate, votesCast = 0, totalVoters = 1) => {
    if (activeFilter === "completed") {
      return Math.round((votesCast / totalVoters) * 100);
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const total = end - start;
    const elapsed = now - start;

    if (elapsed <= 0) return 0;
    if (elapsed >= total) return 100;

    return Math.round((elapsed / total) * 100);
  };

  // Filter options
  const filterOptions = [
    {
      key: "active",
      label: "Active",
      count: sessions.filter(
        (s) => new Date(s.end_date) > new Date() && s.is_active
      ).length,
    },
    {
      key: "upcoming",
      label: "Upcoming",
      count: sessions.filter((s) => new Date(s.start_date) > new Date()).length,
    },
    {
      key: "completed",
      label: "Completed",
      count: sessions.filter((s) => new Date(s.end_date) <= new Date()).length,
    },
  ];

  // Handle vote now
  const handleVoteNow = (sessionId) => {
    if (!walletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    navigate(`/dashboard/voting/${sessionId}`);
  };

  // Handle session management (admin)
  const handleManageSession = (sessionId) => {
    navigate(`/dashboard/handleVoters`, { state: { sessionId } });
  };

  // Connect wallet simulation
  const handleConnectWallet = () => {
    // Simulate wallet connection
    setTimeout(() => {
      setWalletConnected(true);
      toast.success("Wallet connected successfully");
    }, 1000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <SlideBar />
      <div className="p-4 sm:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header Section */}
          <div className="mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                      Your Voting Sessions
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                      {user?.user_type === "admin"
                        ? "Manage and monitor all voting sessions in the system"
                        : "Participate in available blockchain voting sessions"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Wallet Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div
                  className={`flex items-center px-6 py-3 rounded-full shadow-lg border-2 transition-all duration-300 ${
                    walletConnected
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                      : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        walletConnected
                          ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                          : "bg-red-500 shadow-lg shadow-red-500/50"
                      }`}
                    ></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {walletConnected
                          ? "Wallet Connected"
                          : "Wallet Disconnected"}
                      </span>
                      <span className="text-xs opacity-75">
                        {walletConnected
                          ? "Ready to vote"
                          : "Connect to participate"}
                      </span>
                    </div>
                  </div>
                </div>

                {!walletConnected && (
                  <button
                    onClick={handleConnectWallet}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                      </svg>
                      Connect Wallet
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>{" "}
          {/* Enhanced Filter Tabs */}
          <div className="mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2">
              <div className="flex flex-wrap gap-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setActiveFilter(option.key)}
                    className={`flex-1 min-w-0 px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300 relative overflow-hidden ${
                      activeFilter === option.key
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">{option.label}</span>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          activeFilter === option.key
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {option.count}
                      </span>
                    </div>
                    {activeFilter === option.key && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Sessions Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-lg text-gray-600 dark:text-gray-400">
                  Loading sessions...
                </span>
              </div>
            </div>
          ) : sessions.length === 0 /* Enhanced Empty State */ ? (
            <div className="text-center py-20">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                No {activeFilter} sessions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                {user?.user_type === "admin"
                  ? "Get started by creating your first secure blockchain voting session. Engage your community with transparent and tamper-proof elections."
                  : "There are currently no voting sessions available for you to participate in. Check back later or contact your administrator for updates."}
              </p>
              {user?.user_type === "admin" ? (
                <button
                  onClick={() => navigate("/dashboard/createsession")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                    Create Your First Session
                  </span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    toast.info(
                      "Please contact your administrator for assistance"
                    )
                  }
                  className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    Contact Administrator
                  </span>
                </button>
              )}
            </div>
          ) : (
            /* Sessions Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sessions.map((session) => {
                const timeRemaining = getTimeRemaining(session.end_date);
                const progress = getProgress(
                  session.start_date,
                  session.end_date,
                  session.votes_cast,
                  session.total_voters
                );
                const isActive =
                  new Date(session.end_date) > new Date() && session.is_active;
                const hasVoted = session.has_voted;
                return (
                  <div
                    key={session.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Enhanced Session Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Enhanced Organization Logo */}
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                ></path>
                              </svg>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white leading-tight mb-1">
                              {session.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                {session.admin_first_name}{" "}
                                {session.admin_last_name}
                              </div>
                              <span className="text-gray-300 dark:text-gray-600">
                                •
                              </span>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  ></path>
                                </svg>
                                {new Date(
                                  session.start_date
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                            isActive
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700"
                              : activeFilter === "upcoming"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                          }`}
                        >
                          {isActive
                            ? "🟢 Active"
                            : activeFilter === "upcoming"
                            ? "🔵 Upcoming"
                            : "⚫ Ended"}
                        </div>
                      </div>
                    </div>{" "}
                    {/* Enhanced Session Content */}
                    <div className="p-6">
                      {session.description && (
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                          <p
                            className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-hidden"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {session.description}
                          </p>
                        </div>
                      )}

                      {/* Enhanced Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {activeFilter === "completed"
                              ? "Participation Rate"
                              : "Session Progress"}
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                            {progress}%
                          </span>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 shadow-inner">
                            <div
                              className={`h-3 rounded-full transition-all duration-700 shadow-lg ${
                                activeFilter === "completed"
                                  ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"
                                  : "bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600"
                              }`}
                              style={{ width: `${progress}%` }}
                            >
                              <div className="w-full h-full bg-white/20 rounded-full"></div>
                            </div>
                          </div>
                          {progress > 10 && (
                            <div
                              className="absolute top-0 h-3 flex items-center"
                              style={{ left: `${Math.min(progress - 5, 85)}%` }}
                            >
                              <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Session Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {session.total_voters || session.voter_count || 0}
                          </div>
                          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                            Eligible Voters
                          </div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {session.votes_cast || 0}
                          </div>
                          <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                            Votes Cast
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Time & Status Section */}
                      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {timeRemaining}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Time Remaining
                            </div>
                          </div>
                        </div>

                        {user?.user_type === "voter" && hasVoted && (
                          <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            <span className="font-semibold">
                              Vote Submitted
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Action Button */}
                      {user?.user_type === "admin" ? (
                        <button
                          onClick={() => handleManageSession(session.id)}
                          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                        >
                          <span className="flex items-center justify-center">
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              ></path>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                            </svg>
                            Manage Session
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleVoteNow(session.id)}
                          disabled={!isActive || hasVoted || !walletConnected}
                          className={`w-full py-4 px-6 font-bold rounded-xl shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 ${
                            !isActive || hasVoted || !walletConnected
                              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl transform hover:scale-105 focus:ring-blue-300 dark:focus:ring-blue-800"
                          }`}
                        >
                          <span className="flex items-center justify-center">
                            {!walletConnected ? (
                              <>
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  ></path>
                                </svg>
                                Connect Wallet First
                              </>
                            ) : hasVoted ? (
                              <>
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                                Vote Already Submitted
                              </>
                            ) : !isActive ? (
                              <>
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                                Session Ended
                              </>
                            ) : (
                              <>
                                <svg
                                  className="w-5 h-5 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  ></path>
                                </svg>
                                Vote Now
                              </>
                            )}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActiveSessions;
