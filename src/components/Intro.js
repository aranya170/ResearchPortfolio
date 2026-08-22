import React from "react";
import "../styles/Intro.css";
import { usePortfolio } from "../context/PortfolioContext";
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail, FiFileText, FiCpu, FiCode } from "react-icons/fi";

const Intro = () => {
  const { portfolio } = usePortfolio();
  const p = portfolio?.siteProfile || {};
  const socials = portfolio?.settings?.socials || {};

  const name = p.name || "Aranya Kishor Das";
  const subtitle = p.subtitle || "AI Researcher & Robotics Lead";
  const description =
    p.description ||
    "Undergraduate Research Assistant & President of UIU Robotics Club. Specializing in Deep Learning architectures, autonomous robotics, parallel kinematics, and full-stack systems.";
  const cvUrl = p.cv_url || "/assets/My_CV.pdf";
  const githubUrl = socials.github || "https://github.com/aranya170";
  const linkedinUrl = socials.linkedin || "https://www.linkedin.com/in/aranya170";
  const emailUrl = `mailto:${socials.email || "aranya.akd@gmail.com"}`;

  return (
    <section id="intro" className="executive-hero">
      <div className="hero-grid">
        {/* Left Column: Core Identity & Bio */}
        <div className="hero-left">
          <div className="hero-status-pill">
            <span className="status-dot"></span>
            Available for Research Collaborations & Projects
          </div>

          <h1 className="hero-name">{name}</h1>
          <p className="hero-role">{subtitle}</p>

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
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
                <FiGithub />
              </a>
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FiLinkedin />
              </a>
              <a href={emailUrl} title="Email">
                <FiMail />
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
              <a href="#projects" className="jump-item">
                <div className="jump-icon"><FiFileText /></div>
                <div className="jump-details">
                  <h4>Research & AI Models</h4>
                  <p>Open-source repositories, psychometric classification & ensemble networks</p>
                </div>
                <span className="jump-arrow"><FiArrowUpRight /></span>
              </a>

              <a href="#projects" className="jump-item">
                <div className="jump-icon"><FiCpu /></div>
                <div className="jump-details">
                  <h4>Hardware & Kinematics</h4>
                  <p>Delta parallel arms, 4-axis SCARA robots, quadcopters & IoT telemetry</p>
                </div>
                <span className="jump-arrow"><FiArrowUpRight /></span>
              </a>

              <a href="#projects" className="jump-item">
                <div className="jump-icon"><FiCode /></div>
                <div className="jump-details">
                  <h4>Full-Stack & Distributed Systems</h4>
                  <p>Production web portals, ERP supply chains, Laravel & React architectures</p>
                </div>
                <span className="jump-arrow"><FiArrowUpRight /></span>
              </a>
            </div>

            <div className="index-stats-bar">
              <div className="stat-unit">
                <span className="stat-val">3+</span>
                <span className="stat-name">Research Repos</span>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-unit">
                <span className="stat-val">5+</span>
                <span className="stat-name">Hardware Builds</span>
              </div>
              <div className="stat-separator"></div>
              <div className="stat-unit">
                <span className="stat-val">10+</span>
                <span className="stat-name">Systems Built</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
