import React from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

export default function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* 🔹 Header */}
      <div className="header">Welcome, {user.name} 👋 (Admin)</div>

      {/* 🔹 Dashboard layout */}
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <ul>
            <li onClick={() => navigate("/admin-dashboard")}>🏠 Dashboard</li>
            <li onClick={() => navigate("/users")}>👥 Manage Users</li>
            <li onClick={() => navigate("/profile")}>👤 My Profile</li>
            <li className="logout" onClick={onLogout}>⏻ Logout</li>
          </ul>
        </div>

        {/* Main content */}
        <div className="main-content">
          <h2>Admin Dashboard</h2>
          <p>
            Halo <strong>{user.name}</strong>! Kamu bisa mengelola data user dan memperbarui profilmu di sini.
          </p>
        </div>
      </div>
    </div>
  );
}