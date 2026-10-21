import React from "react";
import "../styles/About.css";
import { usePortfolio } from "../context/PortfolioContext";
import { getAssetUrl } from "../services/api";
import { sanitizeHtml } from "../utils/sanitizeHtml";
import { FiAward, FiBookOpen, FiCpu, FiTrendingUp, FiCode, FiDatabase } from "react-icons/fi";

const renderPillarIcon = (iconName) => {
  switch (iconName) {
    case "ai":
    case "trending":
      return <FiTrendingUp />;
    case "book":
    case "research":
      return <FiBookOpen />;
    case "award":
      return <FiAward />;
    case "code":
      return <FiCode />;
    case "data":
      return <FiDatabase />;
    case "cpu":
    default:
      return <FiCpu />;
  }
};

const About = () => {
  const { portfolio } = usePortfolio();
  const aboutData = portfolio?.about || {};

  const profileImg = aboutData.profile_image || "/assets/Aranya Kishor Das.png";
  const name = aboutData.name || "Aranya Kishor Das";
  const role = aboutData.role || "Undergraduate Researcher & Club President";
  const affiliation = aboutData.affiliation || "United International University";
  const coreFocus = aboutData.core_focus || "Deep Learning, Autonomous Robotics, Kinematics";
  const location = aboutData.location || "Dhaka, Bangladesh";

  let paragraphs = aboutData.paragraphs;
  if (typeof paragraphs === "string") {
    try {
      paragraphs = JSON.parse(paragraphs);
    } catch {
      paragraphs = [paragraphs];
    }
  }
  if (!Array.isArray(paragraphs)) paragraphs = [];

  let pillars = aboutData.pillars;
  if (typeof pillars === "string") {
    try {
      pillars = JSON.parse(pillars);
    } catch {
      pillars = [];
    }
  }
  if (!Array.isArray(pillars)) pillars = [];

  return (
    <section id="about" className="portfolio-section" aria-labelledby="about-heading">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Background & Leadership</div>
          <h2 className="section-heading" id="about-heading">{aboutData.title || "Academic Profile & Focus"}</h2>
        </div>
      </div>

      <div className="about-grid">
        {/* Left: Dossier Card */}
        <div className="dossier-card">
          <div className="dossier-photo">
            <img src={getAssetUrl(profileImg)} alt={`Portrait of ${name}`} loading="lazy" decoding="async" />
          </div>
          <div className="dossier-details">
            <h3 className="dossier-title">{name}</h3>
            <p className="dossier-subtitle">{role}</p>
            <div className="dossier-rows">
              <div className="d-row">
                <span className="d-label">Affiliation</span>
                <span className="d-val">{affiliation}</span>
              </div>
              <div className="d-row">
                <span className="d-label">Core Focus</span>
                <span className="d-val">{coreFocus}</span>
              </div>
              <div className="d-row">
                <span className="d-label">Location</span>
                <span className="d-val">{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative + Dynamic Pillars */}
        <div className="about-right-pane">
          <div className="about-bio-card">
            {paragraphs.map((para, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: sanitizeHtml(para) }} />
            ))}
          </div>

          <div className="pillars-grid">
            {pillars.map((p, idx) => (
              <div key={p.id || idx} className="pillar-box">
                <div className="pillar-ico" aria-hidden="true">{renderPillarIcon(p.icon)}</div>
                <div className="pillar-info">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
