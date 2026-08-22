import React from "react";
import JobList from "./JobList";
import "../styles/Experience.css";

const Experience = () => (
  <section id="experience" className="portfolio-section">
    <div className="section-head-bar">
      <div className="section-head-left">
        <span className="section-tagline">Leadership & Research Appointments</span>
        <h2 className="section-heading">Experience & Roles</h2>
      </div>
    </div>
    <JobList />
  </section>
);

export default Experience;