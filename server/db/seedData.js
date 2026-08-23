// Default seed data for Aranya's Portfolio

const seedData = {
  admin: {
    username: "AKD",
    email: "aranya.akd@gmail.com",
    password: "20010816Akd"
  },
  siteProfile: {
    greeting: "Hi there! I'm ",
    name: "Aranya Kishor Das",
    subtitle: "AI Researcher & Robotics Enthusiast",
    subtitle_suffix: "dedicated to Intelligent Systems.",
    description: "From building RC cars in highschool to leading UIU Robotics and researching AI, I'm driven by a passion for creating smarter solutions through Deep Learning and Robotics.",
    cv_url: "/assets/My_CV.pdf",
    show_robot: true,
    show_stars: true
  },
  about: {
    title: "About Me",
    profile_image: "/assets/Aranya Kishor Das.png",
    name: "Aranya Kishor Das",
    role: "Undergraduate Researcher & Club President",
    affiliation: "United International University",
    core_focus: "Deep Learning, Autonomous Robotics, Kinematics",
    location: "Dhaka, Bangladesh",
    paragraphs: [
      "I am an AI researcher and roboticist focused on bridging the gap between theoretical deep learning models and practical embedded hardware. My path began with microcontrollers and RC robotics in 2015, evolving into active research on deep neural architectures, adaptive ensemble modeling, and parallel robotic manipulation.",
      "Currently serving as Undergraduate Research Assistant under Dr. Mohammad Nurul Huda and President of UIU Robotics Club, I led national-level open-source initiatives like RoboNeT while mentoring 50+ undergraduate engineering students in neural network optimization and embedded systems design."
    ],
    pillars: [
      {
        id: 1,
        title: "Robotics & Kinematics",
        description: "Parallel Delta geometry, 4-axis SCARA kinematics, trajectory planning, and motor synchronization.",
        icon: "cpu"
      },
      {
        id: 2,
        title: "Deep Learning & AI",
        description: "Adaptive ensemble learning, psychometric classification models, and computer vision pipelines.",
        icon: "ai"
      },
      {
        id: 3,
        title: "Open Research & Mentorship",
        description: "Creator of RoboNeT (open-source robotics learning repository); Teaching Assistant for IoT & Robotics.",
        icon: "book"
      },
      {
        id: 4,
        title: "Global Recognition",
        description: "19 university admission offers across USA & Switzerland; executive leadership across 100+ members.",
        icon: "award"
      }
    ],
    timeline_link_text: "View my timeline to learn more about my unique journey",
    contact_button_text: "Get in Touch"
  },
  projects: [
    // Software
    {
      category: "Software",
      name: "UIU Robotics",
      image: "/assets/uiu_robotics.png",
      github: "https://github.com/aranya170/UIURC.git",
      website: "https://robotics.uiu.ac.bd/",
      tags: ["Tailwind CSS", "Laravel", "UI/UX Design", "PHP"],
      sort_order: 1,
      files: [
        {
          name: "UIU Robotics Website",
          type: "notebook",
          content: "https://robotics.uiu.ac.bd/",
          language: "robotics.uiu.ac.bd",
          sort_order: 1
        },
        {
          name: "README.md",
          type: "info",
          content: "Initiated, designed, and implemented the official full-stack website for UIU Robotics. I handled the entire lifecycle from initial prototyping to final deployment. The platform serves as a central hub for club members, showcasing robotics projects, managing events, and fostering innovation within the university community.",
          language: "markdown",
          sort_order: 2
        }
      ]
    },
    {
      category: "Software",
      name: "Dacca Delights",
      image: "/assets/daccadelights.png",
      github: "https://github.com/aranya170/DaccaDelights.git",
      website: "https://daccadelights.com/",
      tags: ["MySQL", "Tailwind CSS", "PHP"],
      sort_order: 2,
      files: [
        {
          name: "Dacca Delights Website",
          type: "notebook",
          content: "https://daccadelights.com/",
          language: "daccadelights.com",
          sort_order: 1
        },
        {
          name: "README.md",
          type: "info",
          content: "A full-stack e-commerce platform developed for a bakery shop. This freelance project involved designing an intuitive frontend and a robust backend to manage orders, inventory, and customer interactions. Hosted at daccadelights.com, the site provides a seamless shopping experience for high-quality baked goods.",
          language: "markdown",
          sort_order: 2
        }
      ]
    },
    {
      category: "Software",
      name: "DirectEdge",
      image: "/assets/directedge.png",
      github: "https://github.com/aranya170/DirectEdge",
      tags: ["Computer Vision", "Deep Learning", "Python", "Tailwind CSS", "React"],
      sort_order: 3,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "DirectEdge revolutionizes sourcing by connecting businesses directly with farmers, streamlining distribution for fresher, sustainable goods. As an all-in-one solution, we manage procurement through delivery via a transparent supply chain. We’ve integrated a compact, user-friendly POS and ERP system alongside advanced demand forecasting to optimize efficiency. By eliminating intermediaries, we ensure competitive pricing for businesses and fair compensation for farmers. Join us in building a smarter, data-driven, and sustainable food system.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },
    {
      category: "Software",
      name: "Kairos",
      image: "/assets/kairos.png",
      github: "https://github.com/aranya170/Kairos",
      tags: ["MySQL", "Bootstrap", "PHP", "JavaScript"],
      sort_order: 4,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Kairos functions as a supportive system meticulously crafted to facilitate personal growth and development. Our primary objective revolves around fostering the cultivation of positive habits, furnishing users with effective tools for life tracking, and aiding in the eradication of detrimental behaviors, notably procrastination.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },
    {
      category: "Software",
      name: "Peer Pie",
      image: "/assets/peerpie.png",
      github: "https://github.com/aranya170/Peer_Pie/tree/main",
      tags: ["JAVA", "MySQL", "CSS"],
      sort_order: 5,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Connecting learners, expanding horizons. Peer Pie is a platform designed to connect students with peers who share similar interests, enabling them to collaborate on projects, share knowledge, and learn from each other. The platform aims to foster a community of learners who can support and motivate one another in their academic journeys.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },

    // Research
    {
      category: "Research",
      name: "RoboNeT - Robotics, Networking, IoT & Data Communication Repository",
      image: "/assets/research.png",
      github: "https://github.com/FahimHafiz/RoboNeT-Robotics-Network-IoT-Repository.git",
      tags: ["Autonomus", "Robotics", "IoT", "Data Communication"],
      sort_order: 1,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "I led the development of RoboNeT as its highest contributor and Undergraduate Assistant of United International University, establishing Bangladesh’s first-ever open-source repository dedicated to robotics learning. This comprehensive platform centralizes resources for robotics, networking, IoT, and data communication to empower the country's next generation of engineers and researchers.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "RoboNeT-Robotics-Network-IoT-Repository",
          type: "notebook",
          content: "https://prettyhub.vercel.app/FahimHafiz/RoboNeT-Robotics-Network-IoT-Repository",
          language: "Robotics, Networking, IoT & Data Communication",
          sort_order: 2
        }
      ]
    },
    {
      category: "Research",
      name: "Identification and Classification of the Dark Triad Personality Traits Using Machine Learning",
      image: "/assets/DarkTriads.png",
      tags: ["Pandas", "Numpy", "Matplotlib"],
      sort_order: 2,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "This project utilizes machine learning algorithms to analyze behavioral data and psychometric patterns for the automated detection of Machiavellianism, Narcissism, and Psychopathy. By identifying these 'Dark Triad' traits, the system provides a data-driven framework for personality classification in clinical, organizational, or forensic contexts.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "FinalUpdate.ipynb",
          type: "notebook",
          content: "https://nbviewer.org/github/aranya170/Dark-Traid-Personality/blob/main/FinalUpdate.ipynb",
          language: "python",
          sort_order: 2
        }
      ]
    },
    {
      category: "Research",
      name: "Adaptive Weighted Ensemble Learning for Mixed Waste Classification",
      image: "/assets/research2.jpg",
      tags: ["Pandas", "Latex", "Matplotlib"],
      sort_order: 3,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "This project implements an adaptive ensemble framework that dynamically adjusts the influence of multiple deep learning models to improve classification accuracy across diverse waste streams. By prioritizing the most reliable sub-models for specific materials, the system achieves superior robustness in identifying recyclables and hazardous items within complex, mixed environments.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },

    // Hardware
    {
      category: "Hardware",
      name: "Delta Arm",
      image: "/assets/Hardware5.jpg",
      video: "/assets/hardware_videos/Delta Arm.mp4",
      tags: ["Arduino", "Inverse Kinematics", "Parallel Robotics", "3D Printing"],
      sort_order: 1,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Developed a high-speed Delta parallel robot designed for rapid assembly and precision sorting. Utilizing a parallel kinematic geometry, I synchronized three motors to control spatial coordinates via complex inverse kinematics. This design ensures the end-effector remains stable and parallel to the work surface, enabling high-acceleration movements and exceptional repeatability.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },
    {
      category: "Hardware",
      name: "Scara Arm",
      image: "/assets/Hardware4.jpeg",
      video: "/assets/hardware_videos/Scara.mp4",
      tags: ["Arduino Nano", "3D Design", "Kinematics"],
      sort_order: 2,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Designed and prototyped a 4-axis SCARA robotic arm utilizing 3D-printed components and an Arduino Nano. The project focuses on high-precision movement for automated pick-and-place tasks. I implemented the kinematics logic to control joint rotations, ensuring smooth trajectories while optimizing the arm’s reach and payload stability.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },
    {
      category: "Hardware",
      name: "4 Wings Drone",
      image: "/assets/Hardware3.jpg",
      video: "",
      tags: ["Arduino Nano", "3D Design", "Brushless Motor"],
      sort_order: 3,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Built a 4-wings quadcopter drone powered by brushless motors and Arduino-based flight stabilization.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },
    {
      category: "Hardware",
      name: "IOT Based Smart Bus Tracking System",
      image: "/assets/Hardware1.png",
      video: "/assets/hardware_videos/Field Bot.mp4",
      github: "https://github.com/aranya170/Shuttle-Bus-Tracking-System",
      tags: ["Arduino", "ESP 32", "LDR", "GPS Module"],
      sort_order: 4,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "This project is a comprehensive Shuttle Bus Tracking and Monitoring System developed for a university-level IoT and embedded systems project. The system combines multiple sensors and technologies to ensure real-time location tracking, passenger queue monitoring, environmental sensing, and safety alerts for shuttle operations on campus.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },
    {
      category: "Hardware",
      name: "Smart Voting Machine",
      image: "/assets/Hardware2.jpg",
      tags: ["Arduino", "i2C", "Buzzer", "Laser"],
      sort_order: 5,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Designed and fabricated an IoT-enabled smart voting machine ensuring biometric authentication, tamper-evident vote logging, and real-time tabulation using embedded microcontrollers.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },

    // SQL Projects
    {
      category: "SQL",
      name: "Cyclistic Bike Share Analysis",
      image: "/assets/cyclistic.png",
      medium: "https://medium.com/@rafsanahmed2828/from-data-to-insights-googles-cyclistic-case-study-04fb362c2d0d",
      github: "https://github.com/rafsanahmed28/Cyclistic-Case-Study",
      dataset: "https://divvy-tripdata.s3.amazonaws.com/index.html",
      tags: ["MySQL", "Excel", "Tableau", "Data Visualization", "Data Analysis"],
      sort_order: 1,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Cyclistic is a fictional bike-share company in Chicago. The goal of this project is to analyze the bike usage data to understand how different types of users (casual vs. annual members) use the service and to provide insights for marketing strategies. Learn more about my approach, analysis, and findings in the Medium article linked below.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "cleaning.sql",
          type: "code",
          content: `-- Cyclistic Data Cleaning
SELECT * FROM cyclistic.cyclisticmain;
DELETE FROM cyclistic.cyclisticmain WHERE length(ride_id) != 16;
CREATE TABLE cyclisticclean AS SELECT * FROM cyclisticmain;`,
          language: "sql",
          sort_order: 2
        },
        {
          name: "querying.sql",
          type: "code",
          content: `-- Cyclistic Analysis & Exploration
SELECT member_casual, COUNT(*) as total_rides, AVG(TIMESTAMPDIFF(MINUTE, started_at, ended_at)) as avg_duration_mins
FROM cyclisticclean
GROUP BY member_casual;`,
          language: "sql",
          sort_order: 3
        },
        {
          name: "viz_query.sql",
          type: "code",
          content: `-- Cyclistic Visualization Queries
SELECT start_station_name, COUNT(*) as ride_count, member_casual
FROM cyclisticclean
WHERE start_station_name IS NOT NULL
GROUP BY start_station_name, member_casual
ORDER BY ride_count DESC;`,
          language: "sql",
          sort_order: 4
        }
      ]
    },
    {
      category: "SQL",
      name: "Data Cleaning - NashVille Housing Data",
      image: "/assets/nashville.png",
      github: "https://github.com/rafsanahmed28/Data-Cleaning-MySQL",
      tags: ["MySQL", "Data Cleaning", "Data Transformation"],
      dataset: "http://kaggle.com/datasets/tmthyjames/nashville-housing-data",
      sort_order: 2,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Cleaned and transformed Nashville housing data for analysis, focusing on data integrity and consistency. This project's goal was to go through the important steps of data cleaning and transformation, including removing duplicates, handling missing values, and ensuring data types are correct.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "nasvhille.sql",
          type: "code",
          content: `-- Nashville Housing Data Cleaning
SELECT * FROM nashville.nashdata;
UPDATE nashdata SET SaleDate = STR_TO_DATE(SaleDate, '%M %e, %Y');
ALTER TABLE nashdata ADD COLUMN PropertyCity CHAR(255);`,
          language: "sql",
          sort_order: 2
        }
      ]
    },
    {
      category: "SQL",
      name: "Covid-19 Exploratory Data Analysis",
      image: "/assets/covid19.png",
      github: "https://github.com/rafsanahmed28/Covid-Data-Exploration-Project",
      dataset: "https://ourworldindata.org/covid-deaths",
      tags: ["MySQL", "Excel", "Tableau", "Data Visualization", "Data Analysis"],
      sort_order: 3,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Performed exploratory data analysis on Covid-19 data to find the damage caused by the pandemic in different countries. The project focuses on data transformation, exploratory data analysis and visualization to provide insights into the impact of Covid-19 globally.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "covid19.sql",
          type: "code",
          content: `-- Covid-19 Exploration
SELECT Location, Date, total_cases, total_deaths, (total_deaths/total_cases)*100 AS infection_death_percentage
FROM covidproject.coviddeaths
WHERE Location = 'Canada'
ORDER BY 1,2;`,
          language: "sql",
          sort_order: 2
        }
      ]
    },

    // Python Projects
    {
      category: "Python",
      name: "Movie Correlation Analysis",
      image: "/assets/correlation.png",
      github: "https://github.com/rafsanahmed28/Movie-Correlation---Pandas-NumPy-SNS",
      tags: ["Pandas", "Numpy", "Seaborn", "Matplotlib"],
      dataset: "https://www.kaggle.com/datasets/danielgrijalvas/movies",
      sort_order: 1,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Analyzed movie data to find correlations between different features such as budget, revenue, and ratings using Python libraries like Pandas, NumPy, and Seaborn. The project includes data cleaning, transformation, and visualization to uncover insights about the movie industry.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "correlation.ipynb",
          type: "notebook",
          content: "https://nbviewer.org/github/rafsanahmed28/Movie-Correlation---Pandas-NumPy-SNS/blob/main/Finding%20Movie%20Correlation.ipynb?flush_cache=true",
          language: "python",
          sort_order: 2
        }
      ]
    },
    {
      category: "Python",
      name: "Automating Crypto Data using CoinGecko API",
      image: "/assets/crypto.png",
      github: "https://github.com/rafsanahmed28/Automating-Crypto-Data-using-CoinGecko-API",
      tags: ["Pandas", "Seaborn", "Matplotlib"],
      sort_order: 2,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Automated the retrieval of cryptocurrency data using the CoinGecko API and performed analysis using Python libraries pandas, seaborn and matplotlib. This project is meant to showcase the data automation and collection process, which can be used for further analysis or visualization.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "crypto.ipynb",
          type: "notebook",
          content: "https://nbviewer.org/github/rafsanahmed28/Automating-Crypto-Data-using-CoinGecko-API/blob/main/Automating%20Crypto%20-%20CoinGecko%20API.ipynb?flush_cache=true",
          language: "python",
          sort_order: 2
        }
      ]
    },
    {
      category: "Python",
      name: "Amazon Web Scraping",
      image: "/assets/amazon.png",
      github: "https://github.com/rafsanahmed28/Amazon-Web-Scraping",
      tags: ["BeautifulSoup", "Pandas", "Web Scraping", "Email Automation"],
      sort_order: 3,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Scraped product data from Amazon using BeautifulSoup and Pandas. The data is stored in a CSV file and is used for tracking price changes over time. This project also showcases how you can email yourself whenever a product's price drops below a certain threshold.",
          language: "markdown",
          sort_order: 1
        },
        {
          name: "amazon.ipynb",
          type: "notebook",
          content: "https://nbviewer.org/github/rafsanahmed28/Amazon-Web-Scraping/blob/main/Amazon%20Web%20Scraping%20-%20Data%20Project.ipynb?flush_cache=true",
          language: "python",
          sort_order: 2
        }
      ]
    },

    // Tableau Projects
    {
      category: "Tableau",
      name: "Cyclistic Case Study Visualization",
      image: "/assets/kairos.png",
      medium: "https://medium.com/@rafsanahmed2828/from-data-to-insights-googles-cyclistic-case-study-04fb362c2d0d",
      tableau: "https://public.tableau.com/app/profile/rafsan.ahmed8668/viz/GoogleCyclisticCaseStudyVisualization/DashboardMain",
      tags: ["Tableau", "Data Visualization"],
      sort_order: 1,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Designed an interactive Tableau dashboard for the Cyclistic Case Study, visualizing the seasonal trends and usage patterns during different times as well as different routes the users take. The dashboard helps us dive deeper into how the annual users differ from casual users.",
          language: "markdown",
          sort_order: 1
        }
      ]
    },
    {
      category: "Tableau",
      name: "Covid-19 Data Visualization Dashboard",
      image: "/assets/covid19viz.png",
      tableau: "https://public.tableau.com/app/profile/rafsan.ahmed8668/viz/CovidDataVisualizationDashboard-May2024/Dashboard1",
      tags: ["Tableau", "Data Visualization"],
      sort_order: 2,
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Developed a Tableau dashboard to visualize Covid-19 infection data across all the countries around the world. The dashboard also gives an overview of the global death count, continental death count, and a filtered view of percentage population infected by country.",
          language: "markdown",
          sort_order: 1
        }
      ]
    }
  ],
  experiences: [
    {
      company: "United International University",
      role: "Undergraduate Assistant",
      duration: "Feb 2024 - Present",
      location: "Dhaka, Bangladesh",
      sort_order: 1,
      bullets: [
        "Served as an Undergraduate Assistant under Professor Dr. Mohammad Nurul Huda.",
        "Created RoboNeT, the first-ever open-source robotics, networking, IoT & data communication repository in Bangladesh.",
        "Facilitated hands-on labs and mentoring for students in robotics and embedded systems."
      ]
    },
    {
      company: "UIU Robotics Club",
      role: "President",
      duration: "Dec 2024 - Present",
      location: "Dhaka, Bangladesh",
      sort_order: 2,
      bullets: [
        "Led a multidisciplinary organization with 200+ active members building cutting-edge rovers and drones.",
        "Architected and deployed the official club web platform (robotics.uiu.ac.bd).",
        "Represented the university at national and international robotics competitions."
      ]
    },
    {
      company: "Self-Employed",
      role: "Freelance Full-Stack Developer",
      duration: "Jan 2022 - Dec 2024",
      location: "Remote",
      sort_order: 3,
      bullets: [
        "Built custom web apps and e-commerce platforms using Tailwind CSS, PHP, React, and MySQL.",
        "Delivered end-to-end commercial solutions such as Dacca Delights bakery platform."
      ]
    },
    {
      company: "UIU Robotics Club",
      role: "Vice President",
      duration: "Jan 2024 - Dec 2024",
      location: "Dhaka, Bangladesh",
      sort_order: 4,
      bullets: [
        "Coordinated project teams across software, electronics, and mechanical divisions.",
        "Organized high-impact workshops on ROS, Computer Vision, and Microcontrollers."
      ]
    },
    {
      company: "UIU Robotics Club",
      role: "Executive Member",
      duration: "Jan 2023 - Dec 2023",
      location: "Dhaka, Bangladesh",
      sort_order: 5,
      bullets: [
        "Contributed to the hardware and software development of autonomous rovers and drones."
      ]
    }
  ],
  timeline: [
    {
      title: "Early Curiosity",
      description: "Fascinated by computers and RC cars in Class 8, discovering microcontrollers like Arduino and ESP.",
      timeframe: "2015",
      type: "idea",
      sort_order: 1
    },
    {
      title: "Tech Exploration",
      description: "Explored competitive programming, web development, graphics design, and video editing.",
      timeframe: "2015 - 2019",
      type: "career",
      sort_order: 2
    },
    {
      title: "Global Offers & Pivots",
      description: "Received 19 university admission offers across the USA and Switzerland; enrolled at UIU.",
      timeframe: "2020 - 2021",
      type: "education",
      sort_order: 3
    },
    {
      title: "Deep Dive in AI & Robotics",
      description: "Joined UIU Robotics, began publishing research, and focused on Deep Learning.",
      timeframe: "2022 - 2024",
      type: "research",
      sort_order: 4
    },
    {
      title: "President & Lead Researcher",
      description: "Became President of UIU Robotics and Undergraduate Assistant under Dr. Mohammad Nurul Huda.",
      timeframe: "2024 - 2025",
      type: "startup",
      sort_order: 5
    },
    {
      title: "Present & Future Horizons",
      description: "Pursuing higher research in AI, intelligent robotics, and scalable systems.",
      timeframe: "2025 - Present",
      type: "statistics",
      sort_order: 6
    }
  ],
  techStack: [
    { name: "Python", category: "Language", color: "#3776AB", icon_name: "SiPython", sort_order: 1 },
    { name: "C++", category: "Language", color: "#00599C", icon_name: "SiCplusplus", sort_order: 2 },
    { name: "JavaScript", category: "Language", color: "#F7DF1E", icon_name: "SiJavascript", sort_order: 3 },
    { name: "PHP", category: "Language", color: "#777BB4", icon_name: "SiPhp", sort_order: 4 },
    { name: "React", category: "Frontend", color: "#61DAFB", icon_name: "SiReact", sort_order: 5 },
    { name: "Tailwind CSS", category: "Frontend", color: "#06B6D4", icon_name: "SiTailwindcss", sort_order: 6 },
    { name: "Node.js", category: "Backend", color: "#339933", icon_name: "SiNodedotjs", sort_order: 7 },
    { name: "PostgreSQL", category: "Database", color: "#4169E1", icon_name: "SiPostgresql", sort_order: 8 },
    { name: "MySQL", category: "Database", color: "#4479A1", icon_name: "SiMysql", sort_order: 9 },
    { name: "PyTorch", category: "AI/ML", color: "#EE4C2C", icon_name: "SiPytorch", sort_order: 10 },
    { name: "TensorFlow", category: "AI/ML", color: "#FF6F00", icon_name: "SiTensorflow", sort_order: 11 },
    { name: "OpenCV", category: "AI/ML", color: "#5C3EE8", icon_name: "SiOpencv", sort_order: 12 },
    { name: "Pandas", category: "AI/ML", color: "#150458", icon_name: "SiPandas", sort_order: 13 },
    { name: "NumPy", category: "AI/ML", color: "#013243", icon_name: "SiNumpy", sort_order: 14 },
    { name: "Scikit-Learn", category: "AI/ML", color: "#F7931E", icon_name: "SiScikitlearn", sort_order: 15 },
    { name: "ROS", category: "Robotics", color: "#22314E", icon_name: "SiRos", sort_order: 16 },
    { name: "Arduino", category: "Robotics", color: "#00979D", icon_name: "SiArduino", sort_order: 17 },
    { name: "Raspberry Pi", category: "Robotics", color: "#A22846", icon_name: "SiRaspberrypi", sort_order: 18 },
    { name: "Git", category: "Tools", color: "#F05032", icon_name: "SiGit", sort_order: 19 },
    { name: "GitHub", category: "Tools", color: "#181717", icon_name: "SiGithub", sort_order: 20 },
    { name: "Docker", category: "Tools", color: "#2496ED", icon_name: "SiDocker", sort_order: 21 },
    { name: "Tableau", category: "Data Viz", color: "#E97627", icon_name: "SiTableau", sort_order: 22 }
  ],
  settings: {
    socials: {
      github: "https://github.com/aranya170",
      linkedin: "https://www.linkedin.com/in/aranya170",
      email: "aranya.akd@gmail.com"
    },
    footer: {
      copyrightText: "© {year} Aranya Kishor Das. All rights reserved."
    },
    theme: {
      accentColor: "#64d98a",
      enable3DHero: true
    }
  }
};

module.exports = seedData;
