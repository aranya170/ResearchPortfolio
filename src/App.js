import React from "react";
import { Switch, Route } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import Intro from "./components/Intro";
import Projects from "./components/Projects";
import About from "./components/About";
import Experience from "./components/Experience";
import Timeline from "./components/Timeline";
import TechStack from "./components/TechStack";
import GitHubContributions from "./components/GitHubContributions";
import Contact from "./components/Contact";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import AdminApp from "./admin/AdminApp";
import "./App.css";
import "./styles/Global.css";

function MainPortfolio() {
  return (
    <div className="App">
      <NavBar />
      <div id="content">
        <Intro />
        <Projects />
        <About />
        <Experience />
        <Timeline />
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