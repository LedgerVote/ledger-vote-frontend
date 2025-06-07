import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SlideBar from "../../components/SlideBar";
import { sessionAPI } from "../../services/api";

function HandleVoters() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location.state?.sessionId;
  const bulkActionsRef = useRef(null);

  // State management
  const [session, setSession] = useState(null);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedVoters, setSelectedVoters] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [error, setError] = useState(null);

  // Session selection state
  const [availableSessions, setAvailableSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(sessionId);
  const [showSessionSelector, setShowSessionSelector] = useState(!sessionId);
  const [sessionsLoading, setSessionsLoading] = useState(!sessionId);

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 50,
    total: 0,
    total_pages: 0,
  });

  // Click outside handler for bulk actions dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bulkActionsRef.current &&
        !bulkActionsRef.current.contains(event.target)
      ) {
        setShowBulkActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Enhanced fetch voters with parameters
  const fetchVoters = useCallback(async () => {
    if (!selectedSessionId) return;

    try {
      setLoading(true);
      const params = {
        page: pagination.current_page,
        limit: pagination.per_page,
        search: searchTerm,
        status: statusFilter,
        sortBy,
        sortOrder,
      };

      const response = await sessionAPI.getVoters(selectedSessionId, params);
      setVoters(response.voters || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error("Error fetching voters:", error);
      toast.error("Failed to load voters");
    } finally {
      setLoading(false);
    }
  }, [
    selectedSessionId,
    pagination.current_page,
    pagination.per_page,
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
  ]);

  // Fetch available sessions for selection
  const fetchAvailableSessions = useCallback(async () => {
    try {
      setSessionsLoading(true);
      const response = await sessionAPI.getAdminSessions({ limit: 100 });
      setAvailableSessions(response.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  // Fetch session and voters data
  useEffect(() => {
    if (!selectedSessionId && !sessionId) {
      // If no session is selected, fetch available sessions
      fetchAvailableSessions();
      return;
    }

    if (selectedSessionId || sessionId) {
      fetchSessionData();
      fetchVoters();
    }
  }, [selectedSessionId, sessionId, fetchVoters, fetchAvailableSessions]);

  // Handle session selection
  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowSessionSelector(false);
    // Reset pagination when switching sessions
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  // Update filtered voters for local filtering (if needed)
  useEffect(() => {
    setFilteredVoters(voters);
  }, [voters]);
  const fetchSessionData = async () => {
    try {
      const response = await sessionAPI.getSession(
        selectedSessionId || sessionId
      );
      setSession(response.session);
    } catch (error) {
      console.error("Error fetching session:", error);
      toast.error("Failed to load session data");
    }
  };

  const handleApproveVoter = async (voterId) => {
    try {
      setActionLoading(true);
      await sessionAPI.approveVoters([voterId], "approve");

      // Update local state
      setVoters((prev) =>
        prev.map((voter) =>
          voter.id === voterId
            ? { ...voter, status: "approved", is_verified: true }
            : voter
        )
      );

      toast.success("Voter approved successfully");
    } catch (error) {
      console.error("Error approving voter:", error);
      toast.error("Failed to approve voter");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectVoter = async (voterId) => {
    try {
      setActionLoading(true);
      await sessionAPI.rejectVoters([voterId]);

      // Update local state
      setVoters((prev) =>
        prev.map((voter) =>
          voter.id === voterId
            ? { ...voter, status: "pending", is_verified: false }
            : voter
        )
      );

      toast.success("Voter rejected");
    } catch (error) {
      console.error("Error rejecting voter:", error);
      toast.error("Failed to reject voter");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVoterStatus = async (voterId, currentStatus) => {
    try {
      setActionLoading(true);
      const newStatus = currentStatus === "approved" ? "pending" : "approved";

      if (newStatus === "approved") {
        await sessionAPI.approveVoters([voterId], "approve");
      } else {
        await sessionAPI.rejectVoters([voterId]);
      }

      // Update local state
      setVoters((prev) =>
        prev.map((voter) =>
          voter.id === voterId
            ? {
                ...voter,
                status: newStatus,
                is_verified: newStatus === "approved",
              }
            : voter
        )
      );

      toast.success(`Voter ${newStatus}`);
    } catch (error) {
      console.error("Error toggling voter status:", error);
      toast.error("Failed to update voter status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveAll = async () => {
    try {
      setBulkLoading(true);
      const allVoterIds = voters.map((v) => v.id);
      await sessionAPI.approveVoters(allVoterIds, "approve");

      // Update local state
      setVoters((prev) =>
        prev.map((voter) => ({
          ...voter,
          status: "approved",
          is_verified: true,
        }))
      );

      toast.success("All voters approved successfully");
    } catch (error) {
      console.error("Error approving all voters:", error);
      toast.error("Failed to approve all voters");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedVoters.length === 0) {
      toast.error("Please select voters first");
      return;
    }

    try {
      setBulkLoading(true);
      let response;
      let successMessage = "";

      switch (action) {
        case "approve":
          await sessionAPI.approveVoters(selectedVoters, "approve");
          setVoters((prev) =>
            prev.map((voter) =>
              selectedVoters.includes(voter.id)
                ? { ...voter, status: "approved", is_verified: true }
                : voter
            )
          );
          successMessage = `${selectedVoters.length} voters approved`;
          break;

        case "reject":
          await sessionAPI.rejectVoters(selectedVoters);
          setVoters((prev) =>
            prev.map((voter) =>
              selectedVoters.includes(voter.id)
                ? { ...voter, status: "pending", is_verified: false }
                : voter
            )
          );
          successMessage = `${selectedVoters.length} voters rejected`;
          break;
        case "remove":
          await sessionAPI.removeVotersFromSession(
            selectedSessionId || sessionId,
            selectedVoters
          );
          setVoters((prev) =>
            prev.filter((voter) => !selectedVoters.includes(voter.id))
          );
          successMessage = `${selectedVoters.length} voters removed from session`;
          break;

        case "activate":
          await sessionAPI.toggleVotersActiveStatus(selectedVoters, true);
          setVoters((prev) =>
            prev.map((voter) =>
              selectedVoters.includes(voter.id)
                ? { ...voter, is_active: true }
                : voter
            )
          );
          successMessage = `${selectedVoters.length} voters activated`;
          break;

        case "deactivate":
          await sessionAPI.toggleVotersActiveStatus(selectedVoters, false);
          setVoters((prev) =>
            prev.map((voter) =>
              selectedVoters.includes(voter.id)
                ? { ...voter, is_active: false }
                : voter
            )
          );
          successMessage = `${selectedVoters.length} voters deactivated`;
          break;

        default:
          throw new Error("Invalid action");
      }

      toast.success(successMessage);
      setSelectedVoters([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error("Error in bulk action:", error);
      toast.error("Failed to perform bulk action");
    } finally {
      setBulkLoading(false);
    }
  };
  const handleExportVoters = async () => {
    try {
      setExportLoading(true);
      const response = await sessionAPI.exportVoters(
        selectedSessionId || sessionId,
        "csv"
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `voters-${selectedSessionId || sessionId}-${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Voters exported successfully");
    } catch (error) {
      console.error("Error exporting voters:", error);
      toast.error("Failed to export voters");
    } finally {
      setExportLoading(false);
    }
  };

  const handleSelectVoter = (voterId) => {
    setSelectedVoters((prev) => {
      const newSelection = prev.includes(voterId)
        ? prev.filter((id) => id !== voterId)
        : [...prev, voterId];

      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedVoters.length === filteredVoters.length) {
      setSelectedVoters([]);
      setShowBulkActions(false);
    } else {
      const allIds = filteredVoters.map((voter) => voter.id);
      setSelectedVoters(allIds);
      setShowBulkActions(true);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current_page: page }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination((prev) => ({ ...prev, current_page: 1 })); // Reset to first page
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, current_page: 1 })); // Reset to first page
  };

  const getStatusBadge = (status, isActive = true) => {
    const baseClasses =
      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";

    if (!isActive) {
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`;
    }

    switch (status) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`;
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }

    return sortOrder === "asc" ? (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  if (!sessionId && showSessionSelector) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SlideBar />
        <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Select a Session to Manage Voters
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose from your available voting sessions to manage voters.
              </p>
            </div>

            {sessionsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <span className="text-lg text-gray-700 dark:text-gray-300">
                    Loading sessions...
                  </span>
                </div>
              </div>
            ) : availableSessions.length === 0 ? (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  No Sessions Available
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please create a session first to manage voters.
                </p>
                <button
                  onClick={() => navigate("/dashboard/createSessions")}
                  className="px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  Create Session
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {availableSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSessionSelect(session.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">
                        {session.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          session.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {session.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {session.description || "No description provided"}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Total Voters:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {session.total_voters || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Votes Cast:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {session.votes_cast || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          End Date:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(session.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSessionSelect(session.id);
                      }}
                    >
                      Manage Voters
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!sessionId && !selectedSessionId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SlideBar />
        <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No Session Selected
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please create a session first to manage voters.
              </p>
              <button
                onClick={() => navigate("/dashboard/createSessions")}
                className="px-4 py-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SlideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {" "}
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Voter Management
                </h1>
                {session && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Managing voters for:{" "}
                    <span className="font-semibold">{session.title}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => {
                    setShowSessionSelector(true);
                    setSelectedSessionId(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Switch Session
                </button>
              </div>
            </div>
          </div>
          {/* Controls */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <label htmlFor="search" className="sr-only">
                  Search voters
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>{" "}
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search by name or email..."
                  />
                </div>
              </div>
              {/* Status Filter */}
              <div className="flex gap-2">
                {" "}
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="block py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>{" "}
              {/* Action Buttons */}
              <div className="flex gap-2">
                {/* Refresh Button */}
                <button
                  onClick={() => {
                    fetchVoters();
                    toast.success("Data refreshed");
                  }}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-4 w-4"
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
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  )}
                  <span className="ml-1">Refresh</span>
                </button>

                {/* Export Button */}
                <button
                  onClick={handleExportVoters}
                  disabled={exportLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  {exportLoading ? "Exporting..." : "Export CSV"}
                </button>
                {/* Bulk Actions Dropdown */}
                {selectedVoters.length > 0 && (
                  <div className="relative" ref={bulkActionsRef}>
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50"
                      disabled={bulkLoading}
                    >
                      {bulkLoading
                        ? "Processing..."
                        : `Bulk Actions (${selectedVoters.length})`}
                      <svg
                        className="w-4 h-4 ml-2 inline"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {showBulkActions && (
                      <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            onClick={() => handleBulkAction("approve")}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                          >
                            Approve Selected
                          </button>
                          <button
                            onClick={() => handleBulkAction("reject")}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                          >
                            Reject Selected
                          </button>
                          <button
                            onClick={() => handleBulkAction("activate")}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                          >
                            Activate Selected
                          </button>
                          <button
                            onClick={() => handleBulkAction("deactivate")}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                          >
                            Deactivate Selected
                          </button>
                          <button
                            onClick={() => handleBulkAction("remove")}
                            className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-600 w-full text-left"
                          >
                            Remove Selected
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Approve All Button */}
                <button
                  onClick={handleApproveAll}
                  disabled={bulkLoading || voters.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 disabled:opacity-50"
                >
                  {bulkLoading ? "Processing..." : "Approve All"}
                </button>
              </div>
            </div>
          </div>
          {/* Voters Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Loading voters...
                </div>
              </div>
            ) : filteredVoters.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No voters found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter."
                    : "Upload a CSV file to add voters."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedVoters.length === filteredVoters.length &&
                            filteredVoters.length > 0
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </th>{" "}
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          {getSortIcon("name")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-1">
                          Email
                          {getSortIcon("email")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {getSortIcon("status")}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => handleSort("created_at")}
                      >
                        <div className="flex items-center gap-1">
                          Added
                          {getSortIcon("created_at")}
                        </div>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredVoters.map((voter) => (
                      <tr
                        key={voter.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedVoters.includes(voter.id)}
                            onChange={() => handleSelectVoter(voter.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {voter.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {voter.email}
                          </div>
                        </td>{" "}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={getStatusBadge(
                                voter.status,
                                voter.is_active
                              )}
                            >
                              {voter.status}
                            </span>
                            {!voter.is_active && (
                              <span className="px-1 text-xs bg-gray-200 text-gray-700 rounded dark:bg-gray-600 dark:text-gray-300">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(voter.createdAt).toLocaleDateString()}
                        </td>{" "}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2 justify-end">
                            {voter.status === "pending" ? (
                              <>
                                <button
                                  onClick={() => handleApproveVoter(voter.id)}
                                  disabled={actionLoading}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 px-2 py-1 text-xs font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectVoter(voter.id)}
                                  disabled={actionLoading}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 px-2 py-1 text-xs font-medium"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  handleToggleVoterStatus(
                                    voter.id,
                                    voter.status
                                  )
                                }
                                disabled={actionLoading}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 px-2 py-1 text-xs font-medium"
                              >
                                {voter.status === "approved"
                                  ? "Unapprove"
                                  : "Approve"}
                              </button>
                            )}
                            {/* Active/Inactive Toggle */}
                            <button
                              onClick={() => {
                                setSelectedVoters([voter.id]);
                                handleBulkAction(
                                  voter.is_active ? "deactivate" : "activate"
                                );
                              }}
                              disabled={actionLoading}
                              className={`px-2 py-1 text-xs font-medium disabled:opacity-50 ${
                                voter.is_active
                                  ? "text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                  : "text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                              }`}
                            >
                              {voter.is_active ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}{" "}
          </div>
          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    Showing{" "}
                    {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
                    {Math.min(
                      pagination.current_page * pagination.per_page,
                      pagination.total
                    )}{" "}
                    of {pagination.total} voters
                  </span>

                  <select
                    value={pagination.per_page}
                    onChange={(e) => {
                      setPagination((prev) => ({
                        ...prev,
                        per_page: Number(e.target.value),
                        current_page: 1,
                      }));
                    }}
                    className="ml-2 block py-1 px-2 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    disabled={pagination.current_page <= 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {[...Array(Math.min(5, pagination.total_pages))].map(
                      (_, index) => {
                        let pageNum;
                        if (pagination.total_pages <= 5) {
                          pageNum = index + 1;
                        } else {
                          const start = Math.max(
                            1,
                            pagination.current_page - 2
                          );
                          const end = Math.min(
                            pagination.total_pages,
                            start + 4
                          );
                          pageNum = start + index;
                          if (pageNum > end) return null;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                              pagination.current_page === pageNum
                                ? "text-blue-600 bg-blue-50 border border-blue-300 dark:bg-blue-900 dark:text-blue-300"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    disabled={pagination.current_page >= pagination.total_pages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Summary */}
          {voters.length > 0 && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {voters.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total Voters
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {voters.filter((v) => v.status === "approved").length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Approved
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {voters.filter((v) => v.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Pending
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {voters.filter((v) => v.status === "rejected").length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rejected
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HandleVoters;
