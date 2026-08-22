import React, { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import '../styles/GitHubContributions.css';
import { FiGithub, FiGitCommit, FiUsers } from 'react-icons/fi';

const GitHubContributions = () => {
  const [stats, setStats] = useState({ repos: 0, followers: 0 });
  const username = "aranya170";

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          repos: data.public_repos || 0,
          followers: data.followers || 0,
        });
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Light sage green theme for the calendar
  const theme = {
    light: ['#E6E1D6', '#B7D5C4', '#70B090', '#3D8B66', '#1E533B'],
  };

  return (
    <section id="github" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <span className="section-tagline">Open Source & Code Activity</span>
          <h2 className="section-heading">GitHub Contributions</h2>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="gh-header-profile-link"
        >
          <FiGithub /> @{username} ↗
        </a>
      </div>

      <div className="gh-widescreen-card">
        <div className="gh-card-header">
          <div className="gh-stats-items">
            <div className="gh-stat-block">
              <span className="gh-stat-icon"><FiGitCommit /></span>
              <div>
                <span className="gh-stat-val">{stats.repos}</span>
                <span className="gh-stat-label">Public Repositories</span>
              </div>
            </div>
            <div className="gh-stat-block">
              <span className="gh-stat-icon"><FiUsers /></span>
              <div>
                <span className="gh-stat-val">{stats.followers}</span>
                <span className="gh-stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gh-calendar-wrapper">
          <GitHubCalendar
            username={username}
            theme={theme}
            fontSize={12}
            blockSize={13}
            blockMargin={4}
            colorScheme="light"
            showWeekdayLabels
          />
        </div>
      </div>
    </section>
  );
};

export default GitHubContributions;