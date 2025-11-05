import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./dashboard.css";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🟢 Ambil data user dari backend
  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🟢 Handle input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟢 Tambah / Edit user
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.user_id}`, form);
        alert("✅ User updated successfully!");
      } else {
        await api.post("/admin/users", form);
        alert("✅ User created successfully!");
      }

      setForm({ name: "", email: "", password: "", role: "user" });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  // 🟢 Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
  };

  // 🟢 Hapus user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      alert("✅ User deleted successfully!");
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // 🔹 Role options
  const roleOptions =
    currentUser.role === "super_admin"
      ? ["user", "admin"]
      : ["user"];

  return (
    <div className="main-content">
      <h2>👥 Manage Users</h2>
      <p>
        {currentUser.role === "super_admin"
          ? "You can manage both users and admins."
          : "You can manage regular users only."}
      </p>

      {/* 🔹 Form tambah/edit user */}
      <form onSubmit={handleSubmit} className="user-form" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder={editingUser ? "New Password (optional)" : "Password"}
          value={form.password}
          onChange={handleChange}
          required={!editingUser}
        />

        <select name="role" value={form.role} onChange={handleChange}>
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r === "user" ? "User" : "Admin"}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-primary">
          {editingUser ? "Update" : "Create"}
        </button>

        {editingUser && (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setEditingUser(null);
              setForm({ name: "", email: "", password: "", role: "user" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* 🔹 Tabel user */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => handleEdit(u)} className="btn-edit">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(u.user_id)} className="btn-delete">
                    🗑️ Delete
                  </button>
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/profiles/${u.user_id}`)}
                  >
                    🔍 View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}