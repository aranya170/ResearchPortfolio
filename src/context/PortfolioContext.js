import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import ProjectList from "../components/ProjectList";

const initialDefaultData = {
  siteProfile: {
    greeting: "Hi there! I'm ",
    name: "Aranya Kishor Das",
    subtitle: "AI Researcher & Robotics Enthusiast",
    subtitle_suffix: "dedicated to Intelligent Systems.",
    description:
      "From building RC cars in highschool to leading UIU Robotics and researching AI, I'm driven by a passion for creating smarter solutions through Deep Learning and Robotics.",
    cv_url: "/assets/My_CV.pdf",
    show_robot: true,
    show_stars: true,
  },
  about: {
    title: "About Me",
    profile_image: "/assets/Aranya Kishor Das.png",
    paragraphs: [
      `Hi, my name is Aranya and I enjoy solving puzzles, building things, and exploring technology. My journey began in 2015 when I became fascinated by <span class="highlight">remote-controlled cars</span> and microcontrollers like <span class="highlight">Arduino and ESP</span>. That childhood curiosity sparked a lifelong passion for electronics and robotics.`,
      `From 2015 to 2019, I explored the vast fields of computer science, graphics design, and software engineering. During the pandemic, I deep-dived into <span class="highlight">Web Development and Figma Design</span>. My academic journey eventually led me to United International University, after receiving 19 admission offers from universities in the <span class="highlight">USA and Switzerland</span>.`,
      `In 2024, I pivoted my focus toward <span class="highlight">Deep Learning and Artificial Intelligence</span>. Today, I serve as an Undergraduate Research Assistant at UIU, a Teaching Assistant for IoT and Robotics, and the <span class="highlight">President of the UIU Robotics Club</span>, where I continue to push the boundaries of intelligent systems.`,
      `Outside of work, I love playing video games. I'm also into aesthetic interior designs and I love hoarding cool tech products.`,
    ],
    timeline_link_text: "View my timeline to learn more about my unique journey",
    contact_button_text: "Get in Touch",
  },
  projects: ProjectList,
  experiences: [
    {
      company: "United International University",
      job_title: "Undergraduate Assistant",
      duration: "Feb 2024 - Present",
      location: "Dhaka, Bangladesh",
      descriptions: [
        "Served as an Undergraduate Assistant under Professor Dr. Mohammad Nurul Huda.",
        "Created RoboNeT, the first-ever open-source robotics, networking, IoT & data communication repository in Bangladesh.",
        "Facilitated hands-on labs and mentoring for students in robotics and embedded systems.",
      ],
      sort_order: 1,
    },
    {
      company: "UIU Robotics Club",
      job_title: "President",
      duration: "Dec 2024 - Present",
      location: "Dhaka, Bangladesh",
      descriptions: [
        "Led a multidisciplinary organization with 200+ active members building cutting-edge rovers and drones.",
        "Architected and deployed the official club web platform (robotics.uiu.ac.bd).",
        "Represented the university at national and international robotics competitions.",
      ],
      sort_order: 2,
    },
    {
      company: "Self-Employed",
      job_title: "Freelance Full-Stack Developer",
      duration: "Jan 2022 - Dec 2024",
      location: "Remote",
      descriptions: [
        "Built custom web apps and e-commerce platforms using Tailwind CSS, PHP, React, and MySQL.",
        "Delivered end-to-end commercial solutions such as Dacca Delights bakery platform.",
      ],
      sort_order: 3,
    },
    {
      company: "UIU Robotics Club",
      job_title: "Vice President",
      duration: "Jan 2024 - Dec 2024",
      location: "Dhaka, Bangladesh",
      descriptions: [
        "Coordinated project teams across software, electronics, and mechanical divisions.",
        "Organized high-impact workshops on ROS, Computer Vision, and Microcontrollers.",
      ],
      sort_order: 4,
    },
    {
      company: "UIU Robotics Club",
      job_title: "Executive Member",
      duration: "Jan 2023 - Dec 2023",
      location: "Dhaka, Bangladesh",
      descriptions: [
        "Contributed to the hardware and software development of autonomous rovers and drones.",
      ],
      sort_order: 5,
    },
  ],
  timeline: [
    {
      title: "Early Curiosity",
      description: "Fascinated by computers and RC cars in Class 8, discovering microcontrollers like Arduino and ESP.",
      year: "2015",
      type: "idea",
      sort_order: 1,
    },
    {
      title: "Tech Exploration",
      description: "Explored competitive programming, web development, graphics design, and video editing.",
      year: "2015 - 2019",
      type: "career",
      sort_order: 2,
    },
    {
      title: "Global Offers & Pivots",
      description: "Received 19 university admission offers across the USA and Switzerland; enrolled at UIU.",
      year: "2020 - 2021",
      type: "education",
      sort_order: 3,
    },
    {
      title: "Deep Dive in AI & Robotics",
      description: "Joined UIU Robotics, began publishing research, and focused on Deep Learning.",
      year: "2022 - 2024",
      type: "research",
      sort_order: 4,
    },
    {
      title: "President & Lead Researcher",
      description: "Became President of UIU Robotics and Undergraduate Assistant under Dr. Mohammad Nurul Huda.",
      year: "2024 - 2025",
      type: "startup",
      sort_order: 5,
    },
    {
      title: "Present & Future Horizons",
      description: "Pursuing higher research in AI, intelligent robotics, and scalable systems.",
      year: "2025 - Present",
      type: "statistics",
      sort_order: 6,
    },
  ],
  techStack: [
    { name: "MySQL", icon_name: "SiMysql", color: "#00758F", category: "Database", sort_order: 1 },
    { name: "Java", icon_name: "SiOpenjdk", color: "#007396", category: "Language", sort_order: 2 },
    { name: "Python", icon_name: "SiPython", color: "#FFD43B", category: "Language", sort_order: 3 },
    { name: "Pandas", icon_name: "SiPandas", color: "#150458", category: "Data", sort_order: 4 },
    { name: "NumPy", icon_name: "SiNumpy", color: "#013243", category: "Data", sort_order: 5 },
    { name: "Git", icon_name: "SiGit", color: "#F1502F", category: "Tools", sort_order: 6 },
    { name: "Jupyter", icon_name: "SiJupyter", color: "#F37626", category: "Tools", sort_order: 7 },
    { name: "Figma", icon_name: "SiFigma", color: "#F24E1E", category: "Design", sort_order: 8 },
    { name: "Illustrator", icon_name: "SiAdobeillustrator", color: "#FF9A00", category: "Design", sort_order: 9 },
    { name: "Photoshop", icon_name: "SiAdobephotoshop", color: "#31A8FF", category: "Design", sort_order: 10 },
    { name: "Github", icon_name: "SiGithub", color: "#696868ff", category: "Tools", sort_order: 11 },
    { name: "Html5", icon_name: "SiHtml5", color: "#E34F26", category: "Frontend", sort_order: 12 },
    { name: "Css3", icon_name: "SiCss3", color: "#1572B6", category: "Frontend", sort_order: 13 },
    { name: "Tailwindcss", icon_name: "SiTailwindcss", color: "#06B6D4", category: "Frontend", sort_order: 14 },
    { name: "Javascript", icon_name: "SiJavascript", color: "#F7DF1E", category: "Frontend", sort_order: 15 },
    { name: "Jira", icon_name: "SiJira", color: "#2684FF", category: "Tools", sort_order: 16 },
    { name: "Tinkercad", icon_name: "SiTinkercad", color: "#0066B6", category: "Hardware", sort_order: 17 },
    { name: "C++", icon_name: "SiCplusplus", color: "#00599C", category: "Language", sort_order: 18 },
    { name: "C", icon_name: "SiC", color: "#A8B9CC", category: "Language", sort_order: 19 },
    { name: "React", icon_name: "SiReact", color: "#61DAFB", category: "Frontend", sort_order: 20 },
    { name: "Next.js", icon_name: "SiNextdotjs", color: "#686767ff", category: "Frontend", sort_order: 21 },
    { name: "Flutter", icon_name: "SiFlutter", color: "#02569B", category: "Mobile", sort_order: 22 },
  ],
  settings: {
    socials: {
      github: "https://github.com/aranya170",
      linkedin: "https://www.linkedin.com/in/aranya170",
      email: "aranya.akd@gmail.com",
    },
    footer: {
      copyrightText: "© {year} Aranya Kishor Das. All rights reserved.",
    },
  },
};

const PortfolioContext = createContext({
  portfolio: initialDefaultData,
  loading: true,
  isBackendOnline: false,
  refreshPortfolio: () => {},
});

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(initialDefaultData);
  const [loading, setLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const fetchPortfolioData = useCallback(async () => {
    try {
      const res = await api.getPortfolio();
      if (res && res.success && res.data) {
        setPortfolio((prev) => ({
          ...prev,
          siteProfile: res.data.siteProfile || prev.siteProfile,
          about: res.data.about || prev.about,
          projects:
            res.data.projects && Object.keys(res.data.projects).length > 0
              ? res.data.projects
              : prev.projects,
          experiences:
            res.data.experiences && res.data.experiences.length > 0
              ? res.data.experiences
              : prev.experiences,
          timeline:
            res.data.timeline && res.data.timeline.length > 0
              ? res.data.timeline
              : prev.timeline,
          techStack:
            res.data.techStack && res.data.techStack.length > 0
              ? res.data.techStack
              : prev.techStack,
          settings: res.data.settings || prev.settings,
        }));
        setIsBackendOnline(true);
      }
    } catch (err) {
      console.warn("Using default portfolio state due to:", err.message);
      setIsBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        loading,
        isBackendOnline,
        refreshPortfolio: fetchPortfolioData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);

export default PortfolioContext;
