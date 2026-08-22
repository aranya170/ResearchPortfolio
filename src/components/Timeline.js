import React from "react";
import "../styles/Timeline.css";
import { usePortfolio } from "../context/PortfolioContext";

const defaultMilestones = [
  {
    title: "Early Hardware & Robotics",
    description: "Built autonomous robots and RC systems, mastering microcontrollers including Arduino and ESP32.",
    year: "2015",
  },
  {
    title: "Competitive Programming & Full-Stack",
    description: "Competed in algorithmic contests, designed UI/UX systems in Figma, and built full-stack web applications.",
    year: "2015 – 2019",
  },
  {
    title: "Global Admission Offers & UIU",
    description: "Awarded 19 university admission offers across the USA & Switzerland; matriculated at United International University.",
    year: "2020 – 2021",
  },
  {
    title: "Robotics Club & Deep Learning Focus",
    description: "Joined UIU Robotics, initiated research publications, and specialized in neural architectures and vision pipelines.",
    year: "2022 – 2024",
  },
  {
    title: "Club President & RoboNeT Initiative",
    description: "Elected President of UIU Robotics Club; founded Bangladesh's first open-source robotics learning repository.",
    year: "2024 – 2025",
  },
  {
    title: "Advanced Autonomous Systems",
    description: "Conducting research in scalable intelligent robotics, adaptive ensemble models, and parallel kinematics.",
    year: "2025 – Present",
  },
];

export default function Timeline() {
  const { portfolio } = usePortfolio();
  const milestones =
    portfolio && Array.isArray(portfolio.timeline) && portfolio.timeline.length > 0
      ? portfolio.timeline
      : defaultMilestones;

  return (
    <section id="timeline" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Progression & Career Path</div>
          <h2 className="section-heading">Milestones & Trajectory</h2>
        </div>
      </div>

      <div className="timeline-grid">
        {milestones.map((item, idx) => (
          <div key={item.id || idx} className="milestone-box">
            <div className="milestone-header">
              <span className="milestone-year-tag">{item.year || item.timeframe}</span>
              <span className="milestone-index">0{idx + 1}</span>
            </div>
            <h3 className="milestone-heading">{item.title}</h3>
            <p className="milestone-body">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
