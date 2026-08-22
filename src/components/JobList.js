import React, { useState, useEffect } from "react";
import "../styles/Experience.css";
import { usePortfolio } from "../context/PortfolioContext";

const defaultExperienceItems = {
  "UIU Robotics Club": {
    jobTitle: "President",
    duration: "Nov 2025 – Present",
    desc: [
      "Led the executive committee, enforcing a structured organogram and resolving internal communication gaps.",
      "Organized events, workshops, and seminars, enhancing the club's visibility within the community.",
      "Developed a new curriculum focused on practical robotics and programming, increasing member engagement by 30%.",
      "Spearheaded Bangladesh's first open-source robotics and IoT learning repository.",
    ],
  },
  "United International University": {
    jobTitle: "Undergraduate Research Assistant",
    duration: "Jun 2025 – Present",
    desc: [
      "Spearheaded RoboNeT, Bangladesh's first open-source robotics and IoT learning repository.",
      "Developed and implemented a practical robotics curriculum for undergraduate students.",
      "Collaborated with faculty on autonomous systems and machine learning experiments.",
      "Mentored 50+ students in robotics and deep learning.",
    ],
  },
  "CrossRoads Initiative": {
    jobTitle: "Technical Lead",
    duration: "Jun 2020 – Feb 2022",
    desc: [
      "Led UX design and prototyping in Figma, translating research into intuitive wireframes.",
      "Implemented designs in React, ensuring seamless user experience.",
      "Conducted workshops educating users on platform features.",
    ],
  },
  "Gregorian Science Club": {
    jobTitle: "Designer",
    duration: "May 2018 – Aug 2020",
    desc: [
      "Managed the club's social media, creating engaging content to promote events.",
      "Produced visually compelling graphics and promotional materials.",
    ],
  },
  "ISTARC": {
    jobTitle: "Club Co-ordinator",
    duration: "Jan 2016 – Oct 2018",
    desc: [
      "Managed a team of 20+ members to organise events, workshops, and seminars.",
      "Leveraged graphic design skills to produce unique and compelling designs.",
    ],
  },
};

const JobList = () => {
  const { portfolio } = usePortfolio();
  const [value, setValue] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);

  let experienceItems = defaultExperienceItems;
  if (portfolio && Array.isArray(portfolio.experiences) && portfolio.experiences.length > 0) {
    experienceItems = {};
    portfolio.experiences.forEach((exp) => {
      let descs = exp.descriptions;
      if (typeof descs === "string") {
        try { descs = JSON.parse(descs); } catch { descs = []; }
      }
      experienceItems[exp.company] = {
        jobTitle: exp.job_title,
        duration: exp.duration,
        desc: Array.isArray(descs) ? descs : [String(descs)],
      };
    });
  }

  const keys = Object.keys(experienceItems);
  const safeIndex = value >= 0 && value < keys.length ? value : 0;
  const currentKey = keys[safeIndex];
  const currentItem = experienceItems[currentKey] || { jobTitle: "", duration: "", desc: [] };

  return (
    <div className={`joblist-root${isMobile ? " mobile" : ""}`}>
      {/* Tabs */}
      <div className="joblist-tabs">
        {keys.map((key, i) => (
          <button
            key={key}
            className={`joblist-tab${safeIndex === i ? " active" : ""}`}
            onClick={() => setValue(i)}
            type="button"
          >
            {isMobile ? key.split(" ")[0] : key}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="joblist-content">
        <div className="jl-header">
          <span className="jl-title">{currentItem.jobTitle}</span>
          <span className="jl-company"> @ {currentKey}</span>
        </div>
        <div className="jl-duration">{currentItem.duration}</div>
        <ul className="jl-desc">
          {currentItem.desc.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobList;
