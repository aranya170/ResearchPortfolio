import React from "react";
import "../styles/Timeline.css";
import { usePortfolio } from "../context/PortfolioContext";

export default function Timeline() {
  const { portfolio } = usePortfolio();
  const milestones =
    Array.isArray(portfolio.timeline) ? portfolio.timeline : [];

  return (
    <section id="timeline" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Progression & Career Path</div>
          <h2 className="section-heading">Journey & Milestones</h2>
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
