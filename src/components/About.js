import React from "react";
import "../styles/About.css";
import { usePortfolio } from "../context/PortfolioContext";
import { getAssetUrl } from "../services/api";
import { FiAward, FiBookOpen, FiCpu, FiTrendingUp, FiCode, FiDatabase } from "react-icons/fi";

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
  if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
    paragraphs = defaultParagraphs;
  }

  let pillars = aboutData.pillars;
  if (typeof pillars === "string") {
    try {
      pillars = JSON.parse(pillars);
    } catch {
      pillars = defaultPillars;
    }
  }
  if (!Array.isArray(pillars) || pillars.length === 0) {
    pillars = defaultPillars;
  }

  return (
    <section id="about" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Background & Leadership</div>
          <h2 className="section-heading">{aboutData.title || "Academic Profile & Focus"}</h2>
        </div>
      </div>

      <div className="about-grid">
        {/* Left: Dossier Card */}
        <div className="dossier-card">
          <div className="dossier-photo">
            <img src={getAssetUrl(profileImg)} alt={name} />
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
              <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
            ))}
          </div>

          <div className="pillars-grid">
            {pillars.map((p, idx) => (
              <div key={p.id || idx} className="pillar-box">
                <div className="pillar-ico">{renderPillarIcon(p.icon)}</div>
                <div className="pillar-info">
                  <h4>{p.title}</h4>
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
