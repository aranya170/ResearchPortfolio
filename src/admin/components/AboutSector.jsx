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
  const fileInputRef = React.useRef(null);
  const [formData, setFormData] = useState({
    title: "About Me",
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
        title: a.title || "About Me",
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
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setAlert(null);
      const res = await api.uploadFile(file);
      const uploadedUrl = res?.url || res?.file?.url;
      if (uploadedUrl) {
        const updated = { ...formData, profile_image: uploadedUrl };
        setFormData(updated);
        // Auto-save immediately to database
        await api.updateAbout(updated);
        refreshPortfolio();
        setAlert({
          type: "success",
          text: `Profile image uploaded and saved to database successfully (${file.name})!`,
        });
      }
    } catch (err) {
      setAlert({ type: "error", text: "Upload failed: " + err.message });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
          <button type="button" className="admin-alert-close" onClick={() => setAlert(null)} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Section Heading */}
        <div className="admin-form-group">
          <label className="admin-label" htmlFor="about-field-1">Section Heading</label>
          <input id="about-field-1"
            type="text"
            name="title"
            className="admin-input"
            value={formData.title}
            onChange={handleChange}
            placeholder="Academic Profile & Focus"
          />
        </div>

        {/* Dossier Card Configuration */}
        <div className="admin-panel">
          <h4 className="admin-panel-title">Left Dossier Card Info</h4>

          <div className="admin-grid admin-grid-2">
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="about-field-2">Display Name</label>
              <input id="about-field-2"
                type="text"
                name="name"
                className="admin-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aranya Kishor Das"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="about-field-3">Role / Subtitle</label>
              <input id="about-field-3"
                type="text"
                name="role"
                className="admin-input"
                value={formData.role}
                onChange={handleChange}
                placeholder="Undergraduate Researcher & Club President"
              />
            </div>
          </div>

          <div className="admin-grid admin-grid-3">
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="about-field-4">Affiliation</label>
              <input id="about-field-4"
                type="text"
                name="affiliation"
                className="admin-input"
                value={formData.affiliation}
                onChange={handleChange}
                placeholder="United International University"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="about-field-5">Core Focus</label>
              <input id="about-field-5"
                type="text"
                name="core_focus"
                className="admin-input"
                value={formData.core_focus}
                onChange={handleChange}
                placeholder="Deep Learning, Autonomous Robotics, Kinematics"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="about-field-6">Location</label>
              <input id="about-field-6"
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
            <label className="admin-label" htmlFor="about-field-7">Profile Image URL or Upload</label>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input id="about-field-7"
                type="text"
                name="profile_image"
                style={{ flex: 1, minWidth: 200 }}
                className="admin-input"
                value={formData.profile_image}
                onChange={handleChange}
                placeholder="/assets/Aranya Kishor Das.png or /uploads/..."
              />
              <label className="admin-btn admin-btn-secondary" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                <VscCloudUpload /> {uploading ? "Uploading..." : "Upload Photo"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            {formData.profile_image && (
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14, background: "rgba(0,0,0,0.2)", padding: 10, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                <img
                  src={getAssetUrl(formData.profile_image)}
                  alt="Profile Preview"
                  onError={(e) => {
                    e.target.style.opacity = "0.3";
                  }}
                  style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid var(--admin-accent)" }}
                />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    Active Profile Picture
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#8b949e", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {formData.profile_image}
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => {
                    const updated = { ...formData, profile_image: "/assets/Aranya Kishor Das.png" };
                    setFormData(updated);
                    api
                      .updateAbout(updated)
                      .then(() => refreshPortfolio())
                      .catch((err) => setAlert({ type: "error", text: "Failed to reset image: " + err.message }));
                  }}
                >
                  Reset Default
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Biography Paragraphs */}
        <div style={{ marginBottom: 28 }}>
          <div className="admin-section-head">
            <label className="admin-label">Biography Paragraphs</label>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAddParagraph}>
              <VscAdd /> Add Paragraph
            </button>
          </div>

          {formData.paragraphs.map((para, idx) => (
            <div key={idx} className="admin-repeat-row">
              <span className="admin-repeat-index">#{idx + 1}</span>
              <textarea
                className="admin-textarea"
                value={para}
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                rows={3}
                placeholder={`Paragraph ${idx + 1} text...`}
              />
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => handleRemoveParagraph(idx)}
                style={{ marginTop: 6 }}
                title="Remove paragraph"
                aria-label={`Remove paragraph ${idx + 1}`}
              >
                <VscTrash />
              </button>
            </div>
          ))}
        </div>

        {/* 4 Research Pillars / Focus Cards */}
        <div style={{ marginBottom: 28, borderTop: "1px solid var(--admin-card-border)", paddingTop: 20 }}>
          <div className="admin-section-head">
            <div>
              <label className="admin-label">Research Pillars & Focus Cards</label>
              <div className="admin-helper">Edit the 4 cards displayed on the right side of the About section.</div>
            </div>
            <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={handleAddPillar}>
              <VscAdd /> Add Pillar Card
            </button>
          </div>

          <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))" }}>
            {formData.pillars.map((pillar, pIdx) => (
              <div
                key={pillar.id || pIdx}
                className="admin-panel"
                style={{ marginBottom: 0, display: "flex", flexDirection: "column", gap: 10 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="admin-panel-title" style={{ margin: 0 }}>
                    Card #{pIdx + 1}
                  </span>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger admin-btn-sm"
                    onClick={() => handleRemovePillar(pIdx)}
                    title="Remove Pillar"
                    aria-label={`Remove card ${pIdx + 1}`}
                  >
                    <VscTrash />
                  </button>
                </div>

                <div>
                  <label className="admin-label" htmlFor="about-field-8">
                    Title
                  </label>
                  <input id="about-field-8"
                    type="text"
                    className="admin-input"
                    value={pillar.title}
                    onChange={(e) => handlePillarChange(pIdx, "title", e.target.value)}
                    placeholder="e.g. Robotics & Kinematics"
                  />
                </div>

                <div>
                  <label className="admin-label" htmlFor="about-field-9">
                    Icon Type
                  </label>
                  <select id="about-field-9"
                    className="admin-select"
                    value={pillar.icon || "cpu"}
                    onChange={(e) => handlePillarChange(pIdx, "icon", e.target.value)}
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
                  <label className="admin-label" htmlFor="about-field-10">
                    Description
                  </label>
                  <textarea id="about-field-10"
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

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <VscSave /> {saving ? "Saving changes..." : "Save About Sector"}
          </button>
        </div>
      </form>
    </div>
  );
}
