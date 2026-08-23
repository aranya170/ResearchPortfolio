import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { usePortfolio } from "../../context/PortfolioContext";
import { VscAdd, VscEdit, VscTrash, VscSave, VscClose, VscTools } from "react-icons/vsc";

const commonIcons = [
  "SiMysql", "SiPython", "SiOpenjdk", "SiPandas", "SiNumpy", "SiGit",
  "SiJupyter", "SiFigma", "SiAdobeillustrator", "SiAdobephotoshop", "SiGithub",
  "SiHtml5", "SiCss3", "SiTailwindcss", "SiJavascript", "SiJira", "SiTinkercad",
  "SiCplusplus", "SiC", "SiReact", "SiNextdotjs", "SiFlutter", "SiPostgresql",
  "SiDocker", "SiNodedotjs", "SiPytorch", "SiTensorflow", "SiMongodb", "SiLinux"
];

export default function TechStackSector() {
  const { refreshPortfolio } = usePortfolio();
  const [techStack, setTechStack] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    category: "Languages",
    icon_name: "SiPython",
    color: "#64D98A",
    sort_order: 1,
  });

  const loadTechStack = async () => {
    try {
      setLoading(true);
      const res = await api.getTechStack();
      if (res && res.success) {
        setTechStack(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load tech stack:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechStack();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormState({
      name: "",
      category: "Frontend",
      icon_name: "SiReact",
      color: "#61DAFB",
      sort_order: techStack.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormState({
      name: item.name || "",
      category: item.category || "General",
      icon_name: item.icon_name || "SiPython",
      color: item.color || "#64D98A",
      sort_order: item.sort_order || 1,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete tech tool "${name}"?`)) return;
    try {
      await api.deleteTechStackItem(id);
      setAlert({ type: "success", text: `Deleted "${name}"` });
      loadTechStack();
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
        await api.updateTechStackItem(editingItem.id, formState);
        setAlert({ type: "success", text: `Updated tool "${formState.name}"` });
      } else {
        await api.createTechStackItem(formState);
        setAlert({ type: "success", text: `Added new tool "${formState.name}"` });
      }
      setIsModalOpen(false);
      loadTechStack();
      refreshPortfolio();
    } catch (err) {
      setAlert({ type: "error", text: "Failed to save tool: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Tech Stack & Tools Sector</h3>
          <div className="admin-card-subtitle">
            Manage programming languages, frameworks, AI libraries, design tools, and brand colors.
          </div>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={openCreateModal}>
          <VscAdd /> Add Tech Tool
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
        <div style={{ padding: 20, color: "#8b949e" }}>Loading tech stack...</div>
      ) : techStack.length === 0 ? (
        <div style={{ padding: 30, textAlign: "center", color: "#8b949e" }}>
          No tools added yet. Click "Add Tech Tool" to add one.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
          {techStack.map((item) => (
            <div
              key={item.id}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: `${item.color}22`,
                    border: `1px solid ${item.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                  }}
                >
                  ●
                </div>
                <div style={{ fontSize: "0.75rem", color: "#8b949e" }}>#{item.sort_order}</div>
              </div>

              <div>
                <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.95rem" }}>{item.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#8b949e" }}>{item.icon_name}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: item.color,
                  }}
                  title={`Color: ${item.color}`}
                />
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    style={{ padding: "3px 6px" }}
                    onClick={() => openEditModal(item)}
                    title="Edit"
                  >
                    <VscEdit />
                  </button>
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    style={{ padding: "3px 6px" }}
                    onClick={() => handleDelete(item.id, item.name)}
                    title="Delete"
                  >
                    <VscTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal" style={{ maxWidth: 550 }}>
            <div className="admin-modal-header">
              <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#fff" }}>
                {editingItem ? `Edit Tool: ${editingItem.name}` : "Add Tech Tool"}
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
                    <label className="admin-label">Tool / Technology Name</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. PyTorch / PostgreSQL / Docker"
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

                <div className="admin-form-group">
                  <label className="admin-label">React Icon Identifier (react-icons/si)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={formState.icon_name}
                    onChange={(e) => setFormState({ ...formState, icon_name: e.target.value })}
                    placeholder="SiPython / SiReact / SiMysql"
                    required
                  />
                  <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <span style={{ fontSize: "0.75rem", color: "#8b949e", alignSelf: "center", marginRight: 4 }}>
                      Suggestions:
                    </span>
                    {commonIcons.slice(0, 10).map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setFormState({ ...formState, icon_name: ic })}
                        style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "none",
                          borderRadius: 4,
                          color: "#c9d1d9",
                          fontSize: "0.72rem",
                          padding: "2px 6px",
                          cursor: "pointer",
                        }}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="admin-form-group">
                    <label className="admin-label">Category</label>
                    <input
                      type="text"
                      className="admin-input"
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      placeholder="Languages / Frontend / AI & ML"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Brand Color (Hex)</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        type="color"
                        value={formState.color}
                        onChange={(e) => setFormState({ ...formState, color: e.target.value })}
                        style={{
                          width: 42,
                          height: 38,
                          borderRadius: 6,
                          border: "1px solid #30363d",
                          background: "none",
                          cursor: "pointer",
                        }}
                      />
                      <input
                        type="text"
                        className="admin-input"
                        value={formState.color}
                        onChange={(e) => setFormState({ ...formState, color: e.target.value })}
                        placeholder="#64D98A"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                  <VscSave /> {saving ? "Saving..." : "Save Tool"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
