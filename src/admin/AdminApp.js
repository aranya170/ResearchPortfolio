import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../services/api";
import { usePortfolio } from "../context/PortfolioContext";
import AdminLogin from "./AdminLogin";
import OverviewSector from "./components/OverviewSector";
import IntroSector from "./components/IntroSector";
import AboutSector from "./components/AboutSector";
import ProjectsSector from "./components/ProjectsSector";
import ExperienceSector from "./components/ExperienceSector";
import TimelineSector from "./components/TimelineSector";
import TechStackSector from "./components/TechStackSector";
import MessagesSector from "./components/MessagesSector";
import SettingsSector from "./components/SettingsSector";
import "./styles/Admin.css";

import {
  VscDashboard,
  VscFlame,
  VscAccount,
  VscProject,
  VscBriefcase,
  VscMilestone,
  VscTools,
  VscMail,
  VscSettingsGear,
  VscSignOut,
  VscGlobe,
  VscMenu,
  VscClose,
  VscChevronRight,
  VscDatabase,
  VscRefresh,
} from "react-icons/vsc";

export default function AdminApp() {
  const history = useHistory();
  const { isBackendOnline, refreshPortfolio } = usePortfolio();
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("portfolio_admin_token");
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (res && res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem("portfolio_admin_token");
        }
      } catch (err) {
        localStorage.removeItem("portfolio_admin_token");
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  // Poll / check unread messages
  useEffect(() => {
    if (user) {
      api.getMessages()
        .then((res) => {
          if (res && res.success && Array.isArray(res.data)) {
            const count = res.data.filter((m) => !m.is_read).length;
            setUnreadCount(count);
          }
        })
        .catch(() => {});
    }
  }, [user, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("portfolio_admin_user");
    setUser(null);
  };

  const handleBackToSite = () => {
    history.push("/");
  };

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  if (authChecking) {
    return (
      <div className="admin-login-wrap" style={{ color: "#94a3b8" }}>
        <div style={{ textAlign: "center" }}>
          <div className="admin-brand-icon" style={{ margin: "0 auto 16px", width: 50, height: 50 }}>
            A
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginBottom: 6 }}>
            Aranya Portfolio Admin
          </div>
          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
            Verifying secure session token...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLoginSuccess={(u) => setUser(u)} onBackToSite={handleBackToSite} />;
  }

  const navGroups = [
    {
      title: "Core Hub",
      items: [
        { id: "overview", label: "Overview & Analytics", icon: <VscDashboard /> },
      ],
    },
    {
      title: "Portfolio Sectors",
      items: [
        { id: "intro", label: "Hero & Intro", icon: <VscFlame /> },
        { id: "about", label: "About Me", icon: <VscAccount /> },
        { id: "projects", label: "Projects & Code", icon: <VscProject /> },
        { id: "experience", label: "Experience", icon: <VscBriefcase /> },
        { id: "timeline", label: "Timeline", icon: <VscMilestone /> },
        { id: "techstack", label: "Tech Stack", icon: <VscTools /> },
      ],
    },
    {
      title: "Communications & Config",
      items: [
        { id: "messages", label: "Inbound Inbox", icon: <VscMail />, badge: unreadCount },
        { id: "settings", label: "Settings & DB", icon: <VscSettingsGear /> },
      ],
    },
  ];

  const allNavItems = navGroups.flatMap((g) => g.items);
  const currentNavItem = allNavItems.find((n) => n.id === activeTab) || allNavItems[0];

  return (
    <div className="admin-wrapper">
      {/* Responsive Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <img src="/icon.png" alt="Admin Logo" style={{ width: 28, height: 28, borderRadius: 6 }} />
          <div>
            <div className="admin-brand-title">Aranya Portfolio</div>
            <div className="admin-brand-sub">Management Engine</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navGroups.map((group, gIdx) => (
            <React.Fragment key={gIdx}>
              <div className="admin-nav-group-title">{group.title}</div>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => handleTabSelect(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="admin-nav-badge">{item.badge}</span>}
                </button>
              ))}
            </React.Fragment>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {(user.username || "A").substring(0, 2).toUpperCase()}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">{user.username}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>

          <button className="admin-nav-item" onClick={handleBackToSite} title="Open main website">
            <VscGlobe />
            <span>Return to Portfolio</span>
          </button>

          <button
            className="admin-nav-item"
            onClick={handleLogout}
            style={{ color: "#f43f5e" }}
            title="Terminate session"
          >
            <VscSignOut />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <VscClose /> : <VscMenu />}
            </button>

            <div className="admin-header-breadcrumbs">
              <span>Admin Portal</span>
              <VscChevronRight style={{ fontSize: "0.75rem" }} />
              <span className="active">
                {currentNavItem.icon}
                {currentNavItem.label}
              </span>
            </div>
          </div>

          <div className="admin-header-actions">
            <div className="admin-status-pill" title={isBackendOnline ? "Connected to PostgreSQL Database" : "Running on Local Offline Cache"}>
              <div className="admin-radar-wrap">
                <div className={`admin-radar-wave ${isBackendOnline ? "online" : "offline"}`} />
                <div className={`admin-radar-dot ${isBackendOnline ? "online" : "offline"}`} />
              </div>
              <span>{isBackendOnline ? "PostgreSQL Live" : "Resilient Local"}</span>
            </div>

            <button
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => {
                refreshPortfolio();
              }}
              title="Sync latest database records"
            >
              <VscRefresh /> Sync Data
            </button>
          </div>
        </header>

        <div className="admin-content-body">
          {activeTab === "overview" && <OverviewSector onNavigateTab={(tab) => handleTabSelect(tab)} />}
          {activeTab === "intro" && <IntroSector />}
          {activeTab === "about" && <AboutSector />}
          {activeTab === "projects" && <ProjectsSector />}
          {activeTab === "experience" && <ExperienceSector />}
          {activeTab === "timeline" && <TimelineSector />}
          {activeTab === "techstack" && <TechStackSector />}
          {activeTab === "messages" && <MessagesSector />}
          {activeTab === "settings" && <SettingsSector />}
        </div>
      </main>
    </div>
  );
}

