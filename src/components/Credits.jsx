import React from "react";
import "../styles/Credits.css";
import { usePortfolio } from "../context/PortfolioContext";

const Credits = () => {
  const { portfolio } = usePortfolio();
  const socials = portfolio.settings?.socials || {};

  const currentYear = new Date().getFullYear();

  return (
    <footer id="credits" className="portfolio-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <p className="footer-copy">
            © {currentYear} Aranya Kishor Das
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
        </div>
      </div>
    </footer>
  );
};

export default Credits;
