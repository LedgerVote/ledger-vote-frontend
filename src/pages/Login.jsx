import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          toast.success("Wallet connected successfully!");
          // You can implement wallet-based authentication here
        }
      } catch (error) {
        toast.error("Failed to connect wallet");
      }
    } else {
      toast.error("MetaMask is not installed!");
    }
  };

  return (
    <div>
      <Navbar />

      {/* Centered container instead of full-screen stretch */}
      <div className="bg-gray-100 py-20 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Illustration */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
            <img
              src="src/assets/voting pic.png" // Replace with your actual image path
              alt="Voting Illustration"
              className="max-w-[350px] w-full h-auto"
            />
          </div>

          {/* Right Login Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md bg-[#F6F4F4] rounded-xl shadow-2xl p-10">
              {/* Header */}
              <h2 className="text-3xl font-semibold mb-6">
                Welcome <span className="text-blue-600 font-bold">Back</span>
              </h2>

              {/* Wallet Connect */}
              <button
                onClick={handleWalletConnect}
                className="w-full bg-white rounded-md p-3 flex items-center gap-3 mb-6 hover:bg-gray-50 transition duration-200"
              >
                <img
                  src="https://seeklogo.com/images/M/metamask-logo-09EDE53DBD-seeklogo.com.png"
                  alt="MetaMask"
                  className="w-6 h-6"
                />
                <span className="font-semibold text-sm">Connect Wallet</span>
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#F6F4F4] text-gray-500">or</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                {/* Remember & Forgot */}
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox" />
                    Remember for 30 days
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Forgot password
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2F64FF] text-white font-medium py-3 rounded-md hover:bg-blue-700 mb-4 transition duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Register Link */}
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
