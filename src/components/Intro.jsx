import React from "react";
import "../styles/Intro.css";
import { usePortfolio } from "../context/PortfolioContext";
import { getAssetUrl } from "../services/api";
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail, FiFileText, FiCpu, FiCode, FiMapPin } from "react-icons/fi";

const Intro = () => {
  const { portfolio } = usePortfolio();
  const p = portfolio?.siteProfile || {};
  const socials = portfolio?.settings?.socials || {};

  const name = p.name || "Aranya Kishor Das";
  const subtitle = p.subtitle || "AI Researcher & Robotics Lead";
  const description =
    p.description ||
    "Undergraduate Research Assistant & President of UIU Robotics Club. Specializing in Deep Learning architectures, autonomous robotics, parallel kinematics, and full-stack systems.";
  const location = portfolio.about?.location || "Dhaka, Bangladesh";
  const cvUrl = getAssetUrl(p.cv_url || "/assets/My_CV.pdf");
  const githubUrl = socials.github || "https://github.com/aranya170";
  const linkedinUrl = socials.linkedin || "https://www.linkedin.com/in/aranya170";
  const emailUrl = `mailto:${socials.email || "aranya.akd@gmail.com"}`;

  // Stats come from the real project list instead of hardcoded numbers
  const projects = portfolio.projects || {};
  const countOf = (cat) => (Array.isArray(projects[cat]) ? projects[cat].length : 0);
  const totalProjects = Object.values(projects).reduce((n, list) => n + (Array.isArray(list) ? list.length : 0), 0);
  const stats = [
    { value: countOf("Research"), label: "Research Projects" },
    { value: countOf("Hardware"), label: "Hardware Builds" },
    { value: totalProjects, label: "Projects Shipped" },
  ];

  const jumpTo = (category) => () => {
    window.dispatchEvent(new CustomEvent("portfolio:filter-projects", { detail: category }));
  };

  return (
    <section id="intro" className="executive-hero" aria-label="Introduction">
      <div className="hero-grid">
        {/* Left Column: Core Identity & Bio */}
        <div className="hero-left">
          <div className="hero-status-pill">
            <span className="status-dot" aria-hidden="true"></span>
            Available for Research Collaborations & Projects
          </div>

          <h1 className="hero-name">{name}</h1>
          <p className="hero-role">{subtitle}</p>
          <p className="hero-location">
            <FiMapPin aria-hidden="true" /> {location}
          </p>

          <p className="hero-bio">{description}</p>

          <div className="hero-tags">
            <span className="hero-domain-tag">Autonomous Systems</span>
            <span className="hero-domain-tag">Deep Learning</span>
            <span className="hero-domain-tag">Parallel Robotics</span>
            <span className="hero-domain-tag">IoT & Embedded</span>
            <span className="hero-domain-tag">Full-Stack Engineering</span>
          </div>

          <div className="hero-actions">
            <a href="#projects" className="hero-primary-btn">
              Explore Featured Works <FiArrowUpRight />
            </a>
            <a
              href={cvUrl}
              className="hero-secondary-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FiFileText /> Curriculum Vitae
            </a>
            <div className="hero-social-links">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub profile">
                <FiGithub aria-hidden="true" />
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn profile">
                <FiLinkedin aria-hidden="true" />
              </a>
              <a href={emailUrl} title="Email" aria-label="Send an email">
                <FiMail aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Project Showcase Index (No Emojis) */}
        <div className="hero-right">
          <div className="hero-index-card">
            <div className="index-card-head">
              <span className="index-kicker">ENGINEERING DOMAINS</span>
              <span className="index-sub">Quick Navigation</span>
            </div>

            <div className="index-jump-list">
              <a href="#projects" className="jump-item" onClick={jumpTo("Research")}>
                <div className="jump-icon" aria-hidden="true"><FiFileText /></div>
                <div className="jump-details">
                  <p className="jump-title">Research & AI Models</p>
                  <p>Open-source repositories, psychometric classification & ensemble networks</p>
                </div>
                <span className="jump-arrow" aria-hidden="true"><FiArrowUpRight /></span>
              </a>

              <a href="#projects" className="jump-item" onClick={jumpTo("Hardware")}>
                <div className="jump-icon" aria-hidden="true"><FiCpu /></div>
                <div className="jump-details">
                  <p className="jump-title">Hardware & Kinematics</p>
                  <p>Delta parallel arms, 4-axis SCARA robots, quadcopters & IoT telemetry</p>
                </div>
                <span className="jump-arrow" aria-hidden="true"><FiArrowUpRight /></span>
              </a>

              <a href="#projects" className="jump-item" onClick={jumpTo("Software")}>
                <div className="jump-icon" aria-hidden="true"><FiCode /></div>
                <div className="jump-details">
                  <p className="jump-title">Full-Stack & Distributed Systems</p>
                  <p>Production web portals, ERP supply chains, Laravel & React architectures</p>
                </div>
                <span className="jump-arrow" aria-hidden="true"><FiArrowUpRight /></span>
              </a>
            </div>

            <div className="index-stats-bar">
              {stats.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <div className="stat-separator" aria-hidden="true"></div>}
                  <div className="stat-unit">
                    <span className="stat-val">{stat.value}</span>
                    <span className="stat-name">{stat.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
