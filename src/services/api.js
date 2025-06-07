import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

// Session API functions
export const sessionAPI = {
  // Create a new voting session
  createSession: async (sessionData) => {
    const response = await api.post("/sessions", sessionData);
    return response.data;
  },

  // Get all sessions for admin
  getAdminSessions: async (params = {}) => {
    const response = await api.get("/sessions", { params });
    return response.data;
  },

  // Get session details with voters
  getSessionDetails: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  // Get voters for a session (alias for getSessionDetails for HandleVoters compatibility)
  getVoters: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  // Get session (alias for getSessionDetails)
  getSession: async (sessionId) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  // Update session
  updateSession: async (sessionId, updateData) => {
    const response = await api.put(`/sessions/${sessionId}`, updateData);
    return response.data;
  },

  // Upload voters CSV
  uploadVoters: async (sessionId, file) => {
    const formData = new FormData();
    formData.append("votersFile", file);

    const response = await api.post(
      `/sessions/${sessionId}/voters/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get all voters for management
  getAllVoters: async (params = {}) => {
    const response = await api.get("/sessions/voters/all", { params });
    return response.data;
  },

  // Approve/unapprove voters
  approveVoters: async (voterIds, action = "approve") => {
    const response = await api.post("/sessions/voters/approve", {
      voterIds,
      action,
    });
    return response.data;
  },

  // Toggle voter status
  toggleVoterStatus: async (voterId, isActive) => {
    const response = await api.patch(`/sessions/voters/${voterId}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  // Individual voter approval (for HandleVoters compatibility)
  approveVoter: async (sessionId, voterId) => {
    const response = await api.post("/sessions/voters/approve", {
      voterIds: [voterId],
      action: "approve",
    });
    return response.data;
  },

  // Approve all voters in a session
  approveAllVoters: async (sessionId) => {
    // Get all voters for the session first
    const sessionResponse = await api.get(`/sessions/${sessionId}`);
    const voterIds = sessionResponse.data.session.voters.map((v) => v.voter_id);

    const response = await api.post("/sessions/voters/approve", {
      voterIds,
      action: "approve",
    });
    return response.data;
  },
};

export default api;
