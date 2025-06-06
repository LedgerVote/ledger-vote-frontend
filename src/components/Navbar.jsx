import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-black">
          LedgerVote
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 font-semibold items-center">
          <li>
            <Link to="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
          </li>
          <li>
            <Link to="/faq" className="text-black hover:text-blue-600">
              FAQ
            </Link>
          </li>
          <li>
            <Link to="/contactus" className="text-black hover:text-blue-600">
              Contact Us
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="text-black hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li className="text-sm text-gray-600">
                Welcome, {user?.firstName}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="text-black hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            // Close Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <ul className="md:hidden px-4 pb-4 space-y-2 font-semibold">
          <li>
            <Link to="/" className="block text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="/faq" className="block text-black hover:text-blue-600">
              FAQ
            </Link>
          </li>
          <li>
            <Link
              to="/contactus"
              className="block text-black hover:text-blue-600"
            >
              Contact Us
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="block text-black hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li className="block text-sm text-gray-600 py-1">
                Welcome, {user?.firstName}
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition duration-200"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="block text-black hover:text-blue-600"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition duration-200 text-center"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
