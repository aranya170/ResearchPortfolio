import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import "./styles/Admin.css";
import { VscLock, VscKey, VscAccount, VscArrowLeft, VscEye, VscEyeClosed, VscCheck, VscShield } from "react-icons/vsc";

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [username, setUsername] = useState("AKD");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [slowNotice, setSlowNotice] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        setSlowNotice(true);
      }, 3000);
    } else {
      setSlowNotice(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    setSlowNotice(false);

    try {
      if (isRegisterMode) {
        const res = await api.register({ username, email, password });
        if (res && res.token) {
          localStorage.setItem("portfolio_admin_token", res.token);
          localStorage.setItem("portfolio_admin_user", JSON.stringify(res.user));
          onLoginSuccess(res.user);
        } else {
          setSuccessMsg("Admin registered successfully! You can now log in.");
          setIsRegisterMode(false);
        }
      } else {
        const res = await api.login({ username, password });
        if (res && res.token) {
          localStorage.setItem("portfolio_admin_token", res.token);
          localStorage.setItem("portfolio_admin_user", JSON.stringify(res.user));
          onLoginSuccess(res.user);
        }
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to backend server. Make sure your local server (port 5000) or Render backend is active."
          : err.message || "Authentication failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setUsername("AKD");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 58,
              height: 58,
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: 28,
              color: "#07090e",
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
            }}
          >
            <VscShield />
          </div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, margin: "0 0 6px", color: "#fff", letterSpacing: "-0.3px" }}>
            {isRegisterMode ? "Create Admin Credentials" : "Admin Security Gateway"}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
            {isRegisterMode
              ? "Set up administrator account to manage portfolio database"
              : "Access PostgreSQL management console & sector editor"}
          </p>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error" style={{ marginBottom: 18 }}>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="admin-alert admin-alert-success" style={{ marginBottom: 18 }}>
            <span>{successMsg}</span>
          </div>
        )}

        {slowNotice && (
          <div
            className="admin-alert"
            style={{
              marginBottom: 18,
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#7dd3fc",
              fontSize: "0.82rem",
            }}
          >
            <span>⏳ Contacting server (if running on free cloud tier, waking takes ~30s)...</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label">
              <span>Admin Username or Email</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="admin-input"
                placeholder="AKD or aranya.akd@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
              <VscAccount style={{ position: "absolute", right: 14, top: 14, color: "#64748b" }} />
            </div>
          </div>

          {isRegisterMode && (
            <div className="admin-form-group">
              <label className="admin-label">
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                className="admin-input"
                placeholder="aranya.akd@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="admin-form-group">
            <label className="admin-label">
              <span>Password</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="admin-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: 10,
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: 4,
                  fontSize: "1.1rem",
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            style={{ width: "100%", padding: "13px", fontSize: "0.95rem", marginTop: 6 }}
            disabled={loading}
          >
            {loading
              ? "Authenticating Security Token..."
              : isRegisterMode
              ? "Register & Enter Dashboard"
              : "Authorize & Enter Console"}
          </button>
        </form>

        <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            style={{
              background: "none",
              border: "none",
              color: "#38bdf8",
              fontSize: "0.82rem",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {isRegisterMode ? "← Back to Sign In" : "Register new admin"}
          </button>

          <button
            type="button"
            onClick={onBackToSite}
            style={{
              background: "none",
              border: "none",
              color: "#94a3b8",
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: 0,
            }}
          >
            <VscArrowLeft /> Return to Site
          </button>
        </div>
      </div>
    </div>
  );
}

