import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import Intro from "./components/Intro";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Timeline from "./components/Timeline";
import Experience from "./components/Experience";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import SideNavBar from "./components/SideNavBar";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import GitHubContributions from "./components/GitHubContributions";
import { StarsCanvas } from "./components/StarBackground";
import AdminApp from "./admin/AdminApp";
import "./App.css";
import "./styles/Global.css";

function MainPortfolio() {
  const [showStars, setShowStars] = useState(true);
  return (
    <div className="App">
      {showStars && <StarsCanvas />}
      <>
        <NavBar showStars={showStars} setShowStars={setShowStars} />
        <SideNavBar showStars={showStars} setShowStars={setShowStars} />
      </>

      <div id="content">
        <Intro />
        <About />
        <Projects />
        <Timeline />
        <Experience />
        <TechStack />
        <GitHubContributions />
        <Contact />
        <Credits />
      </div>
    </div>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <Switch>
        <Route path="/admin" component={AdminApp} />
        <Route path="/" component={MainPortfolio} />
      </Switch>
    </PortfolioProvider>
  );
}

export default App;