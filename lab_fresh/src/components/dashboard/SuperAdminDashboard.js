import React from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

export default function SuperAdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* 🔹 Header */}
      <div className="header">Welcome, {user.name} 👑 (Super Admin)</div>

      {/* 🔹 Dashboard layout */}
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            <li onClick={() => navigate("/super-dashboard")}>🏠 Dashboard</li>
            <li onClick={() => navigate("/users")}>🧑‍💼 Manage Admins & Users</li>
            <li onClick={() => navigate("/activity-logs")}>📜 Activity Logs</li>
            <li onClick={() => navigate("/profile")}>👤 My Profile</li>
            <li className="logout" onClick={onLogout}>⏻ Logout</li>
          </ul>
        </div>

        {/* Main content */}
        <div className="main-content">
          <h2>Super Admin Dashboard</h2>
          <p>
            Hai <strong>{user.name}</strong>! Kamu bisa mengelola admin, user, serta memantau aktivitas sistem dari sini.
          </p>
        </div>
      </div>
    </div>
  );
}