import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute checks accessToken và userRole lưu trong localStorage.
 * Props:
 * - roles: array of allowed roles (e.g. ['admin'])
 * - children: the protected element
 */
export default function ProtectedRoute({ roles, children }) {
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");

  // Not logged in -> go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles specified and user's role is not allowed -> unauthorized page
  if (roles && Array.isArray(roles) && roles.length > 0) {
    if (!userRole || !roles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ok
  return children;
}
