import React, { useState, useEffect } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import '../styles/GitHubContributions.css';
import { FiGithub, FiGitCommit, FiUsers } from 'react-icons/fi';

const currentScheme = () =>
  document.documentElement.getAttribute("data-theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

const GitHubContributions = () => {
  const [stats, setStats] = useState({ repos: 0, followers: 0 });
  const username = "aranya170";

  useEffect(() => {
    // The unauthenticated GitHub API allows 60 requests/hour per IP, so cache for an hour
    const cacheKey = `gh-stats-${username}`;
    try {
      const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.at < 60 * 60 * 1000) {
        setStats(cached.stats);
        return;
      }
    } catch {
      // Ignore unavailable or corrupt storage
    }

    fetch(`https://api.github.com/users/${username}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`GitHub API ${res.status}`))))
      .then((data) => {
        const next = { repos: data.public_repos || 0, followers: data.followers || 0 };
        setStats(next);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), stats: next }));
        } catch {
          // Ignore unavailable storage
        }
      })
      .catch((err) => console.warn("GitHub stats unavailable:", err.message));
  }, []);

  const theme = {
    light: ['#E6E1D6', '#B7D5C4', '#70B090', '#3D8B66', '#1E533B'],
    dark: ['#262521', '#1F4A35', '#2E7050', '#4FA078', '#7FC4A0'],
  };
  const [colorScheme, setColorScheme] = useState("light");
  // The calendar fetches live data in the browser; skip it in the pre-rendered HTML
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    // NavBar announces manual theme switches; also follow OS changes
    const update = () => setColorScheme(currentScheme());
    update();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    window.addEventListener("portfolio:theme-change", update);
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("portfolio:theme-change", update);
      mq.removeEventListener("change", update);
    };
  }, []);

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
          {mounted && (
            <GitHubCalendar
              username={username}
              theme={theme}
              fontSize={12}
              blockSize={13}
              blockMargin={4}
              colorScheme={colorScheme}
              showWeekdayLabels
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default GitHubContributions;