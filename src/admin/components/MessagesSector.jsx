import React, { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import {
  VscMail,
  VscMailRead,
  VscTrash,
  VscCheck,
  VscRefresh,
  VscAccount,
  VscCalendar,
  VscSearch,
  VscCopy,
  VscReply,
  VscInbox,
  VscChevronLeft,
} from "react-icons/vsc";

export default function MessagesSector() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // "all" or "unread"
  const [copied, setCopied] = useState(false);
  const [mobileViewingDetail, setMobileViewingDetail] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getMessages();
      if (res && res.success) {
        const msgs = res.data || [];
        setMessages(msgs);
        // Keep the open message (with fresh data) if it still exists, else show the newest
        setSelectedMessage((prev) => (prev && msgs.find((m) => m.id === prev.id)) || msgs[0] || null);
      }
    } catch (err) {
      setAlert({ type: "error", text: "Failed to load messages: " + err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleToggleRead = async (msg) => {
    try {
      const newStatus = !msg.is_read;
      await api.markMessageRead(msg.id, newStatus);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage((prev) => ({ ...prev, is_read: newStatus }));
      }
    } catch (err) {
      setAlert({ type: "error", text: "Failed to update status: " + err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry from database?")) return;
    try {
      await api.deleteMessage(id);
      const remaining = messages.filter((m) => m.id !== id);
      setMessages(remaining);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(remaining.length > 0 ? remaining[0] : null);
      }
      setMobileViewingDetail(false);
      setAlert({ type: "success", text: "Message permanently deleted." });
    } catch (err) {
      setAlert({ type: "error", text: "Failed to delete: " + err.message });
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    setMobileViewingDetail(true);
    if (!msg.is_read) {
      handleToggleRead(msg);
    }
  };

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const filteredMessages = messages.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (m.name || "").toLowerCase().includes(term) ||
      (m.email || "").toLowerCase().includes(term) ||
      (m.message || "").toLowerCase().includes(term);
    const matchesFilter = filterMode === "all" || !m.is_read;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">
            <VscInbox style={{ color: "var(--admin-primary)" }} /> Inbound Message Inbox
          </h3>
          <div className="admin-card-subtitle">
            Direct communications submitted by visitors and recruiters through the contact form
          </div>
        </div>

        <div className="admin-row-actions">
          <button
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={async () => {
              try {
                setTestingEmail(true);
                setAlert({ type: "info", text: "Sending test email to configured Gmail address..." });
                const res = await api.testEmailDelivery();
                if (res.success) {
                  setAlert({ type: "success", text: res.message || "Test email delivered successfully!" });
                } else {
                  setAlert({ type: "error", text: res.message || "Failed to send test email" });
                }
              } catch (err) {
                setAlert({ type: "error", text: "Test email failed: " + err.message });
              } finally {
                setTestingEmail(false);
              }
            }}
            disabled={testingEmail}
            title="Sends a diagnostic test notification to your Gmail"
          >
            <VscMail /> {testingEmail ? "Sending Test..." : "Test Gmail Alert"}
          </button>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={loadMessages}>
            <VscRefresh /> Refresh
          </button>
        </div>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.text}</span>
          <button type="button" className="admin-alert-close" onClick={() => setAlert(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading inbox messages...</div>
      ) : messages.length === 0 ? (
        <div className="admin-empty">
          <VscInbox className="admin-empty-icon" />
          <h4 className="admin-empty-title">Inbox is Empty</h4>
          <p style={{ margin: 0 }}>
            When someone submits a message on your site, it will arrive here in real-time.
          </p>
        </div>
      ) : (
        <div className={`admin-inbox-grid ${mobileViewingDetail ? "mobile-detail-active" : ""}`}>
          {/* Left Column: Messages List */}
          <div className="admin-inbox-list-col">
            <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Search sender, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: 34, fontSize: "0.85rem", padding: "8px 12px 8px 34px" }}
                />
                <VscSearch style={{ position: "absolute", left: 10, top: 10, color: "#64748b" }} />
              </div>

              <div style={{ display: "flex", gap: 4 }}>
                <button
                  className={`admin-filter-pill ${filterMode === "all" ? "active" : ""}`}
                  onClick={() => setFilterMode("all")}
                  style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                >
                  All ({messages.length})
                </button>
                <button
                  className={`admin-filter-pill ${filterMode === "unread" ? "active" : ""}`}
                  onClick={() => setFilterMode("unread")}
                  style={{ fontSize: "0.78rem", padding: "4px 10px" }}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            <div className="admin-inbox-list">
              {filteredMessages.map((msg) => {
                const initials = (msg.name || "U")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();
                const isSelected = selectedMessage && selectedMessage.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`admin-inbox-item ${isSelected ? "active" : ""} ${!msg.is_read ? "unread" : ""}`}
                    onClick={() => handleSelectMessage(msg)}
                  >
                    <div className="admin-inbox-avatar">{initials}</div>
                    <div className="admin-inbox-preview">
                      <div className="admin-inbox-sender">
                        <span>{msg.name || "Anonymous"}</span>
                        <span className="admin-inbox-date">
                          {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.82rem", color: isSelected ? "#38bdf8" : "#cbd5e1", fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {msg.email}
                      </div>
                      <div className="admin-inbox-snippet">{msg.message || "..."}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Message Detail Viewer */}
          <div className="admin-inbox-detail-col">
            {selectedMessage ? (
              <div className="admin-inbox-viewer">
                {/* Mobile Back Button */}
                <div className="admin-inbox-mobile-back">
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => setMobileViewingDetail(false)}
                  >
                    <VscChevronLeft /> Back to Messages
                  </button>
                </div>

                {/* Header Actions */}
                <div className="admin-inbox-detail-header">
                  <div>
                    <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", color: "#fff", fontWeight: 700 }}>
                      Message from {selectedMessage.name || "Anonymous"}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: "0.85rem", color: "#94a3b8" }}>
                      <span style={{ color: "#fff", fontWeight: 600 }}>{selectedMessage.name}</span>
                      <span>&lt;{selectedMessage.email}&gt;</span>
                      <span>•</span>
                      <span>
                        {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : "Recently received"}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      onClick={() => handleToggleRead(selectedMessage)}
                      title={selectedMessage.is_read ? "Mark as unread" : "Mark as read"}
                    >
                      {selectedMessage.is_read ? <VscMail /> : <VscMailRead />}
                      {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={() => handleDelete(selectedMessage.id)}
                      title="Permanently remove"
                    >
                      <VscTrash /> Delete
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ flexGrow: 1, whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: "0.95rem", color: "#e2e8f0", background: "rgba(0,0,0,0.2)", padding: 18, borderRadius: "var(--admin-radius-md)", border: "1px solid var(--admin-card-border)", minHeight: 200, margin: "16px 0" }}>
                  {selectedMessage.message}
                </div>

                {/* Reply Toolbar */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent("Portfolio Inquiry")}`}
                    className="admin-btn admin-btn-primary admin-btn-sm"
                  >
                    <VscReply /> Reply via Email
                  </a>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => handleCopyEmail(selectedMessage.email)}
                  >
                    <VscCopy /> {copied ? "Copied!" : "Copy Email"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-empty">
                Select a message on the left to read details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
