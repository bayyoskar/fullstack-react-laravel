import React, { useState } from "react";
import "./login.css";
import api from "../api/axios";

export default function AuthContainer({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLoginSuccess(res.data.user);
    } catch (err) {
      setMessage("Email atau password salah!");
    }
  };

  return (
    <div className="cardContainer">
      {/* LEFT PANEL - WELCOME */}
      <div className="infoPanel">
        <h3>Welcome Back!</h3>
        <p>Silakan login untuk melanjutkan ke dashboard.</p>
      </div>

      {/* RIGHT PANEL - LOGIN FORM */}
      <div className="formPanel">
        <h2>Login</h2>
        {message && <p className="error-msg">{message}</p>}

        <form onSubmit={handleLogin}>
          <div className="inputGroup">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputGroup">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submitBtn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}