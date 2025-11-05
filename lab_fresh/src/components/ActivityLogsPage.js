import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./dashboard.css";

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get("/activity-logs");
        setLogs(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <p>Loading activity logs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="main-content">
      <h2>📜 Activity Logs</h2>
      <p>Recent activities (sorted by latest first):</p>

      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Action</th>
            <th>Description</th>
            <th>Time (WIB)</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No activity recorded
              </td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={log.log_id}>
                <td>{index + 1}</td>
                <td>{log.user_name}</td>
                <td>{log.action}</td>
                <td>{log.description}</td>
                <td>{log.created_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}