import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  VscMail,
  VscMailRead,
  VscTrash,
  VscCheck,
  VscRefresh,
  VscAccount,
  VscCalendar,
} from "react-icons/vsc";

export default function MessagesSector() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [alert, setAlert] = useState(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await api.getMessages();
      if (res && res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

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
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      setAlert({ type: "success", text: "Message deleted." });
    } catch (err) {
      setAlert({ type: "error", text: "Failed to delete: " + err.message });
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      handleToggleRead(msg);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">
            Inbound Messages & Contact Form Submissions
            {unreadCount > 0 && <span className="admin-nav-badge" style={{ marginLeft: 10 }}>{unreadCount} new</span>}
          </h3>
          <div className="admin-card-subtitle">
            Messages sent by recruiters, collaborators, and visitors through your portfolio contact form.
          </div>
        </div>
        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={loadMessages}>
          <VscRefresh /> Refresh Inbox
        </button>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.text}</span>
          <button onClick={() => setAlert(null)} style={{ background: "none", border: "none", color: "inherit" }}>
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 20, color: "#8b949e" }}>Loading inbox messages...</div>
      ) : messages.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#8b949e" }}>
          <VscMail style={{ fontSize: 36, opacity: 0.5, marginBottom: 8 }} />
          <div>No messages received yet. Messages sent from your contact form will appear here.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedMessage ? "1fr 1.2fr" : "1fr", gap: 20 }}>
          {/* Message List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 600, overflowY: "auto" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleSelectMessage(msg)}
                style={{
                  padding: 14,
                  borderRadius: 8,
                  background: selectedMessage?.id === msg.id
                    ? "rgba(100, 217, 138, 0.12)"
                    : !msg.is_read
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 255, 255, 0.02)",
                  border: "1px solid",
                  borderColor: selectedMessage?.id === msg.id
                    ? "var(--admin-accent)"
                    : !msg.is_read
                    ? "rgba(100, 217, 138, 0.3)"
                    : "rgba(255, 255, 255, 0.06)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {!msg.is_read && (
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#64d98a" }} />
                    )}
                    <span style={{ fontWeight: msg.is_read ? 500 : 700, color: "#fff", fontSize: "0.92rem" }}>
                      {msg.name}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#8b949e" }}>
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : "Recent"}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#58a6ff", marginBottom: 6 }}>{msg.email}</div>

                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "#8b949e",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          {/* Message Reader Panel */}
          {selectedMessage && (
            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 10,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "1.1rem", color: "#fff" }}>
                    {selectedMessage.name}
                  </h4>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    style={{ color: "#58a6ff", fontSize: "0.85rem", textDecoration: "none" }}
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => handleToggleRead(selectedMessage)}
                    title={selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                  >
                    {selectedMessage.is_read ? <VscMail /> : <VscMailRead />}
                    {selectedMessage.is_read ? "Mark Unread" : "Mark Read"}
                  </button>
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleDelete(selectedMessage.id)}
                    title="Delete Message"
                  >
                    <VscTrash />
                  </button>
                </div>
              </div>

              <div style={{ fontSize: "0.78rem", color: "#8b949e", display: "flex", alignItems: "center", gap: 6 }}>
                <VscCalendar /> Received:{" "}
                {selectedMessage.created_at
                  ? new Date(selectedMessage.created_at).toLocaleString()
                  : "N/A"}
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  padding: 16,
                  borderRadius: 8,
                  color: "#e6edf3",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  flexGrow: 1,
                }}
              >
                {selectedMessage.message}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry`}
                  className="admin-btn admin-btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <VscMail /> Reply via Email
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
