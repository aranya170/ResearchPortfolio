import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import "../styles/Experience.css";
import { usePortfolio } from "../context/PortfolioContext";

const defaultExperienceItems = {
  "UIU Robotics Club": {
    jobTitle: "President @",
    duration: "NOV 2025 - Present",
    desc: [
      "Led the executive committee and core members, enforcing a structured organogram to improve club efficiency and resolving internal communication gaps to ensure smooth operations.",
      "Organized and executed events, workshops, and seminars, enhancing the club's visibility and engagement within the school community.",
      "Developed and implemented a new curriculum for the club, focusing on practical applications of robotics and programming, resulting in a 30% increase in member engagement.",
      "Spearheaded the launch of Bangladesh's first public open-source repository for robotics and IoT learning, creating accessible educational resources for students.",
    ],
  },
  "United International University": {
    jobTitle: "Undergraduate Research Assistant @",
    duration: "JUN 2025 - Present",
    desc: [
      "Spearheaded RoboNeT, Bangladesh's first open-source robotics and IoT learning repository, acting as the lead contributor to provide accessible educational resources nationwide.",
      "Developed and implemented a practical robotics curriculum, resulting in a significant increase in member engagement through hands-on programming and deep learning modules.",
      "Collaborated with faculty to design and execute experiments in autonomous systems and machine learning, contributing to ongoing research projects and publications.",
      "Mentored 50+ undergraduate students in robotics and deep learning, providing technical guidance on hardware integration and neural network optimization.",
    ],
  },
  "CrossRoads Initiative": {
    jobTitle: "Technical Lead @",
    duration: "JUN 2020 - FEB 2022",
    desc: [
      "Led UX design and prototyping in Figma, translating research findings into intuitive wireframes and user journeys designed around privacy, ensuring user safety and trust",
      "Worked closely with the development team to implement the design in React, ensuring a seamless user experience and adherence to best practices in web development",
      "Worked as an education professional, conducting workshops and training sessions to educate users on the platform's features and benefits, enhancing user adoption and engagement",
    ],
  },
  "Gregorian Science Club": {
    jobTitle: "Designer @",
    duration: "MAY 2018 - AUG 2020",
    desc: [
      "Managed the club's social media presence, creating engaging content and graphics to promote events and initiatives, resulting in a 50% increase in online engagement",
      "Acted as a designer for the club, creating visually appealing graphics and promotional materials for events and initiatives, enhancing the club's visibility and engagement",
    ],
  },
  "ISTARC": {
    jobTitle: "Club Co-ordinator @",
    duration: "January 2016 - OCT 2018",
    desc: [
      "Managed a team of 20+ members to organize and execute events, workshops, and seminars, enhancing the club's visibility and engagement within the school community",
      "Leveraged graphic design skills and creativity to produce unique and compelling designs",
    ],
  },
};

const JobList = () => {
  const { portfolio } = usePortfolio();

  let experienceItems = defaultExperienceItems;
  if (
    portfolio &&
    Array.isArray(portfolio.experiences) &&
    portfolio.experiences.length > 0
  ) {
    experienceItems = {};
    portfolio.experiences.forEach((exp) => {
      let descs = exp.descriptions;
      if (typeof descs === "string") {
        try {
          descs = JSON.parse(descs);
        } catch (e) {
          descs = [];
        }
      }
      experienceItems[exp.company] = {
        jobTitle: exp.job_title,
        duration: exp.duration,
        desc: Array.isArray(descs) ? descs : [String(descs)],
      };
    });
  }

  const keys = Object.keys(experienceItems);
  const [value, setValue] = useState(0);
  const [isHorizontal, setIsHorizontal] = useState(window.innerWidth < 600);
  const contentRef = useRef(null);

  const safeIndex = value < keys.length && value >= 0 ? value : 0;
  const currentKey = keys[safeIndex] || keys[0];
  const currentItem = experienceItems[currentKey] || {
    jobTitle: "",
    duration: "",
    desc: [],
  };

  useEffect(() => {
    const handleResize = () => {
      setIsHorizontal(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabChange = (index) => {
    if (index === value) return;

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setValue(index);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
          );
        },
      });
    } else {
      setValue(index);
    }
  };

  return (
    <div className={`joblist-root ${isHorizontal ? "horizontal" : "vertical"}`}>
      <div className={`joblist-tabs ${isHorizontal ? "horizontal" : "vertical"}`}>
        {keys.map((key, i) => (
          <button
            key={key}
            className={`joblist-tab${safeIndex === i ? " active" : ""}`}
            onClick={() => handleTabChange(i)}
          >
            {isHorizontal ? `0${i + 1}.` : key}
          </button>
        ))}
      </div>

      <div className="joblist-content" ref={contentRef}>
        <div className="joblist-panel">
          <span className="joblist-job-title">{currentItem.jobTitle} </span>
          <span className="joblist-job-company">{currentKey}</span>
          <div className="joblist-duration">{currentItem.duration}</div>
          <ul className="job-description">
            {currentItem.desc.map((descItem, j) => (
              <li key={j}>{descItem}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobList;
