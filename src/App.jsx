import React, { Suspense, lazy } from "react";
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
import "./App.css";
import "./styles/Global.css";

// The admin console is only for the site owner; keep it out of the public bundle
const AdminApp = lazy(() => import("./admin/AdminApp"));

function MainPortfolio() {
  return (
    <div className="App">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <NavBar />
      <main id="content">
        <Intro />
        <Projects />
        <Experience />
        <About />
        <Timeline />
        <TechStack />
        <GitHubContributions />
        <Contact />
      </main>
      <Credits />
    </div>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <Switch>
        <Route path="/admin">
          <Suspense fallback={null}>
            <AdminApp />
          </Suspense>
        </Route>
        <Route path="/" component={MainPortfolio} />
      </Switch>
    </PortfolioProvider>
  );
}

export default App;
