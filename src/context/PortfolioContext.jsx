import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
// Snapshot of the backend's /api/portfolio response. The page renders from it
// immediately, then swaps in live data once the API responds.
import defaultPortfolio from "../data/defaultPortfolio.json";

const nonEmpty = (value, fallback) => {
  if (Array.isArray(value)) return value.length > 0 ? value : fallback;
  if (value && typeof value === "object") return Object.keys(value).length > 0 ? value : fallback;
  return value || fallback;
};

const PortfolioContext = createContext({
  portfolio: defaultPortfolio,
  isBackendOnline: false,
  refreshPortfolio: () => {},
});

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(defaultPortfolio);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const fetchPortfolioData = useCallback(async () => {
    try {
      const res = await api.getPortfolio();
      if (res && res.success && res.data) {
        setPortfolio((prev) => ({
          siteProfile: nonEmpty(res.data.siteProfile, prev.siteProfile),
          about: nonEmpty(res.data.about, prev.about),
          projects: nonEmpty(res.data.projects, prev.projects),
          experiences: nonEmpty(res.data.experiences, prev.experiences),
          timeline: nonEmpty(res.data.timeline, prev.timeline),
          techStack: nonEmpty(res.data.techStack, prev.techStack),
          settings: nonEmpty(res.data.settings, prev.settings),
        }));
        setIsBackendOnline(true);
      }
    } catch (err) {
      console.warn("Using bundled portfolio data:", err.message);
      setIsBackendOnline(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return (
    <PortfolioContext.Provider value={{ portfolio, isBackendOnline, refreshPortfolio: fetchPortfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
