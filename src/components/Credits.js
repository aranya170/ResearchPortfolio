import React from "react";
import { Link } from "react-router-dom";
import "../styles/Credits.css";
import { usePortfolio } from "../context/PortfolioContext";

const Credits = () => {
  const { portfolio } = usePortfolio();
  const socials = portfolio?.settings?.socials || {
    github: "https://github.com/aranya170",
    linkedin: "https://www.linkedin.com/in/aranya170",
    email: "aranya.akd@gmail.com",
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="credits" className="portfolio-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <p className="footer-copy">
            © {currentYear} Aranya Kishor Das · Designed for High-Impact Research & Engineering
          </p>
        </div>

        <div className="footer-right">
          <a
            href={socials.github || "https://github.com/aranya170"}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <span className="footer-dot">·</span>
          <a
            href={socials.linkedin || "https://www.linkedin.com/in/aranya170"}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LinkedIn
          </a>
          <span className="footer-dot">·</span>
          <a href={`mailto:${socials.email || "aranya.akd@gmail.com"}`} className="footer-link">
            Email
          </a>
          <span className="footer-dot">·</span>
          <Link to="/admin" className="footer-link admin-portal-link">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Credits;
