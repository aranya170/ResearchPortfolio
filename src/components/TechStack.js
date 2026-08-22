import React from "react";
import * as SiIcons from "react-icons/si";
import "../styles/TechStack.css";

const DOMAIN_GROUPS = [
  {
    category: "AI, Machine Learning & Vision",
    tools: [
      { name: "Python", icon: "SiPython", color: "#3776AB" },
      { name: "PyTorch", icon: "SiPytorch", color: "#EE4C2C" },
      { name: "Pandas", icon: "SiPandas", color: "#150458" },
      { name: "NumPy", icon: "SiNumpy", color: "#013243" },
      { name: "Jupyter", icon: "SiJupyter", color: "#F37626" },
      { name: "Scikit-Learn", icon: "SiScikitlearn", color: "#F7931E" },
    ],
  },
  {
    category: "Robotics, IoT & Embedded Systems",
    tools: [
      { name: "Arduino / ESP32", icon: "SiArduino", color: "#00979D" },
      { name: "C++", icon: "SiCplusplus", color: "#00599C" },
      { name: "C", icon: "SiC", color: "#A8B9CC" },
      { name: "Inverse Kinematics", icon: "SiCodefactor", color: "#1E4334" },
      { name: "Tinkercad", icon: "SiTinkercad", color: "#0066B6" },
      { name: "Figma (Prototyping)", icon: "SiFigma", color: "#F24E1E" },
    ],
  },
  {
    category: "Software Engineering & Full-Stack",
    tools: [
      { name: "React", icon: "SiReact", color: "#61DAFB" },
      { name: "Next.js", icon: "SiNextdotjs", color: "#000000" },
      { name: "JavaScript (ES6+)", icon: "SiJavascript", color: "#E5A910" },
      { name: "Tailwind CSS", icon: "SiTailwindcss", color: "#06B6D4" },
      { name: "HTML5 / CSS3", icon: "SiHtml5", color: "#E34F26" },
      { name: "Java", icon: "SiOpenjdk", color: "#007396" },
    ],
  },
  {
    category: "Databases, Cloud & Dev Tools",
    tools: [
      { name: "MySQL", icon: "SiMysql", color: "#00758F" },
      { name: "PostgreSQL", icon: "SiPostgresql", color: "#336791" },
      { name: "Git", icon: "SiGit", color: "#F1502F" },
      { name: "GitHub", icon: "SiGithub", color: "#24292E" },
      { name: "Jira / Agile", icon: "SiJira", color: "#2684FF" },
      { name: "Adobe Suite", icon: "SiAdobeillustrator", color: "#FF9A00" },
    ],
  },
];

export default function TechStack() {
  const renderIcon = (iconName) => {
    const IconComp = SiIcons[iconName] || SiIcons.SiCodefactor;
    return <IconComp />;
  };

  return (
    <section id="tech-stack" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Engineering Proficiencies</div>
          <h2 className="section-heading">Technical Matrix & Tooling</h2>
        </div>
      </div>

      <div className="tech-matrix-grid">
        {DOMAIN_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="matrix-domain-card">
            <h3 className="matrix-domain-title">{group.category}</h3>
            <div className="matrix-tools-wrap">
              {group.tools.map((tool, tIdx) => (
                <div key={tIdx} className="tool-chip">
                  <span className="tool-icon" style={{ color: tool.color }}>
                    {renderIcon(tool.icon)}
                  </span>
                  <span className="tool-name">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}