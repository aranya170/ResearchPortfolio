import React, { useState, useEffect, useCallback } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import "../styles/NavBar.css";

const navItems = [
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#timeline", label: "Timeline" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "#contact", label: "Contact" },
];

const getInitialTheme = () => {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit) return explicit;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Start from "light" so pre-rendered HTML and the first client render match; sync after mount
  const [theme, setTheme] = useState("light");
  useEffect(() => setTheme(getInitialTheme()), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return undefined;
    const onKeyDown = (e) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen, closeMenu]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new Event("portfolio:theme-change"));
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the choice just won't persist
    }
  };

  const themeLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <>
      <nav className={`site-nav${scrolled ? " scrolled" : ""}${mobileOpen ? " menu-open" : ""}`} aria-label="Primary">
        <div className="nav-inner">
          <a href="#intro" className="nav-logo" onClick={closeMenu}>
            <img src="/icon-192.png" alt="" className="nav-logo-img" width="32" height="32" />
            <span className="nav-logo-text">Aranya Kishor Das</span>
          </a>

          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.href} className="nav-item">
                <a href={item.href} className="nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <button type="button" className="nav-theme-toggle" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
              {theme === "dark" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
            </button>

            <button
              className={`nav-hamburger${mobileOpen ? " open" : ""}`}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              type="button"
            >
              <span className="ham-line ham-top" />
              <span className="ham-line ham-mid" />
              <span className="ham-line ham-bot" />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-overlay ${mobileOpen ? "active" : ""}`} onClick={closeMenu} id="mobile-menu">
        <div className="mobile-overlay-backdrop" />
        <ul className="mobile-links" onClick={(e) => e.stopPropagation()}>
          {navItems.map((item, idx) => (
            <li key={item.href} className="mobile-item" style={{ animationDelay: `${0.05 + idx * 0.04}s` }}>
              <a href={item.href} className="mobile-link" onClick={closeMenu}>
                <span className="mobile-link-num" aria-hidden="true">
                  0{idx + 1}
                </span>
                <span className="mobile-link-txt">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavBar;
