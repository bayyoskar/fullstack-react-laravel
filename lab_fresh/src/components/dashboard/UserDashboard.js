import React from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

export default function UserDashboard({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="header">Welcome, {user.name} 👤 (User)</div>
      <div className="dashboard">
        <div className="sidebar">
          <ul>
            <li onClick={() => navigate("/user-dashboard")}>🏠 Dashboard</li>
            <li onClick={() => navigate("/profile")}>👤 Profile</li>
          </ul>
          <li className="logout" onClick={onLogout}>⏻ Logout</li>
        </div>

        <div className="main-content">
          <h2>User Dashboard</h2>
          <p>Kamu dapat melihat dan memperbarui profilmu di sini.</p>
        </div>
      </div>
    </div>
  );
}