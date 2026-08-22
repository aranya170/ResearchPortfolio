import React from "react";
import "../styles/About.css";
import { usePortfolio } from "../context/PortfolioContext";
import { FiAward, FiBookOpen, FiCpu, FiTrendingUp } from "react-icons/fi";

const About = () => {
  const { portfolio } = usePortfolio();
  const aboutData = portfolio?.about || {};
  const profileImg = aboutData.profile_image || "/assets/Aranya Kishor Das.png";

  return (
    <section id="about" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Background & Leadership</div>
          <h2 className="section-heading">Academic Profile & Focus</h2>
        </div>
      </div>

      <div className="about-grid">
        {/* Left: Dossier Card */}
        <div className="dossier-card">
          <div className="dossier-photo">
            <img src={profileImg} alt="Aranya Kishor Das" />
          </div>
          <div className="dossier-details">
            <h3 className="dossier-title">Aranya Kishor Das</h3>
            <p className="dossier-subtitle">Undergraduate Researcher & Club President</p>
            <div className="dossier-rows">
              <div className="d-row">
                <span className="d-label">Affiliation</span>
                <span className="d-val">United International University</span>
              </div>
              <div className="d-row">
                <span className="d-label">Core Focus</span>
                <span className="d-val">Deep Learning, Autonomous Robotics, Kinematics</span>
              </div>
              <div className="d-row">
                <span className="d-label">Location</span>
                <span className="d-val">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative + 4 Core Pillars */}
        <div className="about-right-pane">
          <div className="about-bio-card">
            <p>
              I am an AI researcher and roboticist focused on bridging the gap between theoretical deep learning models and practical embedded hardware. My path began with microcontrollers and RC robotics in 2015, evolving into active research on deep neural architectures, adaptive ensemble modeling, and parallel robotic manipulation.
            </p>
            <p>
              Currently serving as <strong>Undergraduate Research Assistant</strong> under Dr. Mohammad Nurul Huda and <strong>President of UIU Robotics Club</strong>, I led national-level open-source initiatives like RoboNeT while mentoring 50+ undergraduate engineering students in neural network optimization and embedded systems design.
            </p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-box">
              <div className="pillar-ico"><FiCpu /></div>
              <div className="pillar-info">
                <h4>Robotics & Kinematics</h4>
                <p>Parallel Delta geometry, 4-axis SCARA kinematics, trajectory planning, and motor synchronization.</p>
              </div>
            </div>

            <div className="pillar-box">
              <div className="pillar-ico"><FiTrendingUp /></div>
              <div className="pillar-info">
                <h4>Deep Learning & AI</h4>
                <p>Adaptive ensemble learning, psychometric classification models, and computer vision pipelines.</p>
              </div>
            </div>

            <div className="pillar-box">
              <div className="pillar-ico"><FiBookOpen /></div>
              <div className="pillar-info">
                <h4>Open Research & Mentorship</h4>
                <p>Creator of RoboNeT (open-source robotics learning repository); Teaching Assistant for IoT & Robotics.</p>
              </div>
            </div>

            <div className="pillar-box">
              <div className="pillar-ico"><FiAward /></div>
              <div className="pillar-info">
                <h4>Global Recognition</h4>
                <p>19 university admission offers across USA & Switzerland; executive leadership across 100+ members.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
