import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SlideBar from "../../components/SlideBar";
import { sessionAPI } from "../../services/api";

function HandleVoters() {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = location.state?.sessionId;

  // State management
  const [session, setSession] = useState(null);
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [selectedVoters, setSelectedVoters] = useState([]);

  // Fetch session and voters data
  useEffect(() => {
    if (!sessionId) {
      toast.error("No session ID provided");
      navigate("/dashboard/createSessions");
      return;
    }

    fetchSessionData();
    fetchVoters();
  }, [sessionId]);

  // Filter voters based on search and status
  useEffect(() => {
    let filtered = voters;

    if (searchTerm) {
      filtered = filtered.filter(
        (voter) =>
          voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          voter.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((voter) => voter.status === statusFilter);
    }

    setFilteredVoters(filtered);
  }, [voters, searchTerm, statusFilter]);

  const fetchSessionData = async () => {
    try {
      const response = await sessionAPI.getSession(sessionId);
      setSession(response.session);
    } catch (error) {
      console.error("Error fetching session:", error);
      toast.error("Failed to load session data");
    }
  };

  const fetchVoters = async () => {
    try {
      setLoading(true);
      const response = await sessionAPI.getVoters(sessionId);
      setVoters(response.voters);
    } catch (error) {
      console.error("Error fetching voters:", error);
      toast.error("Failed to load voters");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVoter = async (voterId) => {
    try {
      setActionLoading(true);
      await sessionAPI.approveVoter(sessionId, voterId);

      // Update local state
      setVoters((prev) =>
        prev.map((voter) =>
          voter.id === voterId ? { ...voter, status: "approved" } : voter
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

  const handleToggleVoterStatus = async (voterId, currentStatus) => {
    try {
      setActionLoading(true);
      const newStatus = currentStatus === "approved" ? "pending" : "approved";
      await sessionAPI.toggleVoterStatus(sessionId, voterId);

      // Update local state
      setVoters((prev) =>
        prev.map((voter) =>
          voter.id === voterId ? { ...voter, status: newStatus } : voter
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
      await sessionAPI.approveAllVoters(sessionId);

      // Update local state
      setVoters((prev) =>
        prev.map((voter) => ({ ...voter, status: "approved" }))
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

      if (action === "approve") {
        await Promise.all(
          selectedVoters.map((voterId) =>
            sessionAPI.approveVoter(sessionId, voterId)
          )
        );

        setVoters((prev) =>
          prev.map((voter) =>
            selectedVoters.includes(voter.id)
              ? { ...voter, status: "approved" }
              : voter
          )
        );

        toast.success(`${selectedVoters.length} voters approved`);
      }

      setSelectedVoters([]);
    } catch (error) {
      console.error("Error in bulk action:", error);
      toast.error("Failed to perform bulk action");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleSelectVoter = (voterId) => {
    setSelectedVoters((prev) =>
      prev.includes(voterId)
        ? prev.filter((id) => id !== voterId)
        : [...prev, voterId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVoters.length === filteredVoters.length) {
      setSelectedVoters([]);
    } else {
      setSelectedVoters(filteredVoters.map((voter) => voter.id));
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";

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

  if (!sessionId) {
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
          {/* Header */}
          <div className="mb-6">
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
                  </div>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Search by name or email..."
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2">
                {selectedVoters.length > 0 && (
                  <button
                    onClick={() => handleBulkAction("approve")}
                    disabled={bulkLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 disabled:opacity-50"
                  >
                    {bulkLoading
                      ? "Processing..."
                      : `Approve Selected (${selectedVoters.length})`}
                  </button>
                )}

                <button
                  onClick={handleApproveAll}
                  disabled={bulkLoading || voters.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50"
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
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Added
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(voter.status)}>
                            {voter.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {new Date(voter.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            {voter.status === "pending" ? (
                              <button
                                onClick={() => handleApproveVoter(voter.id)}
                                disabled={actionLoading}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                              >
                                Approve
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleToggleVoterStatus(
                                    voter.id,
                                    voter.status
                                  )
                                }
                                disabled={actionLoading}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                              >
                                Toggle
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

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
