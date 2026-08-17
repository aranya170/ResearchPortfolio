import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { usePortfolio } from "../../context/PortfolioContext";
import { VscSave, VscKey, VscDatabase, VscGlobe } from "react-icons/vsc";

export default function SettingsSector() {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const [socials, setSocials] = useState({
    github: "https://github.com/aranya170",
    linkedin: "https://www.linkedin.com/in/aranya170",
    email: "aranya.akd@gmail.com",
  });
  const [footer, setFooter] = useState({
    copyrightText: "© {year} Aranya Kishor Das. All rights reserved.",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (portfolio && portfolio.settings) {
      if (portfolio.settings.socials) setSocials(portfolio.settings.socials);
      if (portfolio.settings.footer) setFooter(portfolio.settings.footer);
    }
  }, [portfolio]);

  const handleSaveSocials = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setAlert(null);
    try {
      await api.updateSettings({ socials, footer });
      setAlert({ type: "success", text: "Global settings & socials saved successfully!" });
      refreshPortfolio();
    } catch (err) {
      setAlert({ type: "error", text: "Failed to save settings: " + err.message });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setAlert({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (passwords.newPassword.length < 4) {
      setAlert({ type: "error", text: "Password must be at least 4 characters." });
      return;
    }
    setSavingPassword(true);
    setAlert(null);
    try {
      await api.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setAlert({ type: "success", text: "Admin password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setAlert({ type: "error", text: "Failed to change password: " + err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.text}</span>
          <button onClick={() => setAlert(null)} style={{ background: "none", border: "none", color: "inherit" }}>
            ✕
          </button>
        </div>
      )}

      {/* Social Links & Footer */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <VscGlobe /> Social Profiles & Footer Configuration
            </h3>
            <div className="admin-card-subtitle">
              Manage external social links, contact email, and footer copyright text.
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSocials}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-label">GitHub Profile URL</label>
              <input
                type="url"
                className="admin-input"
                value={socials.github}
                onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                placeholder="https://github.com/aranya170"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">LinkedIn Profile URL</label>
              <input
                type="url"
                className="admin-input"
                value={socials.linkedin}
                onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                placeholder="https://www.linkedin.com/in/aranya170"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-label">Primary Contact Email</label>
              <input
                type="email"
                className="admin-input"
                value={socials.email}
                onChange={(e) => setSocials({ ...socials, email: e.target.value })}
                placeholder="aranya.akd@gmail.com"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Footer Copyright Notice</label>
              <input
                type="text"
                className="admin-input"
                value={footer.copyrightText}
                onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                placeholder="© {year} Aranya Kishor Das. All rights reserved."
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={savingSettings}>
              <VscSave /> {savingSettings ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <VscKey /> Admin Security & Password
            </h3>
            <div className="admin-card-subtitle">Update your admin credentials and password.</div>
          </div>
        </div>

        <form onSubmit={handleChangePassword}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-label">Current Password</label>
              <input
                type="password"
                className="admin-input"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">New Password</label>
              <input
                type="password"
                className="admin-input"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Confirm New Password</label>
              <input
                type="password"
                className="admin-input"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn admin-btn-secondary" disabled={savingPassword}>
              <VscKey /> {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

      {/* PostgreSQL Instructions Guide */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">
              <VscDatabase /> PostgreSQL Database Setup Guide
            </h3>
            <div className="admin-card-subtitle">
              How to configure your live PostgreSQL instance (Neon, Supabase, Railway, Render, or Local PG).
            </div>
          </div>
        </div>

        <div style={{ fontSize: "0.88rem", color: "#c9d1d9", lineHeight: 1.6 }}>
          <p>
            Your backend automatically synchronizes with PostgreSQL. To connect a database:
          </p>
          <ol style={{ paddingLeft: 20 }}>
            <li>
              Open <code style={{ color: "#64d98a" }}>server/.env</code> in your editor.
            </li>
            <li>
              Set your connection string:
              <pre
                style={{
                  background: "#161b26",
                  padding: 12,
                  borderRadius: 6,
                  margin: "8px 0",
                  color: "#58a6ff",
                }}
              >
                DATABASE_URL=postgresql://username:password@your-postgres-host:5432/portfolio_db
              </pre>
            </li>
            <li>
              Restart the backend server. The database schema and all initial data will be automatically migrated!
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
