import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${
        config.url
      }`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Handle unauthorized access
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.error("❌ Backend server is not running or not reachable!");
      alert(
        "Backend server is not running! Please start the Spring Boot backend on http://localhost:8080"
      );
    }

    return Promise.reject(error);
  }
);

// Test backend connection
export const testConnection = async () => {
  try {
    console.log("🔄 Testing backend connection...");
    const response = await api.get("/session", { timeout: 5000 });
    console.log("✅ Backend connection successful!");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Backend connection failed:", error.message);
    return {
      success: false,
      error: error.message,
      code: error.code,
      status: error.response?.status,
      details: error.response?.data,
    };
  }
};

// Voting Sessions API
export const sessionAPI = {
  createSession: (sessionData) => api.post("/session", sessionData),
  getAllSessions: () => api.get("/session"),
  getSessionResults: (sessionId) => api.get(`/session/${sessionId}/results`),
};

// Candidates API
export const candidateAPI = {
  createCandidate: (candidateData) => api.post("/candidate", candidateData),
  getAllCandidates: () => api.get("/candidate"),
  getCandidatesBySession: (sessionId) =>
    api.get(`/candidate/session/${sessionId}`),
};

// Voters API
export const voterAPI = {
  createVoter: (voterData) => api.post("/voter", voterData),
  getAllVoters: () => api.get("/voter"),
  getVotersBySession: (sessionId) => api.get(`/voter/session/${sessionId}`),
  getVoterById: (voterId) => api.get(`/voter/${voterId}`),
};

// Voting API
export const votingAPI = {
  castVote: (voteData) => api.post("/vote", voteData),
  getResults: () => api.get("/vote/results"),
};

// Authentication API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  verify: () => api.get("/auth/verify"),
};

export default api;
