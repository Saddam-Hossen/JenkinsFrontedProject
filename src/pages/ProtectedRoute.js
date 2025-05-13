import React from "react";
import { Navigate } from "react-router-dom";
import { checkAccessComponent, checkAccess, checkAccessMenu } from "../utils/accessControl";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
  const expiryTime = sessionStorage.getItem("expiry");

  // Check if session is expired
  if (!isAuthenticated || (expiryTime && Date.now() > expiryTime)) {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("expiry");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
