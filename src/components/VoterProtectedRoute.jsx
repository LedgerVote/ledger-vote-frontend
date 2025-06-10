import React from "react";
import { Navigate } from "react-router-dom";

function VoterProtectedRoute({ children }) {
  const token = localStorage.getItem("voterToken");
  const user = localStorage.getItem("voterUser");

  if (!token || !user) {
    return <Navigate to="/voter/login" replace />;
  }

  try {
    const userData = JSON.parse(user);
    if (userData.user_type !== "voter") {
      return <Navigate to="/voter/login" replace />;
    }
  } catch (error) {
    return <Navigate to="/voter/login" replace />;
  }

  return children;
}

export default VoterProtectedRoute;
