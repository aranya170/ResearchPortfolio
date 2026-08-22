import React, { useState, useEffect } from "react";
import { api, getAssetUrl } from "../../services/api";
import { usePortfolio } from "../../context/PortfolioContext";
import { VscSave, VscCloudUpload, VscAdd, VscTrash } from "react-icons/vsc";

const defaultParagraphs = [
  "I am an AI researcher and roboticist focused on bridging the gap between theoretical deep learning models and practical embedded hardware. My path began with microcontrollers and RC robotics in 2015, evolving into active research on deep neural architectures, adaptive ensemble modeling, and parallel robotic manipulation.",
  "Currently serving as Undergraduate Research Assistant under Dr. Mohammad Nurul Huda and President of UIU Robotics Club, I led national-level open-source initiatives like RoboNeT while mentoring 50+ undergraduate engineering students in neural network optimization and embedded systems design.",
];

const defaultPillars = [
  {
    id: 1,
    title: "Robotics & Kinematics",
    description: "Parallel Delta geometry, 4-axis SCARA kinematics, trajectory planning, and motor synchronization.",
    icon: "cpu",
  },
  {
    id: 2,
    title: "Deep Learning & AI",
    description: "Adaptive ensemble learning, psychometric classification models, and computer vision pipelines.",
    icon: "ai",
  },
  {
    id: 3,
    title: "Open Research & Mentorship",
    description: "Creator of RoboNeT (open-source robotics learning repository); Teaching Assistant for IoT & Robotics.",
    icon: "book",
  },
  {
    id: 4,
    title: "Global Recognition",
    description: "19 university admission offers across USA & Switzerland; executive leadership across 100+ members.",
    icon: "award",
  },
];

export default function AboutSector() {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const [formData, setFormData] = useState({
    title: "Academic Profile & Focus",
    profile_image: "/assets/Aranya Kishor Das.png",
    name: "Aranya Kishor Das",
    role: "Undergraduate Researcher & Club President",
    affiliation: "United International University",
    core_focus: "Deep Learning, Autonomous Robotics, Kinematics",
    location: "Dhaka, Bangladesh",
    paragraphs: defaultParagraphs,
    pillars: defaultPillars,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (portfolio && portfolio.about) {
      const a = portfolio.about;

      let paras = a.paragraphs;
      if (typeof paras === "string") {
        try { paras = JSON.parse(paras); } catch { paras = [paras]; }
      }
      if (!Array.isArray(paras) || paras.length === 0) paras = defaultParagraphs;

      let pils = a.pillars;
      if (typeof pils === "string") {
        try { pils = JSON.parse(pils); } catch { pils = defaultPillars; }
      }
      if (!Array.isArray(pils) || pils.length === 0) pils = defaultPillars;

      setFormData({
        title: a.title || "Academic Profile & Focus",
        profile_image: a.profile_image || "/assets/Aranya Kishor Das.png",
        name: a.name || "Aranya Kishor Das",
        role: a.role || "Undergraduate Researcher & Club President",
        affiliation: a.affiliation || "United International University",
        core_focus: a.core_focus || "Deep Learning, Autonomous Robotics, Kinematics",
        location: a.location || "Dhaka, Bangladesh",
        paragraphs: paras,
        pillars: pils,
      });
    }
  }, [portfolio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Paragraph Handlers
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

  // Pillar Handlers
  const handlePillarChange = (index, field, value) => {
    const updated = [...formData.pillars];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, pillars: updated }));
  };

  const handleAddPillar = () => {
    setFormData((prev) => ({
      ...prev,
      pillars: [
        ...prev.pillars,
        {
          id: Date.now(),
          title: "New Research Focus",
          description: "Description of the research area or engineering domain.",
          icon: "cpu",
        },
      ],
    }));
  };

  const handleRemovePillar = (index) => {
    setFormData((prev) => ({
      ...prev,
      pillars: prev.pillars.filter((_, i) => i !== index),
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
        setAlert({ type: "success", text: "About Me sector updated successfully!" });
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
            Manage your biography narrative, research pillars, dossier information, and portrait photo.
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
        {/* Section Heading */}
        <div className="admin-form-group">
          <label className="admin-label">Section Heading</label>
          <input
            type="text"
            name="title"
            className="admin-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Academic Profile & Focus"
          />
        </div>

        {/* Dossier Card Configuration */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 8, padding: 18, marginBottom: 24 }}>
          <h4 style={{ margin: "0 0 14px 0", fontSize: 14, color: "#2D6A4F", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Left Dossier Card Info
          </h4>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-label">Display Name</label>
              <input
                type="text"
                name="name"
                className="admin-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aranya Kishor Das"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Role / Subtitle</label>
              <input
                type="text"
                name="role"
                className="admin-input"
                value={formData.role}
                onChange={handleChange}
                placeholder="Undergraduate Researcher & Club President"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div className="admin-form-group">
              <label className="admin-label">Affiliation</label>
              <input
                type="text"
                name="affiliation"
                className="admin-input"
                value={formData.affiliation}
                onChange={handleChange}
                placeholder="United International University"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Core Focus</label>
              <input
                type="text"
                name="core_focus"
                className="admin-input"
                value={formData.core_focus}
                onChange={handleChange}
                placeholder="Deep Learning, Autonomous Robotics, Kinematics"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Location</label>
              <input
                type="text"
                name="location"
                className="admin-input"
                value={formData.location}
                onChange={handleChange}
                placeholder="Dhaka, Bangladesh"
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label className="admin-label">Profile Image</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                type="text"
                name="profile_image"
                className="admin-input"
                value={formData.profile_image}
                onChange={handleChange}
                placeholder="/assets/Aranya Kishor Das.png"
              />
              <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                <VscCloudUpload /> {uploading ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
            </div>
            {formData.profile_image && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={getAssetUrl(formData.profile_image)}
                  alt="Preview"
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Biography Paragraphs */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <label className="admin-label" style={{ margin: 0, fontSize: 13.5, fontWeight: 700 }}>
              Biography Paragraphs
            </label>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleAddParagraph}
              style={{ padding: "4px 10px", fontSize: 12 }}
            >
              <VscAdd /> Add Paragraph
            </button>
          </div>

          {formData.paragraphs.map((para, idx) => (
            <div key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
              <span style={{ fontSize: 12, color: "#8B8680", marginTop: 10, minWidth: 20 }}>
                #{idx + 1}
              </span>
              <textarea
                className="admin-textarea"
                value={para}
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                rows={3}
                placeholder={`Paragraph ${idx + 1} text...`}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                onClick={() => handleRemoveParagraph(idx)}
                style={{ padding: "8px 10px", marginTop: 2 }}
                title="Remove paragraph"
              >
                <VscTrash />
              </button>
            </div>
          ))}
        </div>

        {/* 4 Research Pillars / Focus Cards */}
        <div style={{ marginBottom: 28, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <label className="admin-label" style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                Research Pillars & Focus Cards
              </label>
              <div style={{ fontSize: 12, color: "#8B8680" }}>
                Edit the 4 cards displayed on the right side of the About section.
              </div>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleAddPillar}
              style={{ padding: "5px 12px", fontSize: 12 }}
            >
              <VscAdd /> Add Pillar Card
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 16 }}>
            {formData.pillars.map((pillar, pIdx) => (
              <div
                key={pillar.id || pIdx}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2D6A4F" }}>
                    Card #{pIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePillar(pIdx)}
                    style={{ background: "none", border: "none", color: "#e63946", cursor: "pointer", fontSize: 14 }}
                    title="Remove Pillar"
                  >
                    <VscTrash />
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, color: "#8B8680", display: "block", marginBottom: 4 }}>
                    Title
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={pillar.title}
                    onChange={(e) => handlePillarChange(pIdx, "title", e.target.value)}
                    placeholder="e.g. Robotics & Kinematics"
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, color: "#8B8680", display: "block", marginBottom: 4 }}>
                    Icon Type
                  </label>
                  <select
                    className="admin-input"
                    value={pillar.icon || "cpu"}
                    onChange={(e) => handlePillarChange(pIdx, "icon", e.target.value)}
                    style={{ padding: "7px 10px" }}
                  >
                    <option value="cpu">CPU / Hardware (FiCpu)</option>
                    <option value="ai">AI / Deep Learning (FiTrendingUp)</option>
                    <option value="book">Open Research / Repository (FiBookOpen)</option>
                    <option value="award">Global Recognition / Leadership (FiAward)</option>
                    <option value="code">Software / Code (FiCode)</option>
                    <option value="data">Data / SQL (FiDatabase)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, color: "#8B8680", display: "block", marginBottom: 4 }}>
                    Description
                  </label>
                  <textarea
                    className="admin-textarea"
                    value={pillar.description}
                    onChange={(e) => handlePillarChange(pIdx, "description", e.target.value)}
                    rows={2}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          disabled={saving}
          style={{ width: "100%", justifyContent: "center", padding: "12px 20px" }}
        >
          <VscSave /> {saving ? "Saving Changes..." : "Save About Sector to Database"}
        </button>
      </form>
    </div>
  );
}
