import React, { useState } from "react";
import ProjectList from "./ProjectList";
import "../styles/Projects.css";
import { usePortfolio } from "../context/PortfolioContext";
import { FiGithub, FiExternalLink, FiFileText, FiDatabase, FiX, FiLayers, FiCpu, FiCode, FiBarChart2, FiArrowUpRight } from "react-icons/fi";

const CATEGORIES = [
  { id: "All", label: "All Projects", icon: <FiLayers /> },
  { id: "Research", label: "Research & AI", icon: <FiFileText /> },
  { id: "Hardware", label: "Hardware & Robotics", icon: <FiCpu /> },
  { id: "Software", label: "Software & Systems", icon: <FiCode /> },
  { id: "SQL", label: "Data & SQL", icon: <FiBarChart2 /> },
];

export default function Projects() {
  const { portfolio } = usePortfolio();
  const rawProjects =
    portfolio && portfolio.projects && Object.keys(portfolio.projects).length > 0
      ? portfolio.projects
      : ProjectList;

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  // Flatten all projects into categorized list
  const allProjects = [];
  Object.keys(rawProjects).forEach((cat) => {
    (rawProjects[cat] || []).forEach((proj) => {
      allProjects.push({
        ...proj,
        category: cat,
      });
    });
  });

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

          return (
            <article key={proj.id || `${proj.name}-${idx}`} className="p-card">
              {/* Media Thumbnail */}
              {proj.image && (
                <div
                  className="p-media"
                  onClick={() => setSelectedProject(proj)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={proj.image}
                    alt={proj.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.parentElement.style.display = "none";
                    }}
                  />
                  <span className={`p-badge p-badge-${proj.category.toLowerCase()}`}>
                    {proj.category}
                  </span>
                </div>
              )}

              {/* Card Main Info */}
              <div className="p-content">
                {!proj.image && (
                  <span className={`p-badge p-badge-${proj.category.toLowerCase()}`}>
                    {proj.category}
                  </span>
                )}

                <h3 className="p-title" onClick={() => setSelectedProject(proj)}>
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
                  onClick={() => setSelectedProject(proj)}
                  type="button"
                >
                  Overview <FiArrowUpRight />
                </button>

                <div className="p-links-row">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-link"
                      title="GitHub Repository"
                    >
                      <FiGithub /> Repo
                    </a>
                  )}
                  {proj.website && (
                    <a
                      href={proj.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-link"
                      title="Live Deployment"
                    >
                      <FiExternalLink /> Live
                    </a>
                  )}
                  {notebook && (
                    <a
                      href={notebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-link"
                      title="Jupyter Notebook / Paper"
                    >
                      <FiFileText /> Notebook
                    </a>
                  )}
                  {proj.dataset && (
                    <a
                      href={proj.dataset}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-link"
                      title="Dataset"
                    >
                      <FiDatabase /> Dataset
                    </a>
                  )}
                  {proj.medium && (
                    <a
                      href={proj.medium}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-icon-link"
                      title="Article"
                    >
                      Article
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Clean Technical Specs Modal */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className={`modal-badge p-badge-${selectedProject.category.toLowerCase()}`}>
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
              {selectedProject.image && (
                <div className="modal-banner">
                  <img src={selectedProject.image} alt={selectedProject.name} />
                </div>
              )}

              <div className="modal-block">
                <div className="modal-block-label">Project Description</div>
                <p className="modal-text">{getInfoContent(selectedProject)}</p>
              </div>

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="modal-block">
                  <div className="modal-block-label">Technologies & Stack</div>
                  <div className="modal-pills">
                    {selectedProject.tags.map((t, i) => (
                      <span key={i} className="modal-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.files && selectedProject.files.length > 1 && (
                <div className="modal-block">
                  <div className="modal-block-label">Attached Links & Files</div>
                  <div className="modal-files">
                    {selectedProject.files.map((file, fIdx) => (
                      <div key={fIdx} className="file-item-row">
                        <span className="file-item-title">{file.name}</span>
                        <span className="file-item-type">({file.type})</span>
                        {file.content && file.content.startsWith("http") && (
                          <a
                            href={file.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="file-item-link"
                          >
                            Open Link <FiArrowUpRight />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
        </div>
      )}
    </section>
  );
}