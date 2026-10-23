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
      setAlert({ type: "error", text: "Failed to load tech stack: " + err.message });
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
          <button type="button" className="admin-alert-close" onClick={() => setAlert(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading tech stack...</div>
      ) : techStack.length === 0 ? (
        <div className="admin-empty">
          No tools added yet. Click "Add Tech Tool" to add one.
        </div>
      ) : (
        <div className="admin-tool-grid">
          {techStack.map((item) => (
            <div key={item.id} className="admin-tool-card">
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
                <div className="admin-cell-sub">#{item.sort_order}</div>
              </div>

              <div>
                <div className="admin-cell-title">{item.name}</div>
                <div className="admin-cell-sub">
                  {item.icon_name} · {item.category}
                </div>
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
                <div className="admin-row-actions">
                  <button
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    onClick={() => openEditModal(item)}
                    title="Edit"
                    aria-label={`Edit ${item.name}`}
                  >
                    <VscEdit />
                  </button>
                  <button
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleDelete(item.id, item.name)}
                    title="Delete"
                    aria-label={`Delete ${item.name}`}
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
              <h3>
                {editingItem ? `Edit Tool: ${editingItem.name}` : "Add Tech Tool"}
              </h3>
              <button type="button" className="admin-modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <VscClose />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="admin-modal-body">
                <div className="admin-grid admin-grid-2-1">
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="techstack-field-1">Tool / Technology Name</label>
                    <input id="techstack-field-1"
                      type="text"
                      className="admin-input"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. PyTorch / PostgreSQL / Docker"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="techstack-field-2">Sort Order</label>
                    <input id="techstack-field-2"
                      type="number"
                      className="admin-input"
                      value={formState.sort_order}
                      onChange={(e) => setFormState({ ...formState, sort_order: parseInt(e.target.value, 10) || 1 })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="techstack-field-3">React Icon Identifier (react-icons/si)</label>
                  <input id="techstack-field-3"
                    type="text"
                    className="admin-input"
                    value={formState.icon_name}
                    onChange={(e) => setFormState({ ...formState, icon_name: e.target.value })}
                    placeholder="SiPython / SiReact / SiMysql"
                    required
                  />
                  <div className="admin-helper" style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                    <span style={{ marginRight: 4 }}>Suggestions:</span>
                    {commonIcons.slice(0, 10).map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        className="admin-chip-btn"
                        onClick={() => setFormState({ ...formState, icon_name: ic })}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-grid admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="techstack-field-4">Category</label>
                    <input id="techstack-field-4"
                      type="text"
                      className="admin-input"
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                      placeholder="Languages / Frontend / AI & ML"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="techstack-field-5">Brand Color (Hex)</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input id="techstack-field-5"
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
