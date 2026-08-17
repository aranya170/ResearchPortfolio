import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { usePortfolio } from "../../context/PortfolioContext";
import { VscAdd, VscEdit, VscTrash, VscSave, VscClose, VscMilestone } from "react-icons/vsc";

export default function TimelineSector() {
  const { refreshPortfolio } = usePortfolio();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    year: "",
    type: "startup",
    sort_order: 1,
  });

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const res = await api.getTimeline();
      if (res && res.success) {
        setTimeline(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({
      title: "",
      description: "",
      year: "2026",
      type: "startup",
      sort_order: timeline.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      title: item.title || "",
      description: item.description || "",
      year: item.year || "",
      type: item.type || "startup",
      sort_order: item.sort_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete milestone "${title}"?`)) return;
    try {
      await api.deleteTimelineEvent(id);
      setAlert({ type: "success", text: `Deleted milestone "${title}"` });
      loadTimeline();
      refreshPortfolio();
    } catch (err) {
      setAlert({ type: "error", text: "Failed to delete: " + err.message });
    }
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.updateTimelineEvent(editingItem.id, formState);
        setAlert({ type: "success", text: `Updated milestone "${formState.title}"` });
      } else {
        await api.createTimelineEvent(formState);
        setAlert({ type: "success", text: `Added new milestone "${formState.title}"` });
      }
      setIsModalOpen(false);
      loadTimeline();
      refreshPortfolio();
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const typeColorMap = {
    startup: "#64d98a",
    education: "#58a6ff",
    research: "#bb80ff",
    career: "#e3b341",
    statistics: "#f778ba",
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Timeline & Milestones Sector</h3>
          <div className="admin-card-subtitle">
            Manage your personal journey timeline events, milestone years, and category icons.
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          <VscAdd /> Add Milestone
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
        <div style={{ padding: 20, color: "#8b949e" }}>Loading timeline...</div>
      ) : timeline.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: "#8b949e" }}>
          No milestones added yet. Click "Add Milestone" to add one.
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Milestone Title</th>
                <th>Category Type</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "rgba(255, 255, 255, 0.06)",
                        fontWeight: 700,
                        color: "#fff",
                        fontSize: "0.85rem",
                      }}
                    >
                      {item.year}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#fff" }}>{item.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "#8b949e" }}>Order #{item.sort_order}</div>
                  </td>
                  <td>
                    <span
                      className="admin-tag"
                      style={{
                        background: `${typeColorMap[item.type] || "#64d98a"}22`,
                        color: typeColorMap[item.type] || "#64d98a",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td style={{ color: "#8b949e", fontSize: "0.85rem", maxWidth: 350 }}>{item.description}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => openEditModal(item)}>
                        <VscEdit /> Edit
                      </button>
                      <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(item.id, item.title)}>
                        <VscTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 600 }}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#fff" }}>
                {editingItem ? `Edit Milestone: ${editingItem.title}` : "Add Timeline Milestone"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "none", border: "none", color: "#8b949e", fontSize: "1.2rem", cursor: "pointer" }}
              >
                <VscClose />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="admin-modal-body">
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Milestone Title</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formState.title}
                      onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                      placeholder="e.g. Undergrad Life at UIU / Pivot to AI & DL"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Year / Timeframe</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formState.year}
                      onChange={(e) => setFormState({ ...formState, year: e.target.value })}
                      placeholder="2024 / 2025 - Present"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Event Category Type</label>
                    <select
                      className="admin-select"
                      value={formState.type}
                      onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                    >
                      <option value="startup">Startup / Innovation</option>
                      <option value="education">Education</option>
                      <option value="research">Research</option>
                      <option value="career">Career & Leadership</option>
                      <option value="statistics">Skills & Design</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Sort Order</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formState.sort_order}
                      onChange={(e) => setFormState({ ...formState, sort_order: parseInt(e.target.value, 10) || 1 })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Description</label>
                  <textarea
                    className="admin-textarea"
                    value={formState.description}
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    rows={3}
                    placeholder="Provide a concise description of this milestone..."
                    required
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <VscSave /> {saving ? "Saving..." : "Save Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
