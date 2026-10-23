import React from "react";
import "../styles/TechStack.css";
import { usePortfolio } from "../context/PortfolioContext";
import { TECH_ICONS } from "../data/techIcons";

export default function TechStack() {
  const { portfolio } = usePortfolio();

  // Only the icons listed in data/techIcons.js are bundled (the full Simple Icons set is ~2 MB gzipped);
  // add a name there when the admin panel uses a new one
  const renderIcon = (iconName) => {
    const IconComp = TECH_ICONS[iconName] || TECH_ICONS.SiCodefactor;
    return <IconComp />;
  };

  let domainGroups = [];
  if (Array.isArray(portfolio.techStack)) {
    const groupsMap = {};
    portfolio.techStack.forEach((t) => {
      const cat = t.category || "General";
      if (!groupsMap[cat]) {
        groupsMap[cat] = { category: cat, tools: [] };
      }
      groupsMap[cat].tools.push({
        name: t.name,
        icon: t.icon_name || "SiCodefactor",
        color: t.color || "#64D98A",
      });
    });
    domainGroups = Object.values(groupsMap);
  }

  return (
    <section id="tech-stack" className="portfolio-section" aria-labelledby="tech-heading">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Engineering Proficiencies</div>
          <h2 className="section-heading" id="tech-heading">Technical Skills & Tools</h2>
        </div>
      </div>

      <div className="tech-matrix-grid">
        {domainGroups.map((group, gIdx) => (
          <div key={gIdx} className="matrix-domain-card">
            <h3 className="matrix-domain-title">{group.category}</h3>
            <ul className="matrix-tools-wrap">
              {group.tools.map((tool, tIdx) => (
                <li key={tIdx} className="tool-chip">
                  <span className="tool-icon" style={{ color: tool.color }} aria-hidden="true">
                    {renderIcon(tool.icon)}
                  </span>
                  <span className="tool-name">{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}