import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { voterAuthAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function VoterLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'wallet'
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
    walletAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setFormData((prev) => ({ ...prev, walletAddress: accounts[0] }));
        toast.success("Wallet connected");
      } else {
        setError("Please install MetaMask to connect your wallet");
        toast.error("MetaMask not found");
      }
    } catch (err) {
      setError("Failed to connect wallet");
      toast.error("Failed to connect wallet");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await voterAuthAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Store token and user data
        localStorage.setItem("voterToken", response.token);
        localStorage.setItem("voterUser", JSON.stringify(response.user));

        toast.success("Login successful!");

        // Use auth context if available, otherwise navigate directly
        if (login) {
          login(response.user, response.token);
        }

        navigate("/voter/dashboard");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    if (!formData.walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await voterAuthAPI.walletLogin({
        walletAddress: formData.walletAddress,
      });

      if (response.success) {
        // Store token and user data
        localStorage.setItem("voterToken", response.token);
        localStorage.setItem("voterUser", JSON.stringify(response.user));

        toast.success("Wallet login successful!");

        // Use auth context if available, otherwise navigate directly
        if (login) {
          login(response.user, response.token);
        }

        navigate("/voter/dashboard");
      } else {
        setError(response.message || "Wallet login failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Wallet login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Voter Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to participate in voting sessions
          </p>
        </div>

        {/* Success message from registration */}
        {location.state?.message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {location.state.message}
          </div>
        )}

        {/* Login Method Toggle */}
        <div className="flex rounded-md bg-gray-100 p-1">
          <button
            onClick={() => setLoginMethod("email")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginMethod === "email"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod("wallet")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              loginMethod === "wallet"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Wallet Login
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loginMethod === "email" ? (
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connect Your Wallet
              </label>
              {formData.walletAddress ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.walletAddress}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                  <div className="flex items-center text-green-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 flex items-center justify-center space-x-2"
                >
                  <span>🦊</span>
                  <span>Connect MetaMask</span>
                </button>
              )}
            </div>

            <button
              onClick={handleWalletLogin}
              disabled={loading || !formData.walletAddress}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In with Wallet"
              )}
            </button>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have access?{" "}
            <span className="text-gray-800 font-medium">
              Contact your administrator
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Admin?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login as Admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VoterLogin;
