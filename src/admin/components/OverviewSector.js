import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  VscProject,
  VscBriefcase,
  VscMilestone,
  VscTools,
  VscMail,
  VscDatabase,
  VscCheck,
  VscWarning,
  VscRefresh,
  VscFlame,
  VscAccount,
  VscSettingsGear,
  VscArrowRight,
  VscPulse,
} from "react-icons/vsc";

export default function OverviewSector({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reseedLoading, setReseedLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminStats();
      if (res && res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleReseed = async () => {
    if (!window.confirm("Are you sure you want to reset and reseed all database tables with original portfolio data?")) {
      return;
    }
    try {
      setReseedLoading(true);
      setMessage("");
      const res = await api.reseedDatabase();
      setMessage(res.message || "Database reset completed.");
      loadStats();
    } catch (err) {
      setMessage("Error resetting database: " + err.message);
    } finally {
      setReseedLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ color: "#94a3b8", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: "1.1rem", marginBottom: 8, color: "#fff" }}>Synchronizing Dashboard...</div>
        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Querying PostgreSQL metadata & metrics</div>
      </div>
    );
  }

  const isDbConnected = stats?.dbConnected;
  const config = stats?.dbStatus?.config || {};
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div className="admin-welcome-banner">
        <div>
          <div style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
            {todayDate}
          </div>
          <h2 className="admin-welcome-title">Welcome back, Aranya</h2>
          <p className="admin-welcome-desc">
            Your portfolio engine is active and serving dynamic content from {isDbConnected ? "PostgreSQL (Neon)" : "Local Fallback State"}.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={() => onNavigateTab("projects")}>
            <VscProject /> Manage Projects
          </button>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => onNavigateTab("messages")}>
            <VscMail /> View Messages {stats?.unreadMessagesCount > 0 && `(${stats.unreadMessagesCount})`}
          </button>
        </div>
      </div>

      {message && (
        <div className="admin-alert admin-alert-success">
          <span>{message}</span>
          <button onClick={() => setMessage("")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" onClick={() => onNavigateTab("projects")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8" }}>
            <VscProject />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.projectsCount || 0}</div>
            <div className="admin-stat-label">Total Projects</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("experience")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            <VscBriefcase />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.experienceCount || 0}</div>
            <div className="admin-stat-label">Work Roles</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("timeline")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
            <VscMilestone />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.timelineCount || 0}</div>
            <div className="admin-stat-label">Milestones</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("techstack")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(168, 85, 247, 0.15)", color: "#a855f7" }}>
            <VscTools />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.techStackCount || 0}</div>
            <div className="admin-stat-label">Tech Items</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("messages")} style={{ cursor: "pointer" }}>
          <div
            className="admin-stat-icon"
            style={{
              background: stats?.unreadMessagesCount > 0 ? "rgba(244, 63, 94, 0.18)" : "rgba(16, 185, 129, 0.15)",
              color: stats?.unreadMessagesCount > 0 ? "#f43f5e" : "#10b981",
            }}
          >
            <VscMail />
          </div>
          <div>
            <div className="admin-stat-number">
              {stats?.unreadMessagesCount || 0}
              <span style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "normal" }}> / {stats?.totalMessagesCount || 0}</span>
            </div>
            <div className="admin-stat-label">Unread Messages</div>
          </div>
        </div>
      </div>

      {/* Database Status Card */}
      <div className="admin-card" style={{ borderColor: isDbConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: isDbConnected ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
                color: isDbConnected ? "#10b981" : "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              <VscDatabase />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#fff", fontWeight: 700 }}>
                  PostgreSQL Engine: {isDbConnected ? "Active & Healthy" : "Offline / Local Resilient"}
                </h3>
                {isDbConnected ? (
                  <span className="admin-tag" style={{ background: "rgba(16, 185, 129, 0.18)", color: "#10b981" }}>
                    <VscCheck /> Connected (Neon)
                  </span>
                ) : (
                  <span className="admin-tag" style={{ background: "rgba(245, 158, 11, 0.18)", color: "#f59e0b" }}>
                    <VscWarning /> Offline
                  </span>
                )}
              </div>
              <p style={{ margin: "6px 0 0", fontSize: "0.83rem", color: "#94a3b8" }}>
                Target Server: <code style={{ color: "#38bdf8" }}>{config.host || "Neon Serverless"}</code> | DB: <code style={{ color: "#38bdf8" }}>{config.database || "portfolio"}</code> | SSL: <code style={{ color: "#38bdf8" }}>Active</code>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={loadStats} title="Ping Database Server">
              <VscRefresh /> Test Connection
            </button>
            <button
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={handleReseed}
              disabled={reseedLoading}
              title="Reset all tables to default seed state"
            >
              {reseedLoading ? "Reseeding..." : "Reseed Database"}
            </button>
          </div>
        </div>
      </div>

      {/* Sector Editability Grid */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Portfolio Sector Management Hub</h3>
            <div className="admin-card-subtitle">Quickly jump to modify content, images, timeline, or config across sectors</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { id: "intro", title: "Hero & Intro Sector", icon: <VscFlame style={{ color: "#10b981" }} />, desc: "Greeting, animated titles, bio description, CV download" },
            { id: "about", title: "About Me Sector", icon: <VscAccount style={{ color: "#38bdf8" }} />, desc: "Profile photo, bio paragraphs, core focus pills" },
            { id: "projects", title: "Projects & Code Sector", icon: <VscProject style={{ color: "#a855f7" }} />, desc: "Software, Research, Hardware projects and code files" },
            { id: "experience", title: "Experience Sector", icon: <VscBriefcase style={{ color: "#10b981" }} />, desc: "Work positions, company details, key achievements" },
            { id: "timeline", title: "Timeline Sector", icon: <VscMilestone style={{ color: "#f59e0b" }} />, desc: "Chronological milestones, research, leadership" },
            { id: "techstack", title: "Tech Stack Sector", icon: <VscTools style={{ color: "#38bdf8" }} />, desc: "Languages, toolkits, custom icons & colors" },
            { id: "messages", title: "Inbound Messages", icon: <VscMail style={{ color: "#f43f5e" }} />, desc: "Contact inquiries sent by visitors & recruiters" },
            { id: "settings", title: "Settings & Socials", icon: <VscSettingsGear style={{ color: "#94a3b8" }} />, desc: "Social URLs, credentials, stars backdrop controls" },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab(item.id)}
              style={{
                padding: "18px 20px",
                borderRadius: "var(--admin-radius-md)",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid var(--admin-card-border)",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--admin-accent)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--admin-card-border)";
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "1.1rem" }}>
                    {item.icon}
                    <h4 style={{ margin: 0, fontSize: "0.98rem", color: "#fff", fontWeight: 700 }}>{item.title}</h4>
                  </div>
                  <VscArrowRight style={{ color: "#64748b", fontSize: "0.9rem" }} />
                </div>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.4 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

