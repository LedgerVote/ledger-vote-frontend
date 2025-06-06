import React from "react";
import { useAuth } from "../context/AuthContext";
import Example from "../components/Example";

function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      {/* User Info Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-sm text-gray-600">
                Role:{" "}
                <span className="capitalize font-medium">{user?.userType}</span>
                {user?.walletAddress && (
                  <span className="ml-4">
                    Wallet:{" "}
                    <span className="font-mono text-xs">
                      {user.walletAddress.slice(0, 6)}...
                      {user.walletAddress.slice(-4)}
                    </span>
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <Example />
    </div>
  );
}

export default Dashboard;
