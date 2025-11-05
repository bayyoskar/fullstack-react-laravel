import React from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();

  // ✅ Pastikan user selalu aman di-handle
  const name = user?.name || 'User';
  const role = user?.role || 'user';

  // ✅ Menu utama berdasarkan role
  const roleMenus = {
    super_admin: ['📊 Dashboard', '👥 Manage Users', '📜 Activity Logs', '⚙️ System Settings'],
    admin: ['📊 Dashboard', '👥 Manage Users', '⚙️ Settings'],
    user: ['📊 Dashboard', '👤 My Profile'],
  };

  const menus = roleMenus[role] || [];

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="header">
        Welcome, <strong>{name}</strong> 👋 ({role})
      </div>

      <div className="dashboard">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <ul>
            {menus.map((menu, idx) => (
              <li key={idx}>{menu}</li>
            ))}
            <li
              onClick={handleLogout}
              style={{
                color: 'red',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '20px',
              }}
            >
              ⏻ Log out
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <h2 style={{ textTransform: 'capitalize' }}>{role} Dashboard</h2>
          <p>
            This is a personalized dashboard for the <strong>{role}</strong> role.
          </p>

          {/* 🔥 Tombol akses berdasarkan role */}
          <div className="role-links" style={{ marginTop: '20px' }}>
            {(role === 'admin' || role === 'super_admin') && (
              <button
                onClick={() => navigate('/users')}
                style={{
                  marginRight: '10px',
                  padding: '10px 15px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#0057ff',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                👥 Manage Users
              </button>
            )}

            {role === 'super_admin' && (
              <button
                onClick={() => navigate('/activity-logs')}
                style={{
                  padding: '10px 15px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                📜 Activity Logs
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}