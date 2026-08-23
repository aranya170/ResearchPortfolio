import React, { useState, useEffect, useRef } from "react";
import { api, getAssetUrl } from "../../services/api";
import { usePortfolio } from "../../context/PortfolioContext";
import { VscSave, VscCloudUpload, VscCheck, VscFilePdf } from "react-icons/vsc";

export default function IntroSector() {
  const { portfolio, refreshPortfolio } = usePortfolio();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    greeting: "Hi there! I'm ",
    name: "Aranya Kishor Das",
    subtitle: "AI Researcher & Robotics Enthusiast",
    subtitle_suffix: "dedicated to Intelligent Systems.",
    description: "From building RC cars in highschool to leading UIU Robotics and researching AI...",
    cv_url: "/assets/My_CV.pdf",
    show_robot: true,
    show_stars: true,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (portfolio && portfolio.siteProfile) {
      setFormData({
        greeting: portfolio.siteProfile.greeting || "Hi there! I'm ",
        name: portfolio.siteProfile.name || "Aranya Kishor Das",
        subtitle: portfolio.siteProfile.subtitle || "AI Researcher & Robotics Enthusiast",
        subtitle_suffix: portfolio.siteProfile.subtitle_suffix || "dedicated to Intelligent Systems.",
        description: portfolio.siteProfile.description || "",
        cv_url: portfolio.siteProfile.cv_url || "/assets/My_CV.pdf",
        show_robot: portfolio.siteProfile.show_robot !== false,
        show_stars: portfolio.siteProfile.show_stars !== false,
      });
    }
  }, [portfolio]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setAlert(null);
      const res = await api.uploadFile(file);
      if (res && (res.url || (res.file && res.file.url))) {
        const uploadedUrl = res.url || res.file.url;
        const updated = { ...formData, cv_url: uploadedUrl };
        setFormData(updated);

        // Auto-save immediately to database
        await api.updateIntro(updated);
        refreshPortfolio();
        setAlert({
          type: "success",
          text: `CV uploaded and saved to database successfully (${file.name})!`,
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
      const res = await api.updateIntro(formData);
      if (res && res.success) {
        setAlert({ type: "success", text: "Hero & Intro sector saved successfully to PostgreSQL!" });
        refreshPortfolio();
      }
    } catch (err) {
      setAlert({ type: "error", text: "Failed to save: " + err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCvPreview = () => {
    if (!formData.cv_url) return;
    const targetUrl = getAssetUrl(formData.cv_url);
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <div>
          <h3 className="admin-card-title">Hero & Intro Sector</h3>
          <div className="admin-card-subtitle">
            Configure the opening greeting, animated title, personal tagline, and CV document.
          </div>
        </div>
      </div>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          <span>{alert.text}</span>
          <button
            type="button"
            onClick={() => setAlert(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
          <div className="admin-form-group">
            <label className="admin-label">Greeting Text</label>
            <input
              type="text"
              name="greeting"
              className="admin-input"
              value={formData.greeting}
              onChange={handleChange}
              placeholder="Hi there! I'm "
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Display Name (Animated Title)</label>
            <input
              type="text"
              name="name"
              className="admin-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="Aranya Kishor Das"
              required
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="admin-form-group">
            <label className="admin-label">Subtitle (Role Highlight)</label>
            <input
              type="text"
              name="subtitle"
              className="admin-input"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="AI Researcher & Robotics Enthusiast"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Subtitle Suffix</label>
            <input
              type="text"
              name="subtitle_suffix"
              className="admin-input"
              value={formData.subtitle_suffix}
              onChange={handleChange}
              placeholder="dedicated to Intelligent Systems."
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Hero Bio / Short Summary</label>
          <textarea
            name="description"
            className="admin-textarea"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="From building RC cars in highschool to leading UIU Robotics..."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Curriculum Vitae (CV / Resume)</label>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              name="cv_url"
              className="admin-input"
              value={formData.cv_url}
              onChange={handleChange}
              placeholder="/assets/My_CV.pdf"
              style={{ flex: 1, minWidth: 260 }}
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleCvUpload}
              style={{ display: "none" }}
            />

            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              disabled={uploading}
              style={{ cursor: "pointer", whiteSpace: "nowrap" }}
            >
              <VscCloudUpload /> {uploading ? "Uploading PDF..." : "Upload New PDF"}
            </button>

            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={handleOpenCvPreview}
              style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              title="Open current CV in a new tab"
            >
              <VscFilePdf /> Preview CV ↗
            </button>
          </div>

          <div className="admin-helper" style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <span>Quick Select Asset:</span>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, cv_url: "/assets/My_CV.pdf" }))}
              style={{
                background: "none",
                border: "1px solid #30363d",
                color: "#58a6ff",
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              /assets/My_CV.pdf
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, cv_url: "/assets/resume.pdf" }))}
              style={{
                background: "none",
                border: "1px solid #30363d",
                color: "#58a6ff",
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              /assets/resume.pdf
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, margin: "24px 0", flexWrap: "wrap" }}>
          <label className="admin-switch">
            <input
              type="checkbox"
              name="show_robot"
              checked={formData.show_robot}
              onChange={handleChange}
            />
            <div className="admin-switch-track">
              <div className="admin-switch-thumb"></div>
            </div>
            <span style={{ fontSize: "0.9rem" }}>Enable Interactive 3D Robot Animation</span>
          </label>

          <label className="admin-switch">
            <input
              type="checkbox"
              name="show_stars"
              checked={formData.show_stars}
              onChange={handleChange}
            />
            <div className="admin-switch-track">
              <div className="admin-switch-thumb"></div>
            </div>
            <span style={{ fontSize: "0.9rem" }}>Enable Dynamic Three.js Starfield Background</span>
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            <VscSave /> {saving ? "Saving changes..." : "Save Intro Sector"}
          </button>
        </div>
      </form>
    </div>
  );
}
