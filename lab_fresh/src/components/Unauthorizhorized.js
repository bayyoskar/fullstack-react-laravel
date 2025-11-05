import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Unauthorized = () => {
  return (
    <div className="dashboard-container">
      <div className="header" style={{ backgroundColor: '#e74c3c' }}>
        🚫 Access Denied
      </div>
      <div className="main-content" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>You don’t have permission to view this page.</h2>
        <p>Please go back to the <Link to="/dashboard">Dashboard</Link>.</p>
      </div>
    </div>
  );
};

export default Unauthorized;