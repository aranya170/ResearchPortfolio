import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { usePortfolio } from "../../context/PortfolioContext";
import { VscAdd, VscEdit, VscTrash, VscSave, VscClose, VscBriefcase } from "react-icons/vsc";

export default function ExperienceSector() {
  const { refreshPortfolio } = usePortfolio();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    company: "",
    job_title: "",
    duration: "",
    descriptions: [""],
    sort_order: 1,
  });

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.getExperiences();
      if (res && res.success) {
        setExperiences(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load experiences:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const openCreateModal = () => {
    setEditingExp(null);
    setFormState({
      company: "",
      job_title: "Role @",
      duration: "NOV 2025 - Present",
      descriptions: ["Led key initiatives..."],
      sort_order: experiences.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    let descs = exp.descriptions;
    if (typeof descs === "string") {
      try { descs = JSON.parse(descs); } catch (e) { descs = []; }
    }
    setFormState({
      company: exp.company || "",
      job_title: exp.job_title || "",
      duration: exp.duration || "",
      descriptions: descs && descs.length > 0 ? descs : [""],
      sort_order: exp.sort_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, company) => {
    if (!window.confirm(`Delete experience at "${company}"?`)) return;
    try {
      await api.deleteExperience(id);
      setAlert({ type: "success", text: `Deleted experience at ${company}` });
      loadExperiences();
      refreshPortfolio();
    } catch (err) {
      setAlert({ type: "error", text: "Failed to delete: " + err.message });
    }
  };

  const handleAddBullet = () => {
    setFormState((prev) => ({
      ...prev,
      descriptions: [...prev.descriptions, ""],
    }));
  };

  const handleUpdateBullet = (index, value) => {
    const updated = [...formState.descriptions];
    updated[index] = value;
    setFormState((prev) => ({ ...prev, descriptions: updated }));
  };

  const handleRemoveBullet = (index) => {
    setFormState((prev) => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingExp) {
        await api.updateExperience(editingExp.id, formState);
        setAlert({ type: "success", text: `Updated experience at ${formState.company}` });
      } else {
        await api.createExperience(formState);
        setAlert({ type: "success", text: `Added experience at ${formState.company}` });
      }
      setIsModalOpen(false);
      loadExperiences();
      refreshPortfolio();
    } catch (err) {
      setAlert({ type: "error", text: "Failed to save: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Experience & Roles Sector</h3>
          <div className="admin-card-subtitle">
            Manage your career history, research positions, club leadership, and responsibility bullets.
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          <VscAdd /> Add Work Experience
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
        <div style={{ padding: 20, color: "#8b949e" }}>Loading experience history...</div>
      ) : experiences.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: "#8b949e" }}>
          No work experiences added yet. Click "Add Work Experience" to add one.
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company / Organization</th>
                <th>Role / Title</th>
                <th>Duration</th>
                <th>Responsibilities</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => {
                let descs = exp.descriptions;
                if (typeof descs === "string") {
                  try { descs = JSON.parse(descs); } catch (e) { descs = []; }
                }
                return (
                  <tr key={exp.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: "#fff" }}>{exp.company}</div>
                      <div style={{ fontSize: "0.78rem", color: "#8b949e" }}>Order #{exp.sort_order}</div>
                    </td>
                    <td>
                      <span className="admin-tag" style={{ background: "rgba(100, 217, 138, 0.15)", color: "#64d98a" }}>
                        {exp.job_title}
                      </span>
                    </td>
                    <td style={{ color: "#c9d1d9", fontSize: "0.85rem" }}>{exp.duration}</td>
                    <td>
                      <div style={{ fontSize: "0.82rem", color: "#8b949e", maxWidth: 350 }}>
                        {(descs || []).length} bullet points:
                        <ul style={{ margin: "4px 0 0", paddingLeft: 16 }}>
                          {(descs || []).slice(0, 2).map((d, i) => (
                            <li key={i} style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          onClick={() => openEditModal(exp)}
                        >
                          <VscEdit /> Edit
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(exp.id, exp.company)}
                        >
                          <VscTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 700 }}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#fff" }}>
                {editingExp ? `Edit: ${editingExp.company}` : "Add Work Experience"}
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
                    <label className="admin-label">Company / Institution Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formState.company}
                      onChange={(e) => setFormState({ ...formState, company: e.target.value })}
                      placeholder="UIU Robotics Club / United International University"
                      required
                    />
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Job Title / Role</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formState.job_title}
                      onChange={(e) => setFormState({ ...formState, job_title: e.target.value })}
                      placeholder="President @ / Research Assistant @"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Duration</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formState.duration}
                      onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                      placeholder="NOV 2025 - Present"
                      required
                    />
                  </div>
                </div>

                {/* Bullet Points */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="admin-label" style={{ margin: 0 }}>
                      Responsibilities & Highlights ({formState.descriptions.length})
                    </label>
                    <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAddBullet}>
                      <VscAdd /> Add Bullet
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {formState.descriptions.map((desc, idx) => (
                      <div key={idx} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#64d98a", fontSize: "0.9rem", paddingTop: 8 }}>•</span>
                        <textarea
                          className="admin-textarea"
                          value={desc}
                          onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                          rows={2}
                          placeholder={`Key responsibility or accomplishment #${idx + 1}...`}
                          style={{ flexGrow: 1 }}
                          required
                        />
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleRemoveBullet(idx)}
                          style={{ marginTop: 6 }}
                        >
                          <VscTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <VscSave /> {saving ? "Saving..." : "Save Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
