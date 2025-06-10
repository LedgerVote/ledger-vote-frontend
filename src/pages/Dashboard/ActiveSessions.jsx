import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SlideBar from '../../components/SlideBar';
import { sessionAPI } from "../../services/api";

function ActiveSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all'
  });

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      console.log('Fetching sessions with filters:', filters); // Debug log
      
      const response = await sessionAPI.getAdminSessions(filters);
      
      console.log('API Response:', response); // Debug log
      
      if (response.success) {
        setSessions(response.sessions || []);
        setPagination(response.pagination || {});
      } else {
        setError(response.message || 'Failed to fetch sessions');
      }
    } catch (err) {
      console.error('Fetch sessions error:', err); // Debug log
      setError(err.response?.data?.message || err.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get status badge
  const getStatusBadge = (session) => {
    const now = new Date();
    const endDate = new Date(session.end_date);
    
    if (!session.is_active) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>;
    } else if (isNaN(endDate.getTime())) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Unknown</span>;
    } else if (endDate <= now) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Ended</span>;
    } else {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
    }
  };

  if (loading) {
    return (
      <div className='font-primary'>
        <SlideBar />
        <div className="p-4 sm:ml-64">
          <div className="p-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='font-primary'>
      <SlideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                  Voting Sessions
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and monitor all voting sessions
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard/createsession')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              >
                Create New Session
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Sessions</option>
                <option value="active">Active</option>
                <option value="ended">Ended</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange({ limit: parseInt(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={() => fetchSessions()}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg">
              <div className="font-medium">Error loading sessions:</div>
              <div>{error}</div>
              <button
                onClick={() => fetchSessions()}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Sessions Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {sessions.length === 0 && !loading && !error ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No sessions found. Create your first voting session to get started.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">Session Title</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Voters</th>
                        <th scope="col" className="px-6 py-3">Votes Cast</th>
                        <th scope="col" className="px-6 py-3">End Date</th>
                        <th scope="col" className="px-6 py-3">Created</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => (
                        <tr key={session.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {session.title || 'Untitled Session'}
                              </div>
                              {session.description && (
                                <div className="text-gray-500 dark:text-gray-400 text-sm">
                                  {session.description.substring(0, 60)}
                                  {session.description.length > 60 ? '...' : ''}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(session)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {session.voter_count || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {session.votes_cast || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900 dark:text-white">
                              {formatDate(session.end_date)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900 dark:text-white">
                              {formatDate(session.created_at)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => navigate(`/dashboard/sessions/${session.id}`)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                View
                              </button>
                              <button
                                onClick={() => navigate(`/dashboard/sessions/${session.id}/edit`)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                      {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                      {pagination.total} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(pagination.total_pages)].map((_, index) => {
                        const page = index + 1;
                        if (
                          page === 1 ||
                          page === pagination.total_pages ||
                          (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 text-sm border rounded ${
                                page === pagination.current_page
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-white border-gray-300 hover:bg-gray-100'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === pagination.current_page - 2 ||
                          page === pagination.current_page + 2
                        ) {
                          return <span key={page} className="px-2">...</span>;
                        }
                        return null;
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.total_pages}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActiveSessions;