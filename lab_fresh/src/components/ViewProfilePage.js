import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import "./dashboard.css";

export default function ViewProfilePage() {
  const { user_id } = useParams(); // ambil id dari URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/profiles/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("❌ Gagal ambil data profil user:", err);
        setError("Gagal memuat profil user.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user_id]);

  if (loading) return <p style={{ padding: 20 }}>Loading profile...</p>;
  if (error) return <p style={{ color: "red", padding: 20 }}>{error}</p>;

  const { target_user, profile } = userData;

  return (
    <div className="main-content">
      <h2>👤 Profil: {target_user.name}</h2>
      <p>
        <strong>Role:</strong> {target_user.role}
      </p>
      <p>
        <strong>Email:</strong> {target_user.email}
      </p>

      <div className="profile-form" style={{ marginTop: 20 }}>
        <div className="form-group">
          <label>📍 Address</label>
          <input type="text" value={profile?.address || "-"} disabled />
        </div>

        <div className="form-group">
          <label>📞 Phone</label>
          <input type="text" value={profile?.phone || "-"} disabled />
        </div>

        <div className="form-group">
          <label>🧾 Bio</label>
          <textarea rows="3" value={profile?.bio || "-"} disabled />
        </div>
      </div>
    </div>
  );
}