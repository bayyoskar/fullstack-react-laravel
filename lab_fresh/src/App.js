import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthContainer from "./components/login";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Import dashboard sesuai role
import UserDashboard from "./components/dashboard/UserDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import SuperAdminDashboard from "./components/dashboard/SuperAdminDashboard";

// ✅ Import pages
import UsersPage from "./components/UsersPage";
import ActivityLogsPage from "./components/ActivityLogsPage";
import ProfilePage from "./components/ProfilePage";
import ViewProfilePage from "./components/ViewProfilePage"; // 🔍 Tambahan baru!

function App() {
  // ✅ Ambil user dari localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 🔹 Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔹 Tentukan dashboard sesuai role
  const getDashboardPath = (role) => {
    switch (role) {
      case "super_admin":
        return "/super-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/user-dashboard";
    }
  };

  // 🔒 Kalau belum login, tampilkan halaman login
  if (!user) return <AuthContainer onLoginSuccess={setUser} />;

  return (
    <Routes>
      {/* Redirect otomatis ke dashboard sesuai role */}
      <Route path="/" element={<Navigate to={getDashboardPath(user.role)} />} />

      {/* 🧍 USER Dashboard */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* 🧑‍💼 ADMIN Dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <AdminDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* 👑 SUPER ADMIN Dashboard */}
      <Route
        path="/super-dashboard"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdminDashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* 👥 Manage Users (Admin & Super Admin) */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      {/* 🔍 View Specific User Profile */}
      <Route
        path="/profiles/:user_id"
        element={
          <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
            <ViewProfilePage />
          </ProtectedRoute>
        }
      />

      {/* 📜 Activity Logs (Super Admin only) */}
      <Route
        path="/activity-logs"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <ActivityLogsPage />
          </ProtectedRoute>
        }
      />

      {/* 👤 My Profile (Semua role) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["user", "admin", "super_admin"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ❌ Catch-all: kalau route gak ditemukan */}
      <Route path="*" element={<Navigate to={getDashboardPath(user.role)} />} />
    </Routes>
  );
}

export default App;