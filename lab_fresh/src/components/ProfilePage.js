import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./dashboard.css";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    address: "",
    phone: "",
    bio: "",
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📦 Profile API Response:", res.data);
        setUser(res.data.user);
        setProfile(res.data.profile || { address: "", phone: "", bio: "" });
      } catch (err) {
        console.error("❌ Gagal ambil profile:", err);
        setMessage("Gagal memuat profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put("/profile", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profil berhasil diperbarui!");
      setProfile(res.data.profile);
    } catch (err) {
      console.error("❌ Gagal update profil:", err);
      setMessage("❌ Gagal memperbarui profil.");
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", color: "gray" }}>⏳ Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>👤 My Profile</h2>
        {user && <p>{user.name} ({user.role})</p>}
      </div>

      {message && (
        <div
          className={`profile-message ${
            message.startsWith("✅") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <div className="profile-form">
        <div className="form-group">
          <label>📍 Address</label>
          <input
            type="text"
            value={profile.address || ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            placeholder="Masukkan alamat lengkap..."
          />
        </div>

        <div className="form-group">
          <label>📞 Phone Number</label>
          <input
            type="text"
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Masukkan nomor telepon..."
          />
        </div>

        <div className="form-group">
          <label>📝 Bio</label>
          <textarea
            rows="3"
            value={profile.bio || ""}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            placeholder="Tulis bio singkat tentang kamu..."
          />
        </div>

        <button className="save-btn" onClick={handleSave}>
          💾 Simpan Perubahan
        </button>
      </div>
    </div>
  );
}