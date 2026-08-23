import React, { useState, useEffect } from "react";
import { api, getApiBaseUrl } from "../services/api";
import "./styles/Admin.css";
import {
  VscLock,
  VscKey,
  VscAccount,
  VscArrowLeft,
  VscEye,
  VscEyeClosed,
  VscCheck,
  VscShield,
  VscSettingsGear,
  VscGlobe,
  VscChecklist,
  VscDebugRestart,
} from "react-icons/vsc";

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

  // Backend Endpoint Configuration
  const [showEndpointConfig, setShowEndpointConfig] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(() => {
    return localStorage.getItem("admin_custom_api_url") || getApiBaseUrl();
  });
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

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
      const isFetchErr = err.message === "Failed to fetch" || err.message?.includes("NetworkError") || err.message?.includes("connect");
      if (isFetchErr) {
        setShowEndpointConfig(true);
        setError("Cannot reach backend server. Please verify your Backend API URL below.");
      } else {
        setError(err.message || "Authentication failed. Check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    let targetUrl = (apiUrlInput || "").trim().replace(/\/+$/, "");
    if (targetUrl && !targetUrl.endsWith("/api")) {
      targetUrl = `${targetUrl}/api`;
    }
    try {
      const res = await fetch(`${targetUrl}/health`);
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setTestResult({
          success: true,
          message: `Backend is Online! Database status: ${data.postgres?.connected ? "Connected to PostgreSQL" : "Local fallback"}`,
        });
      } else {
        setTestResult({
          success: false,
          message: `Server returned HTTP ${res.status}. Make sure the URL includes /api.`,
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message}. If using Render free tier, server may be waking up (~30s).`,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveApiUrl = () => {
    let targetUrl = (apiUrlInput || "").trim().replace(/\/+$/, "");
    if (targetUrl) {
      if (!targetUrl.endsWith("/api")) {
        targetUrl = `${targetUrl}/api`;
      }
      localStorage.setItem("admin_custom_api_url", targetUrl);
      setApiUrlInput(targetUrl);
      setSuccessMsg(`Backend URL set to: ${targetUrl}`);
      setError("");
    } else {
      localStorage.removeItem("admin_custom_api_url");
      setSuccessMsg("Reset backend URL to default.");
    }
  };

  const handleResetApiUrl = () => {
    localStorage.removeItem("admin_custom_api_url");
    const defaultUrl = getApiBaseUrl();
    setApiUrlInput(defaultUrl);
    setTestResult(null);
    setSuccessMsg("Backend URL reset to default.");
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 54,
              height: 54,
              background: "linear-gradient(135deg, #10b981, #059669)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              fontSize: 26,
              color: "#07090e",
              boxShadow: "0 0 26px rgba(16, 185, 129, 0.4)",
            }}
          >
            <VscShield />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 6px", color: "#fff", letterSpacing: "-0.3px" }}>
            {isRegisterMode ? "Create Admin Credentials" : "Admin Security Gateway"}
          </h2>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", margin: 0 }}>
            {isRegisterMode
              ? "Set up administrator account to manage portfolio database"
              : "Access PostgreSQL management console & sector editor"}
          </p>
        </div>

        {error && (
          <div className="admin-alert admin-alert-error" style={{ marginBottom: 16 }}>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="admin-alert admin-alert-success" style={{ marginBottom: 16 }}>
            <span>{successMsg}</span>
          </div>
        )}

        {slowNotice && (
          <div
            className="admin-alert"
            style={{
              marginBottom: 16,
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#7dd3fc",
              fontSize: "0.82rem",
            }}
          >
            <span>⏳ Contacting server (free cloud services may take ~30s on cold start)...</span>
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
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem", marginTop: 4 }}
            disabled={loading}
          >
            {loading
              ? "Authenticating Security Token..."
              : isRegisterMode
              ? "Register & Enter Dashboard"
              : "Authorize & Enter Console"}
          </button>
        </form>

        {/* Backend Endpoint Config Section */}
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.76rem", color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
              <VscGlobe /> Endpoint: <code style={{ color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)", padding: "1px 5px", borderRadius: 4 }}>{getApiBaseUrl()}</code>
            </span>
            <button
              type="button"
              onClick={() => setShowEndpointConfig(!showEndpointConfig)}
              style={{
                background: "none",
                border: "none",
                color: "#10b981",
                fontSize: "0.76rem",
                cursor: "pointer",
                padding: "2px 6px",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <VscSettingsGear /> {showEndpointConfig ? "Hide Config" : "Change URL"}
            </button>
          </div>

          {showEndpointConfig && (
            <div
              style={{
                marginTop: 12,
                background: "rgba(10, 14, 24, 0.8)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "var(--admin-radius-md)",
                padding: 14,
                animation: "fade-in 0.2s ease-out",
              }}
            >
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: 6 }}>
                Backend API URL (e.g. Render or Railway):
              </label>
              <input
                type="text"
                className="admin-input"
                placeholder="https://your-backend.onrender.com/api"
                value={apiUrlInput}
                onChange={(e) => setApiUrlInput(e.target.value)}
                style={{ fontSize: "0.82rem", padding: "8px 10px", marginBottom: 10 }}
              />

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  style={{ fontSize: "0.78rem" }}
                >
                  {testingConnection ? "Testing..." : "Test Connection"}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleSaveApiUrl}
                  style={{ fontSize: "0.78rem" }}
                >
                  Save URL
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={handleResetApiUrl}
                  style={{ fontSize: "0.78rem", color: "#94a3b8" }}
                >
                  Reset
                </button>
              </div>

              {testResult && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: "0.78rem",
                    color: testResult.success ? "#6ee7b7" : "#fda4af",
                    lineHeight: 1.4,
                  }}
                >
                  {testResult.success ? "✅ " : "❌ "} {testResult.message}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
