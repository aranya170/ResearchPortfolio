import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as SiIcons from "react-icons/si";
import "../styles/TechStack.css";
import { usePortfolio } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

const defaultTechTools = [
  { name: "MySQL", icon_name: "SiMysql", color: "#00758F" },
  { name: "Java", icon_name: "SiOpenjdk", color: "#007396" },
  { name: "Python", icon_name: "SiPython", color: "#FFD43B" },
  { name: "Pandas", icon_name: "SiPandas", color: "#150458" },
  { name: "NumPy", icon_name: "SiNumpy", color: "#013243" },
  { name: "Git", icon_name: "SiGit", color: "#F1502F" },
  { name: "Jupyter", icon_name: "SiJupyter", color: "#F37626" },
  { name: "Figma", icon_name: "SiFigma", color: "#F24E1E" },
  { name: "Illustrator", icon_name: "SiAdobeillustrator", color: "#FF9A00" },
  { name: "Photoshop", icon_name: "SiAdobephotoshop", color: "#31A8FF" },
  { name: "Github", icon_name: "SiGithub", color: "#696868ff" },
  { name: "Html5", icon_name: "SiHtml5", color: "#E34F26" },
  { name: "Css3", icon_name: "SiCss3", color: "#1572B6" },
  { name: "Tailwindcss", icon_name: "SiTailwindcss", color: "#06B6D4" },
  { name: "Javascript", icon_name: "SiJavascript", color: "#F7DF1E" },
  { name: "Jira", icon_name: "SiJira", color: "#2684FF" },
  { name: "Tinkercad", icon_name: "SiTinkercad", color: "#0066B6" },
  { name: "C++", icon_name: "SiCplusplus", color: "#00599C" },
  { name: "C", icon_name: "SiC", color: "#A8B9CC" },
  { name: "React", icon_name: "SiReact", color: "#61DAFB" },
  { name: "Next.js", icon_name: "SiNextdotjs", color: "#686767ff" },
  { name: "Flutter", icon_name: "SiFlutter", color: "#02569B" },
];

export default function TechStack() {
  const { portfolio } = usePortfolio();
  const techStackData =
    portfolio && Array.isArray(portfolio.techStack) && portfolio.techStack.length > 0
      ? portfolio.techStack
      : defaultTechTools;

  const techStackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tech-title",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#tech-stack",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".tech-icon-container",
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: {
            grid: [4, 6],
            from: "center",
            amount: 0.6,
          },
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: "#tech-stack",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, techStackRef);

    return () => ctx.revert();
  }, [techStackData]);

  const handleIconHover = (e, enter) => {
    const target = e.currentTarget;
    if (enter) {
      gsap.to(target, {
        y: -5,
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(target.querySelector(".tech-icon"), {
        color: "var(--green-bright)",
        duration: 0.3,
      });
    } else {
      gsap.to(target, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(target.querySelector(".tech-icon"), {
        color: target.dataset.color,
        duration: 0.3,
      });
    }
  };

  const renderIcon = (iconName) => {
    if (iconName && SiIcons[iconName]) {
      const IconComp = SiIcons[iconName];
      return <IconComp />;
    }
    return <SiIcons.SiCodefactor />;
  };

  return (
    <section id="tech-stack" ref={techStackRef}>
      <div className="section-header">
        <span className="section-title tech-title">Tech Stack</span>
      </div>

      <div className="tech-grid-container">
        {techStackData.map((tool) => (
          <div
            key={tool.name}
            className="tech-icon-container"
            data-color={tool.color}
            title={tool.name}
            onMouseEnter={(e) => handleIconHover(e, true)}
            onMouseLeave={(e) => handleIconHover(e, false)}
          >
            <div className="tech-icon" style={{ color: tool.color }}>
              {renderIcon(tool.icon_name)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}