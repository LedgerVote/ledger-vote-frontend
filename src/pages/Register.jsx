import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userType: "voter",
    walletAddress: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Registration error:", error);
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
          setFormData({
            ...formData,
            walletAddress: accounts[0],
          });
          toast.success("Wallet connected successfully!");
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

      <div className="bg-gray-100 py-20 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Left Illustration */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
            <img
              src="src/assets/voting pic.png"
              alt="Voting Illustration"
              className="max-w-[350px] w-full h-auto"
            />
          </div>

          {/* Right Register Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md bg-[#F6F4F4] rounded-xl shadow-2xl p-10">
              {/* Header */}
              <h2 className="text-3xl font-semibold mb-6">
                Create <span className="text-blue-600 font-bold">Account</span>
              </h2>

              {/* Wallet Connect */}
              <button
                type="button"
                onClick={handleWalletConnect}
                className="w-full bg-white rounded-md p-3 flex items-center gap-3 mb-6 hover:bg-gray-50 transition duration-200"
              >
                <img
                  src="https://seeklogo.com/images/M/metamask-logo-09EDE53DBD-seeklogo.com.png"
                  alt="MetaMask"
                  className="w-6 h-6"
                />
                <span className="font-semibold text-sm">
                  {formData.walletAddress
                    ? "Wallet Connected"
                    : "Connect Wallet (Optional)"}
                </span>
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#F6F4F4] text-gray-500">or</span>
                </div>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="voter">Voter</option>
                  <option value="admin">Admin</option>
                </select>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                {formData.walletAddress && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700 font-medium">
                      Wallet Connected:
                    </p>
                    <p className="text-xs text-green-600 break-all">
                      {formData.walletAddress}
                    </p>
                  </div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2F64FF] text-white font-medium py-3 rounded-md hover:bg-blue-700 mb-4 transition duration-200 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
