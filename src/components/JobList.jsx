import React, { useState, useRef } from "react";
import "../styles/Experience.css";
import { usePortfolio } from "../context/PortfolioContext";

const parseDescriptions = (descs) => {
  if (typeof descs === "string") {
    try {
      descs = JSON.parse(descs);
    } catch {
      return [descs];
    }
  }
  return Array.isArray(descs) ? descs : [];
};

const JobList = () => {
  const { portfolio } = usePortfolio();
  const [value, setValue] = useState(0);
  const tabRefs = useRef([]);

  // One tab per role (not per company) so multiple roles at the same organisation all show
  const items = (portfolio.experiences || []).map((exp, i) => ({
    key: exp.id || `${exp.company}-${i}`,
    company: exp.company,
    jobTitle: exp.job_title,
    duration: exp.duration,
    desc: parseDescriptions(exp.descriptions),
  }));

  if (items.length === 0) return null;
  const safeIndex = value >= 0 && value < items.length ? value : 0;
  const current = items[safeIndex];

  const onKeyDown = (e) => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!delta) return;
    e.preventDefault();
    const next = (safeIndex + delta + items.length) % items.length;
    setValue(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="joblist-root">
      <div className="joblist-tabs" role="tablist" aria-label="Experience" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.key}
            ref={(el) => (tabRefs.current[i] = el)}
            id={`job-tab-${i}`}
            className={`joblist-tab${safeIndex === i ? " active" : ""}`}
            onClick={() => setValue(i)}
            type="button"
            role="tab"
            aria-selected={safeIndex === i}
            aria-controls="job-panel"
            tabIndex={safeIndex === i ? 0 : -1}
          >
            <span className="joblist-tab-company">{item.company}</span>
            <span className="joblist-tab-role">{item.jobTitle}</span>
          </button>
        ))}
      </div>

      <div className="joblist-content" role="tabpanel" id="job-panel" aria-labelledby={`job-tab-${safeIndex}`}>
        <h3 className="jl-header">
          <span className="jl-title">{current.jobTitle}</span>
          <span className="jl-company"> @ {current.company}</span>
        </h3>
        <div className="jl-duration">{current.duration}</div>
        <ul className="jl-desc">
          {current.desc.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobList;
