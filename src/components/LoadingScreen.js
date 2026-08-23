import React, { useState, useEffect } from "react";
import "../styles/LoadingScreen.css";

export default function LoadingScreen({ isLoaded, onComplete }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // Small delay to ensure minimum display time for smooth aesthetics
      const timer = setTimeout(() => {
        setFadeOut(true);
        const exitTimer = setTimeout(() => {
          setShouldRender(false);
          if (onComplete) onComplete();
        }, 500); // matches CSS fade out duration
        return () => clearTimeout(exitTimer);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, onComplete]);

  if (!shouldRender) return null;

  return (
    <div className={`loading-screen-backdrop ${fadeOut ? "fade-out" : ""}`}>
      <div className="loading-content">
        <div className="loading-logo-wrapper">
          <div className="loading-pulse-ring"></div>
          <div className="loading-monogram">
            <span>A</span>
          </div>
        </div>
        <div className="loading-text-wrap">
          <div className="loading-name">ARANYA KISHOR DAS</div>
          <div className="loading-status">
            <span className="loading-bar-indicator"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
