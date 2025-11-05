import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" replace />; // belum login
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />; // role tidak cocok

  return children;
};

export default ProtectedRoute;