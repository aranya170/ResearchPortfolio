import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import ReactDOM from "react-dom";
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

const CATEGORY_META = {
  Research: { label: "Research & AI", icon: <FiFileText /> },
  Hardware: { label: "Hardware & Robotics", icon: <FiCpu /> },
  Software: { label: "Software & Systems", icon: <FiCode /> },
  SQL: { label: "Data & SQL", icon: <FiBarChart2 /> },
};

const categoryLabel = (cat) => CATEGORY_META[cat]?.label || cat;
const badgeClass = (cat) => `p-badge p-badge-${(cat || "software").toLowerCase()}`;

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

// Bundled videos ship with a "<name>.poster.jpg" still next to them
const getPosterUrl = (videoUrl) =>
  videoUrl && videoUrl.startsWith("/assets/") ? getAssetUrl(videoUrl.replace(/\.mp4$/i, ".poster.jpg")) : undefined;

const getVideoUrl = (proj) => {
  const v = proj && (proj.video || proj.video_url);
  return v && typeof v === "string" && v.trim() ? v.trim() : null;
};

const getInfoContent = (proj) => {
  if (!proj || !proj.files) return "";
  const info = proj.files.find((f) => f && f.type === "info");
  return info ? info.content : proj.files[0]?.content || "";
};

const getNotebookUrl = (proj) => {
  if (!proj || !proj.files) return null;
  const nb = proj.files.find((f) => f && f.type === "notebook");
  return nb ? nb.content : null;
};

const truncate = (text, max) => (text.length > max ? `${text.substring(0, max).trimEnd()}…` : text);

function ProjectLinks({ proj }) {
  const notebook = getNotebookUrl(proj);
  const links = [
    proj.github && { href: proj.github, label: "Source code on GitHub", icon: <FiGithub /> },
    proj.website && { href: proj.website, label: "Live demo", icon: <FiExternalLink /> },
    notebook && { href: notebook, label: "Research notebook or paper", icon: <FiFileText /> },
    proj.dataset && { href: proj.dataset, label: "Dataset", icon: <FiDatabase /> },
    proj.medium && { href: proj.medium, label: "Technical article", icon: <FiLayers /> },
  ].filter(Boolean);

  return (
    <div className="p-links-row">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-icon-btn"
          title={l.label}
          aria-label={`${l.label}: ${proj.name}`}
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}

function ProjectMedia({ proj, onOpen, className = "" }) {
  const hasVideo = Boolean(getVideoUrl(proj));
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = proj.image && !imageFailed;

  return (
    <button
      type="button"
      className={`p-media ${showImage ? "" : "p-media-placeholder"} ${className}`}
      onClick={onOpen}
    >
      <span className="visually-hidden">Open details for {proj.name}: </span>
      {showImage ? (
        <img src={getAssetUrl(proj.image)} alt={proj.name} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />
      ) : (
        // Every card gets a media block so cards line up even without an image
        <span className="p-media-fallback-icon" aria-hidden="true">
          {CATEGORY_META[proj.category]?.icon || <FiCode />}
        </span>
      )}
      <span className={badgeClass(proj.category)}>{proj.category}</span>
      {hasVideo && (
        <span className="p-video-pill">
          <FiPlay aria-hidden="true" /> Video Demo
        </span>
      )}
    </button>
  );
}

function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const videoUrl = getVideoUrl(project);
  const [mediaTab, setMediaTab] = useState(videoUrl ? "video" : "image");

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector(".modal-close")?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Keep keyboard focus inside the dialog
      const focusable = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), video, iframe, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span className={`modal-badge p-badge-${(project.category || "software").toLowerCase()}`}>
              {project.category}
            </span>
            <h3 className="modal-heading" id="project-modal-title">
              {project.name}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Close project details">
            <FiX />
          </button>
        </div>

        <div className="modal-content">
          {(videoUrl || project.image) && (
            <div className="modal-media-showcase">
              {videoUrl && project.image && (
                <div className="modal-media-switcher" role="group" aria-label="Media">
                  <button
                    type="button"
                    className={`modal-media-tab ${mediaTab === "video" ? "active" : ""}`}
                    aria-pressed={mediaTab === "video"}
                    onClick={() => setMediaTab("video")}
                  >
                    <FiPlay aria-hidden="true" /> Watch Project Video
                  </button>
                  <button
                    type="button"
                    className={`modal-media-tab ${mediaTab === "image" ? "active" : ""}`}
                    aria-pressed={mediaTab === "image"}
                    onClick={() => setMediaTab("image")}
                  >
                    <FiImage aria-hidden="true" /> Photo Showcase
                  </button>
                </div>
              )}

              {mediaTab === "video" && videoUrl ? (
                <div className="modal-video-container">
                  {isEmbedVideo(videoUrl) ? (
                    <iframe
                      src={getEmbedUrl(videoUrl)}
                      title={`${project.name} demo video`}
                      className="modal-video-iframe"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={getAssetUrl(videoUrl)}
                      poster={getPosterUrl(videoUrl)}
                      preload="metadata"
                      controls
                      className="modal-video-player"
                      playsInline
                    />
                  )}
                </div>
              ) : project.image ? (
                <div className="modal-banner">
                  <img src={getAssetUrl(project.image)} alt={project.name} />
                </div>
              ) : null}
            </div>
          )}

          <div className="modal-block">
            <div className="modal-block-label">Project Overview</div>
            <p className="modal-text">{getInfoContent(project)}</p>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="modal-block">
              <div className="modal-block-label">Technologies & Stack</div>
              <ul className="modal-pills">
                {project.tags.map((t) => (
                  <li key={t} className="modal-pill">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.files && project.files.some((f) => f.type === "notebook") && (
            <div className="modal-block">
              <div className="modal-block-label">Notebooks & Resources</div>
              <div className="modal-files">
                {project.files
                  .filter((f) => f.type === "notebook")
                  .map((file) => (
                    <div key={file.id || file.name} className="file-item-row">
                      <span className="file-item-title">{file.name}</span>
                      <a href={file.content} target="_blank" rel="noopener noreferrer" className="file-item-link">
                        Open <FiExternalLink aria-hidden="true" />
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-foot">
          <div className="modal-foot-links">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn modal-action-primary"
              >
                <FiGithub aria-hidden="true" /> GitHub Repository
              </a>
            )}
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-action-btn modal-action-secondary"
              >
                <FiExternalLink aria-hidden="true" /> Live Website
              </a>
            )}
          </div>
          <button className="modal-action-btn modal-action-dismiss" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Projects() {
  const { portfolio } = usePortfolio();
  const rawProjects = portfolio.projects;

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const closeModal = useCallback(() => setSelectedProject(null), []);

  // Other sections (e.g. the hero's quick navigation) can pre-select a category
  useEffect(() => {
    const onFilter = (e) => setActiveCategory(e.detail || "All");
    window.addEventListener("portfolio:filter-projects", onFilter);
    return () => window.removeEventListener("portfolio:filter-projects", onFilter);
  }, []);

  const allProjects = useMemo(() => {
    if (Array.isArray(rawProjects)) {
      return rawProjects.map((p) => ({ ...p, category: p.category || "Software" }));
    }
    return Object.keys(rawProjects || {}).flatMap((cat) =>
      (rawProjects[cat] || []).map((p) => ({ ...p, category: p.category || cat }))
    );
  }, [rawProjects]);

  // The top project of each category is presented as a featured case study
  const featured = useMemo(() => {
    const seen = new Set();
    return allProjects.filter((p) => {
      if (seen.has(p.category)) return false;
      seen.add(p.category);
      return true;
    });
  }, [allProjects]);

  const categories = useMemo(() => [...new Set(allProjects.map((p) => p.category))], [allProjects]);
  const filteredProjects =
    activeCategory === "All" ? allProjects : allProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="portfolio-section" aria-labelledby="projects-heading">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Portfolio Showcase</div>
          <h2 className="section-heading" id="projects-heading">
            Research, Robotics & Software Projects
          </h2>
        </div>
        <span className="section-count-badge">{allProjects.length} projects</span>
      </div>

      {/* Featured case studies */}
      <div className="featured-list">
        {featured.map((proj) => {
          const info = getInfoContent(proj);
          return (
            <article key={proj.id || proj.name} className="featured-card">
              <ProjectMedia proj={proj} onOpen={() => setSelectedProject(proj)} className="featured-media" />
              <div className="featured-body">
                <span className="featured-kicker">{categoryLabel(proj.category)}</span>
                <h3 className="featured-title">{proj.name}</h3>
                <p className="featured-desc">{truncate(info, 320)}</p>
                {proj.tags && proj.tags.length > 0 && (
                  <ul className="p-tags" aria-label="Technologies">
                    {proj.tags.slice(0, 5).map((tag) => (
                      <li key={tag} className="p-tag-pill">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="p-actions featured-actions">
                  <button className="p-btn-details" onClick={() => setSelectedProject(proj)} type="button">
                    Read case study <FiArrowUpRight aria-hidden="true" />
                  </button>
                  <ProjectLinks proj={proj} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* All projects, filterable */}
      <h3 className="projects-subheading">All projects</h3>
      <div className="filter-bar" role="group" aria-label="Filter projects by category">
        {["All", ...categories].map((cat) => {
          const count = cat === "All" ? allProjects.length : allProjects.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              type="button"
            >
              <span className="filter-icon" aria-hidden="true">
                {cat === "All" ? <FiLayers /> : CATEGORY_META[cat]?.icon || <FiCode />}
              </span>
              <span>{cat === "All" ? "All Projects" : categoryLabel(cat)}</span>
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="projects-grid">
        {filteredProjects.map((proj, idx) => {
          const info = getInfoContent(proj);
          const hasVideo = Boolean(getVideoUrl(proj));
          return (
            <article key={proj.id || `${proj.name}-${idx}`} className="p-card">
              <ProjectMedia proj={proj} onOpen={() => setSelectedProject(proj)} />

              <div className="p-content">
                <h3 className="p-title">
                  <button type="button" className="p-title-btn" onClick={() => setSelectedProject(proj)}>
                    {proj.name}
                  </button>
                </h3>
                <p className="p-desc">{truncate(info, 150)}</p>

                {proj.tags && proj.tags.length > 0 && (
                  <ul className="p-tags" aria-label="Technologies">
                    {proj.tags.slice(0, 4).map((tag) => (
                      <li key={tag} className="p-tag-pill">
                        {tag}
                      </li>
                    ))}
                    {proj.tags.length > 4 && <li className="p-tag-more">+{proj.tags.length - 4}</li>}
                  </ul>
                )}
              </div>

              <div className="p-actions">
                <button className="p-btn-details" onClick={() => setSelectedProject(proj)} type="button">
                  Overview {hasVideo ? <FiVideo aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}
                </button>
                <ProjectLinks proj={proj} />
              </div>
            </article>
          );
        })}
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={closeModal} />}
    </section>
  );
}
