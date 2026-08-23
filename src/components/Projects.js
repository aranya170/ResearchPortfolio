import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import ProjectList from "./ProjectList";
import "../styles/Projects.css";
import { usePortfolio } from "../context/PortfolioContext";
import { getAssetUrl } from "../services/api";
import {
  FiGithub,
  FiExternalLink,
  FiFileText,
  FiDatabase,
  FiX,
  FiLayers,
  FiCpu,
  FiCode,
  FiBarChart2,
  FiArrowUpRight,
  FiPlay,
  FiImage,
  FiVideo,
} from "react-icons/fi";

const CATEGORIES = [
  { id: "All", label: "All Projects", icon: <FiLayers /> },
  { id: "Research", label: "Research & AI", icon: <FiFileText /> },
  { id: "Hardware", label: "Hardware & Robotics", icon: <FiCpu /> },
  { id: "Software", label: "Software & Systems", icon: <FiCode /> },
  { id: "SQL", label: "Data & SQL", icon: <FiBarChart2 /> },
];

const isEmbedVideo = (url) => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");
};

const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("vimeo.com/")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${id}`;
  }
  return url;
};

export default function Projects() {
  const { portfolio } = usePortfolio();
  const rawProjects =
    portfolio && portfolio.projects && Object.keys(portfolio.projects).length > 0
      ? portfolio.projects
      : ProjectList;

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalMediaTab, setModalMediaTab] = useState("video");

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  // Read video URL directly from database / project data
  const getVideoUrl = (proj) => {
    if (!proj) return null;
    const v = proj.video || proj.video_url;
    if (v && typeof v === "string" && v.trim()) {
      return v.trim();
    }
    return null;
  };

  // Flatten all projects into categorized list
  const allProjects = [];
  if (Array.isArray(rawProjects)) {
    rawProjects.forEach((proj) => {
      allProjects.push({
        ...proj,
        category: proj.category || "Software",
      });
    });
  } else if (rawProjects && typeof rawProjects === "object") {
    Object.keys(rawProjects).forEach((cat) => {
      (rawProjects[cat] || []).forEach((proj) => {
        allProjects.push({
          ...proj,
          category: proj.category || cat,
        });
      });
    });
  }

  const filteredProjects =
    activeCategory === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory);

  const getInfoContent = (proj) => {
    if (!proj || !proj.files) return "";
    const info = proj.files.find((f) => f && f.type === "info");
    return info ? info.content : (proj.files[0]?.content || "");
  };

  const getNotebookUrl = (proj) => {
    if (!proj || !proj.files) return null;
    const nb = proj.files.find((f) => f && f.type === "notebook");
    return nb ? nb.content : null;
  };

  const handleOpenProject = (proj) => {
    setSelectedProject(proj);
    const videoUrl = getVideoUrl(proj);
    if (videoUrl) {
      setModalMediaTab("video");
    } else {
      setModalMediaTab("image");
    }
  };

  const currentVideoUrl = selectedProject ? getVideoUrl(selectedProject) : null;
  const hasCurrentVideo = Boolean(currentVideoUrl);

  return (
    <section id="projects" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Portfolio Showcase</div>
          <h2 className="section-heading">Featured Works & Systems</h2>
        </div>
        <span className="section-count-badge">
          {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {/* Category Tabs */}
      <div className="filter-bar">
        {CATEGORIES.map((cat) => {
          const count =
            cat.id === "All"
              ? allProjects.length
              : allProjects.filter((p) => p.category === cat.id).length;

          if (count === 0 && cat.id !== "All") return null;

          return (
            <button
              key={cat.id}
              className={`filter-btn ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
            >
              <span className="filter-icon">{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((proj, idx) => {
          const info = getInfoContent(proj);
          const notebook = getNotebookUrl(proj);
          const projectVideo = getVideoUrl(proj);
          const hasVideo = Boolean(projectVideo);

          return (
            <article key={proj.id || `${proj.name}-${idx}`} className="p-card">
              {/* Media Thumbnail */}
              {proj.image ? (
                <div
                  className="p-media"
                  onClick={() => handleOpenProject(proj)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={getAssetUrl(proj.image)}
                    alt={proj.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.parentElement.style.display = "none";
                    }}
                  />
                  <span className={`p-badge p-badge-${(proj.category || "software").toLowerCase()}`}>
                    {proj.category}
                  </span>

                  {hasVideo && (
                    <span className="p-video-pill">
                      <FiPlay /> Video Demo
                    </span>
                  )}
                </div>
              ) : (
                hasVideo && (
                  <div
                    className="p-media p-media-placeholder"
                    onClick={() => handleOpenProject(proj)}
                    role="button"
                    tabIndex={0}
                  >
                    <span className={`p-badge p-badge-${(proj.category || "software").toLowerCase()}`}>
                      {proj.category}
                    </span>
                    <span className="p-video-pill">
                      <FiPlay /> Video Demo
                    </span>
                  </div>
                )
              )}

              {/* Card Main Info */}
              <div className="p-content">
                {!proj.image && (
                  <span className={`p-badge p-badge-${(proj.category || "software").toLowerCase()}`}>
                    {proj.category}
                  </span>
                )}

                <h3 className="p-title" onClick={() => handleOpenProject(proj)}>
                  {proj.name}
                </h3>

                <p className="p-desc">
                  {info.length > 150 ? `${info.substring(0, 150)}...` : info}
                </p>

                {/* Tech Tags */}
                {proj.tags && proj.tags.length > 0 && (
                  <div className="p-tags">
                    {proj.tags.slice(0, 4).map((tag, tIdx) => (
                      <span key={tIdx} className="p-tag-pill">
                        {tag}
                      </span>
                    ))}
                    {proj.tags.length > 4 && (
                      <span className="p-tag-more">+{proj.tags.length - 4}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="p-actions">
                <button
                  className="p-btn-details"
                  onClick={() => handleOpenProject(proj)}
                  type="button"
                >
                  Overview {hasVideo ? <FiVideo /> : <FiArrowUpRight />}
                </button>

                <div className="p-links-row">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-btn"
                      title="Source Code (GitHub)"
                      aria-label="Source Code"
                    >
                      <FiGithub />
                    </a>
                  )}
                  {proj.website && (
                    <a
                      href={proj.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-btn"
                      title="Live Demo"
                      aria-label="Live Demo"
                    >
                      <FiExternalLink />
                    </a>
                  )}
                  {notebook && (
                    <a
                      href={notebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-btn"
                      title="Research Notebook / Paper"
                      aria-label="Research Notebook"
                    >
                      <FiFileText />
                    </a>
                  )}
                  {proj.dataset && (
                    <a
                      href={proj.dataset}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-btn"
                      title="Dataset"
                      aria-label="Dataset"
                    >
                      <FiDatabase />
                    </a>
                  )}
                  {proj.medium && (
                    <a
                      href={proj.medium}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-btn"
                      title="Technical Article"
                      aria-label="Technical Article"
                    >
                      <FiLayers />
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Clean Technical Specs & Video Player Modal */}
      {selectedProject && typeof document !== "undefined" && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className={`modal-badge p-badge-${(selectedProject.category || "software").toLowerCase()}`}>
                  {selectedProject.category}
                </span>
                <h3 className="modal-heading">{selectedProject.name}</h3>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedProject(null)}
                type="button"
                aria-label="Close modal"
              >
                <FiX />
              </button>
            </div>

            <div className="modal-content">
              {/* Media Display Area (Video or Photo) */}
              {(hasCurrentVideo || selectedProject.image) && (
                <div className="modal-media-showcase">
                  {/* Media Switcher Tabs if both video and image exist */}
                  {hasCurrentVideo && selectedProject.image && (
                    <div className="modal-media-switcher">
                      <button
                        type="button"
                        className={`modal-media-tab ${modalMediaTab === "video" ? "active" : ""}`}
                        onClick={() => setModalMediaTab("video")}
                      >
                        <FiPlay /> Watch Project Video
                      </button>
                      <button
                        type="button"
                        className={`modal-media-tab ${modalMediaTab === "image" ? "active" : ""}`}
                        onClick={() => setModalMediaTab("image")}
                      >
                        <FiImage /> Photo Showcase
                      </button>
                    </div>
                  )}

                  {/* Video View */}
                  {modalMediaTab === "video" && hasCurrentVideo ? (
                    <div className="modal-video-container">
                      {isEmbedVideo(currentVideoUrl) ? (
                        <iframe
                          src={getEmbedUrl(currentVideoUrl)}
                          title={`${selectedProject.name} Demo Video`}
                          className="modal-video-iframe"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={getAssetUrl(currentVideoUrl)}
                          controls
                          className="modal-video-player"
                          playsInline
                        />
                      )}
                    </div>
                  ) : selectedProject.image ? (
                    /* Image View */
                    <div className="modal-banner">
                      <img src={getAssetUrl(selectedProject.image)} alt={selectedProject.name} />
                    </div>
                  ) : null}
                </div>
              )}

              {/* Description */}
              <div className="modal-block">
                <div className="modal-block-label">Project Description & Overview</div>
                <p className="modal-text">{getInfoContent(selectedProject)}</p>
              </div>

              {/* Tags */}
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="modal-block">
                  <div className="modal-block-label">Technologies & Stack</div>
                  <div className="modal-pills">
                    {selectedProject.tags.map((t, idx) => (
                      <span key={idx} className="modal-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attached Code Files & Documentation */}
              {selectedProject.files && selectedProject.files.length > 0 && (
                <div className="modal-block">
                  <div className="modal-block-label">Attached Repository Files & Notebooks</div>
                  <div className="modal-files">
                    {selectedProject.files.map((file, idx) => (
                      <div key={idx} className="file-item-row">
                        <span className="file-item-title">{file.name}</span>
                        <span className="file-item-type">({file.type})</span>
                        {file.type === "notebook" && (
                          <a
                            href={file.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-item-link"
                          >
                            Open Notebook <FiExternalLink />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Links */}
            <div className="modal-foot">
              <div className="modal-foot-links">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-action-btn modal-action-primary"
                  >
                    <FiGithub /> GitHub Repository
                  </a>
                )}
                {selectedProject.website && (
                  <a
                    href={selectedProject.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-action-btn modal-action-secondary"
                  >
                    <FiExternalLink /> Live Website
                  </a>
                )}
              </div>
              <button
                className="modal-action-btn modal-action-dismiss"
                onClick={() => setSelectedProject(null)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}