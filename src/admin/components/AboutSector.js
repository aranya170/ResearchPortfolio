import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { usePortfolio } from "../../context/PortfolioContext";
import { VscSave, VscCloudUpload, VscAdd, VscTrash } from "react-icons/vsc";

export default function AboutSector() {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const [formData, setFormData] = useState({
    title: "About Me",
    profile_image: "/assets/Aranya Kishor Das.png",
    paragraphs: [],
    timeline_link_text: "View my timeline to learn more about my unique journey",
    contact_button_text: "Get in Touch",
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (portfolio && portfolio.about) {
      setFormData({
        title: portfolio.about.title || "About Me",
        profile_image: portfolio.about.profile_image || "/assets/Aranya Kishor Das.png",
        paragraphs: portfolio.about.paragraphs || [],
        timeline_link_text: portfolio.about.timeline_link_text || "View my timeline to learn more about my unique journey",
        contact_button_text: portfolio.about.contact_button_text || "Get in Touch",
      });
    }
  }, [portfolio]);

  const handleParagraphChange = (index, value) => {
    const updated = [...formData.paragraphs];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, paragraphs: updated }));
  };

  const handleAddParagraph = () => {
    setFormData((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  };

  const handleRemoveParagraph = (index) => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, profile_image: res.url }));
        setAlert({ type: "success", text: "Profile image uploaded successfully!" });
      }
    } catch (err) {
      setAlert({ type: "error", text: "Upload failed: " + err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    try {
      const res = await api.updateAbout(formData);
      if (res && res.success) {
        setAlert({ type: "success", text: "About Me sector updated successfully in PostgreSQL!" });
        refreshPortfolio();
      }
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
          <h3 className="admin-card-title">About Me Sector</h3>
          <div className="admin-card-subtitle">
            Manage your biography paragraphs, personal photo, and call-to-actions.
          </div>
        </div>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.text}</span>
          <button
            onClick={() => setAlert(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 20 }}>
          {/* Profile Photo preview & upload */}
          <div>
            <label className="admin-label">Profile Image</label>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 12,
                overflow: "hidden",
                border: "2px solid rgba(100, 217, 138, 0.3)",
                marginBottom: 12,
                background: "#161b26",
              }}
            >
              <img
                src={formData.profile_image}
                alt="Profile Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <label className="admin-btn admin-btn-secondary admin-btn-sm" style={{ cursor: "pointer", display: "inline-flex" }}>
              <VscCloudUpload /> {uploading ? "Uploading..." : "Upload Photo"}
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            </label>
            <input
              type="text"
              className="admin-input"
              value={formData.profile_image}
              onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
              placeholder="/assets/Aranya Kishor Das.png"
              style={{ marginTop: 8, fontSize: "0.82rem" }}
            />
          </div>

          <div>
            <div className="admin-form-group">
              <label className="admin-label">Section Heading</label>
              <input
                type="text"
                className="admin-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="About Me"
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Timeline Link CTA Text</label>
              <input
                type="text"
                className="admin-input"
                value={formData.timeline_link_text}
                onChange={(e) => setFormData({ ...formData, timeline_link_text: e.target.value })}
                placeholder="View my timeline to learn more about my unique journey"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Contact Button Text</label>
              <input
                type="text"
                className="admin-input"
                value={formData.contact_button_text}
                onChange={(e) => setFormData({ ...formData, contact_button_text: e.target.value })}
                placeholder="Get in Touch"
              />
            </div>
          </div>
        </div>

        {/* Bio Paragraphs List */}
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <label className="admin-label" style={{ margin: 0 }}>
              Biography Paragraphs ({formData.paragraphs.length})
            </label>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAddParagraph}>
              <VscAdd /> Add Paragraph
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {formData.paragraphs.map((para, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  background: "rgba(255, 255, 255, 0.02)",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <span style={{ fontSize: "0.85rem", color: "#8b949e", fontWeight: "bold", paddingTop: 8 }}>
                  #{idx + 1}
                </span>
                <textarea
                  className="admin-textarea"
                  value={para}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  rows={3}
                  placeholder={`Paragraph ${idx + 1} content... (HTML tags like <span class="highlight">text</span> supported)`}
                  style={{ flexGrow: 1 }}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={() => handleRemoveParagraph(idx)}
                  title="Remove Paragraph"
                  style={{ marginTop: 6 }}
                >
                  <VscTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <VscSave /> {saving ? "Saving changes..." : "Save About Sector"}
          </button>
        </div>
      </form>
    </div>
  );
}
