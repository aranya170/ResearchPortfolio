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
    return <div style={{ color: "#8b949e", padding: 20 }}>Loading dashboard analytics...</div>;
  }

  const isDbConnected = stats?.dbConnected;
  const config = stats?.dbStatus?.config || {};

  return (
    <div>
      {message && (
        <div className="admin-alert admin-alert-success">
          <span>{message}</span>
        </div>
      )}

      {/* Database Connection Card */}
      <div className="admin-card" style={{ borderColor: isDbConnected ? "rgba(63, 185, 80, 0.3)" : "rgba(227, 179, 65, 0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: isDbConnected ? "rgba(63, 185, 80, 0.15)" : "rgba(227, 179, 65, 0.15)",
                color: isDbConnected ? "#3fb950" : "#e3b341",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              <VscDatabase />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#fff" }}>
                  PostgreSQL Status: {isDbConnected ? "Connected & Active" : "Resilient Local Mode"}
                </h3>
                {isDbConnected ? (
                  <span className="admin-tag" style={{ background: "rgba(63, 185, 80, 0.2)", color: "#56d364" }}>
                    <VscCheck /> Live PG
                  </span>
                ) : (
                  <span className="admin-tag" style={{ background: "rgba(227, 179, 65, 0.2)", color: "#e3b341" }}>
                    <VscWarning /> Offline PG
                  </span>
                )}
              </div>
              <p style={{ margin: "4px 0 0", fontSize: "0.83rem", color: "#8b949e" }}>
                Target: <code>{config.host || "localhost"}</code> | Database: <code>{config.database || "portfolio"}</code> | User: <code>{config.user || "postgres"}</code>
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={loadStats} title="Refresh Status">
              <VscRefresh /> Check Connection
            </button>
            <button
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={handleReseed}
              disabled={reseedLoading}
              title="Reset and repopulate all default content"
            >
              {reseedLoading ? "Reseeding..." : "Reset / Reseed Database"}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" onClick={() => onNavigateTab("projects")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(88, 166, 255, 0.15)", color: "#58a6ff" }}>
            <VscProject />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.projectsCount || 0}</div>
            <div className="admin-stat-label">Total Projects</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("experience")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(100, 217, 138, 0.15)", color: "#64d98a" }}>
            <VscBriefcase />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.experienceCount || 0}</div>
            <div className="admin-stat-label">Work Experiences</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("timeline")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(227, 179, 65, 0.15)", color: "#e3b341" }}>
            <VscMilestone />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.timelineCount || 0}</div>
            <div className="admin-stat-label">Timeline Milestones</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("techstack")} style={{ cursor: "pointer" }}>
          <div className="admin-stat-icon" style={{ background: "rgba(187, 128, 255, 0.15)", color: "#bb80ff" }}>
            <VscTools />
          </div>
          <div>
            <div className="admin-stat-number">{stats?.techStackCount || 0}</div>
            <div className="admin-stat-label">Tech Stack Items</div>
          </div>
        </div>

        <div className="admin-stat-card" onClick={() => onNavigateTab("messages")} style={{ cursor: "pointer" }}>
          <div
            className="admin-stat-icon"
            style={{
              background: stats?.unreadMessagesCount > 0 ? "rgba(248, 81, 73, 0.2)" : "rgba(100, 217, 138, 0.15)",
              color: stats?.unreadMessagesCount > 0 ? "#f85149" : "#64d98a",
            }}
          >
            <VscMail />
          </div>
          <div>
            <div className="admin-stat-number">
              {stats?.unreadMessagesCount || 0}
              <span style={{ fontSize: "0.9rem", color: "#8b949e", fontWeight: "normal" }}> / {stats?.totalMessagesCount || 0}</span>
            </div>
            <div className="admin-stat-label">Unread Messages</div>
          </div>
        </div>
      </div>

      {/* Quick Sector Links */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Sector Editability Hub</h3>
            <div className="admin-card-subtitle">Directly manage and update content across all portfolio sectors</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { id: "intro", title: "Hero & Intro Sector", desc: "Greeting, name, animated roles, bio, CV document link" },
            { id: "about", title: "About Sector", desc: "Profile photo, biography paragraphs, highlight badges" },
            { id: "projects", title: "Projects & Code Sector", desc: "Software, Research, Hardware with attached code files" },
            { id: "experience", title: "Experience Sector", desc: "Roles, companies, dates, responsibility bullets" },
            { id: "timeline", title: "Timeline Sector", desc: "Milestones, education, research pivots, startups" },
            { id: "techstack", title: "Tech Stack Sector", desc: "Programming languages, frameworks, custom icon colors" },
            { id: "messages", title: "Inbound Messages", desc: "Contact form messages from prospective recruiters" },
            { id: "settings", title: "Socials & Global Config", desc: "LinkedIn, GitHub, email, stars background toggles" },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateTab(item.id)}
              style={{
                padding: 16,
                borderRadius: 8,
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--admin-accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <h4 style={{ margin: "0 0 4px", fontSize: "0.98rem", color: "#fff" }}>{item.title} →</h4>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#8b949e" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
