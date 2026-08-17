import Code from "./codes/code";

const ProjectList = {
  Software: [
    {
      name: "UIU Robotics",
      image: "/assets/uiu_robotics.png",
      github: "https://github.com/aranya170/UIURC.git",
      website: "https://robotics.uiu.ac.bd/",
      tags: ["Tailwind CSS", "Laravel", "UI/UX Design", "PHP"],
      files: [
        {
          name: "UIU Robotics Website",
          type: "notebook",
          content: "https://robotics.uiu.ac.bd/",
          language: "robotics.uiu.ac.bd",
        },
        {
          name: "README.md",
          type: "info",
          content:
            "Initiated, designed, and implemented the official full-stack website for UIU Robotics. I handled the entire lifecycle from initial prototyping to final deployment. The platform serves as a central hub for club members, showcasing robotics projects, managing events, and fostering innovation within the university community.",
        },
      ],
    },
    {
      name: "Dacca Delights",
      image: "/assets/daccadelights.png",
      github: "https://github.com/aranya170/DaccaDelights.git",
      website: "https://daccadelights.com/",
      tags: ["MySQL", "Tailwind CSS", "PHP"],
      files: [
        {
          name: "Dacca Delights Website",
          type: "notebook",
          content: "https://daccadelights.com/",
          language: "daccadelights.com",
        },
        {
          name: "README.md",
          type: "info",
          content:
            "A full-stack e-commerce platform developed for a bakery shop. This freelance project involved designing an intuitive frontend and a robust backend to manage orders, inventory, and customer interactions. Hosted at daccadelights.com, the site provides a seamless shopping experience for high-quality baked goods.",
        },
      ],
    },
    {
      name: "DirectEdge",
      image: "/assets/directedge.png",
      github: "https://github.com/aranya170/DirectEdge",
      tags: [
        "Computer Vision",
        "Deep Learning",
        "Python",
        "Tailwind CSS",
        "React",
      ],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "DirectEdge revolutionizes sourcing by connecting businesses directly with farmers, streamlining distribution for fresher, sustainable goods. As an all-in-one solution, we manage procurement through delivery via a transparent supply chain. We’ve integrated a compact, user-friendly POS and ERP system alongside advanced demand forecasting to optimize efficiency. By eliminating intermediaries, we ensure competitive pricing for businesses and fair compensation for farmers. Join us in building a smarter, data-driven, and sustainable food system.",
        },
      ],
    },
    {
      name: "Kairos",
      image: "/assets/kairos.png",
      github: "https://github.com/aranya170/Kairos",
      tags: ["MySQL", "Bootstrap", "PHP", "JavaScript"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Kairos functions as a supportive system meticulously crafted to facilitate personal growth and development. Our primary objective revolves around fostering the cultivation of positive habits, furnishing users with effective tools for life tracking, and aiding in the eradication of detrimental behaviors, notably procrastination.",
        },
      ],
    },
    {
      name: "Peer Pie",
      image: "/assets/peerpie.png",
      github: "https://github.com/aranya170/Peer_Pie/tree/main",
      tags: ["JAVA", "MySQL", "CSS"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Connecting learners, expanding horizons. Peer Pie is a platform designed to connect students with peers who share similar interests, enabling them to collaborate on projects, share knowledge, and learn from each other. The platform aims to foster a community of learners who can support and motivate one another in their academic journeys.",
        },
      ],
    },
  ],
  Research: [
    {
      name: "RoboNeT - Robotics, Networking, IoT & Data Communication Repository",
      image: "/assets/research.png",
      github: "https://github.com/FahimHafiz/RoboNeT-Robotics-Network-IoT-Repository.git",
      tags: ["Autonomus", "Robotics", "IoT", "Data Communication"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "I led the development of RoboNeT as its highest contributor and Undergraduate Assistant of United International University, establishing Bangladesh’s first-ever open-source repository dedicated to robotics learning. This comprehensive platform centralizes resources for robotics, networking, IoT, and data communication to empower the country's next generation of engineers and researchers.",
        },
        {
          name: "RoboNeT-Robotics-Network-IoT-Repository",
          type: "notebook",
          content: "https://prettyhub.vercel.app/FahimHafiz/RoboNeT-Robotics-Network-IoT-Repository",
          language: "Robotics, Networking, IoT & Data Communication",
        },
      ],
    },
    {
      name: "Identification and Classification of the Dark Triad Personality Traits Using Machine Learning",
      image: "/assets/DarkTriads.png",
      tags: ["Pandas", "Numpy", "Matplotlib"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "This project utilizes machine learning algorithms to analyze behavioral data and psychometric patterns for the automated detection of Machiavellianism, Narcissism, and Psychopathy. By identifying these 'Dark Triad' traits, the system provides a data-driven framework for personality classification in clinical, organizational, or forensic contexts.",
        },
        {
          name: "FinalUpdate.ipynb",
          type: "notebook",
          content: "https://nbviewer.org/github/aranya170/Dark-Traid-Personality/blob/main/FinalUpdate.ipynb",
          language: "python",
        },
      ],
    },
    {
      name: "Adaptive Weighted Ensemble Learning for Mixed Waste Classification",
      image: "/assets/research2.jpg",
      tags: ["Pandas", "Latex", "Matplotlib"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "This project implements an adaptive ensemble framework that dynamically adjusts the influence of multiple deep learning models to improve classification accuracy across diverse waste streams. By prioritizing the most reliable sub-models for specific materials, the system achieves superior robustness in identifying recyclables and hazardous items within complex, mixed environments.",
        },
      ],
    },
  ],
  Hardware: [
    {
      name: "Delta Arm",
      image: "/assets/Hardware5.jpg",
      tags: ["Arduino", "Inverse Kinematics", "Parallel Robotics", "3D Printing"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Developed a high-speed Delta parallel robot designed for rapid assembly and precision sorting. Utilizing a parallel kinematic geometry, I synchronized three motors to control spatial coordinates via complex inverse kinematics. This design ensures the end-effector remains stable and parallel to the work surface, enabling high-acceleration movements and exceptional repeatability.",
        },
      ],
    },
    {
      name: "Scara Arm",
      image: "/assets/Hardware4.jpeg",
      tags: ["Arduino Nano", "3D Design", "Kinematics"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Designed and prototyped a 4-axis SCARA robotic arm utilizing 3D-printed components and an Arduino Nano. The project focuses on high-precision movement for automated pick-and-place tasks. I implemented the kinematics logic to control joint rotations, ensuring smooth trajectories while optimizing the arm’s reach and payload stability.",
        },
      ],
    },
    {
      name: "4 Wings Drone",
      image: "/assets/Hardware3.jpg",
      tags: ["Arduino Nano", "3D Design", "Brushless Motor"],
      files: [
        {
          name: "README.md",
          type: "info",
          content: "Built a 4-wings quadcopter drone powered by brushless motors and Arduino-based flight stabilization.",
        },
      ],
    },
    {
      name: "IOT Based Smart Bus Tracking System",
      image: "/assets/Hardware1.png",
      github: "https://github.com/aranya170/Shuttle-Bus-Tracking-System",
      tags: ["Arduino", "ESP 32", "LDR", "GPS Module"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "This project is a comprehensive Shuttle Bus Tracking and Monitoring System developed for a university-level IoT and embedded systems project. The system combines multiple sensors and technologies to ensure real-time location tracking, passenger queue monitoring, environmental sensing, and safety alerts for shuttle operations on campus.",
        },
      ],
    },
    {
      name: "Smart Voting Machine",
      image: "/assets/Hardware2.jpg",
      tags: ["Arduino", "i2C", "Buzzer", "Laser"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Designed and fabricated an IoT-enabled smart voting machine ensuring biometric authentication, tamper-evident vote logging, and real-time tabulation using embedded microcontrollers.",
        },
      ],
    },
  ],
  SQL: [
    {
      name: "Cyclistic Bike Share Analysis",
      image: "/assets/cyclistic.png",
      medium:
        "https://medium.com/@rafsanahmed2828/from-data-to-insights-googles-cyclistic-case-study-04fb362c2d0d",
      github: "https://github.com/rafsanahmed28/Cyclistic-Case-Study",
      dataset: "https://divvy-tripdata.s3.amazonaws.com/index.html",
      tags: [
        "MySQL",
        "Excel",
        "Tableau",
        "Data Visualization",
        "Data Analysis",
      ],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Cyclistic is a fictional bike-share company in Chicago. The goal of this project is to analyze the bike usage data to understand how different types of users (casual vs. annual members) use the service and to provide insights for marketing strategies. Learn more about my approach, analysis, and findings in the Medium article linked below.",
        },
        {
          name: "cleaning.sql",
          type: "code",
          content: Code("Cyclistic")?.cleaning || "-- Data Cleaning SQL query for Cyclistic",
          language: "sql",
        },
        {
          name: "querying.sql",
          type: "code",
          content: Code("Cyclistic")?.querying || "-- Exploratory SQL query for Cyclistic",
          language: "sql",
        },
        {
          name: "viz_query.sql",
          type: "code",
          content: Code("Cyclistic")?.viz_query || "-- Visualization SQL query for Cyclistic",
          language: "sql",
        },
      ],
    },
    {
      name: "Data Cleaning - NashVille Housing Data",
      image: "/assets/nashville.png",
      github: "https://github.com/rafsanahmed28/Data-Cleaning-MySQL",
      tags: ["MySQL", "Data Cleaning", "Data Transformation"],
      dataset: "http://kaggle.com/datasets/tmthyjames/nashville-housing-data",
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Cleaned and transformed Nashville housing data for analysis, focusing on data integrity and consistency. This project's goal was to go through the important steps of data cleaning and transformation, including removing duplicates, handling missing values, and ensuring data types are correct.",
        },
        {
          name: "nasvhille.sql",
          type: "code",
          content: Code("Nashville") || "-- Nashville housing cleaning SQL",
          language: "sql",
        },
      ],
    },
    {
      name: "Covid-19 Exploratory Data Analysis",
      image: "/assets/covid19.png",
      github: "https://github.com/rafsanahmed28/Covid-Data-Exploration-Project",
      dataset: "https://ourworldindata.org/covid-deaths",
      tags: [
        "MySQL",
        "Excel",
        "Tableau",
        "Data Visualization",
        "Data Analysis",
      ],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Performed exploratory data analysis on Covid-19 data to find the damage caused by the pandemic in different countries. The project focuses on data transformation, exploratory data analysis and visualization to provide insights into the impact of Covid-19 globally.",
        },
        {
          name: "covid19.sql",
          type: "code",
          content: Code("Covid19") || "-- Covid19 exploration SQL",
          language: "sql",
        },
      ],
    },
  ],
  Python: [
    {
      name: "Movie Correlation Analysis",
      image: "/assets/correlation.png",
      github:
        "https://github.com/rafsanahmed28/Movie-Correlation---Pandas-NumPy-SNS",
      tags: ["Pandas", "Numpy", "Seaborn", "Matplotlib"],
      dataset: "https://www.kaggle.com/datasets/danielgrijalvas/movies",
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Analyzed movie data to find correlations between different features such as budget, revenue, and ratings using Python libraries like Pandas, NumPy, and Seaborn. The project includes data cleaning, transformation, and visualization to uncover insights about the movie industry.",
        },
        {
          name: "correlation.ipynb",
          type: "notebook",
          content:
            "https://nbviewer.org/github/rafsanahmed28/Movie-Correlation---Pandas-NumPy-SNS/blob/main/Finding%20Movie%20Correlation.ipynb?flush_cache=true",
          language: "python",
        },
      ],
    },
    {
      name: "Automating Crypto Data using CoinGecko API",
      image: "/assets/crypto.png",
      github:
        "https://github.com/rafsanahmed28/Automating-Crypto-Data-using-CoinGecko-API",
      tags: ["Pandas", "Seaborn", "Matplotlib"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Automated the retrieval of cryptocurrency data using the CoinGecko API and performed analysis using Python libraries pandas, seaborn and matplotlib. This project is meant to showcase the data automation and collection process, which can be used for further analysis or visualization.",
        },
        {
          name: "crypto.ipynb",
          type: "notebook",
          content:
            "https://nbviewer.org/github/rafsanahmed28/Automating-Crypto-Data-using-CoinGecko-API/blob/main/Automating%20Crypto%20-%20CoinGecko%20API.ipynb?flush_cache=true",
          language: "python",
        },
      ],
    },
    {
      name: "Amazon Web Scraping",
      image: "/assets/amazon.png",
      github: "https://github.com/rafsanahmed28/Amazon-Web-Scraping",
      tags: ["BeautifulSoup", "Pandas", "Web Scraping", "Email Automation"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Scraped product data from Amazon using BeautifulSoup and Pandas. The data is stored in a CSV file and is used for tracking price changes over time. This project also showcases how you can email yourself whenever a product's price drops below a certain threshold.",
        },
        {
          name: "amazon.ipynb",
          type: "notebook",
          content:
            "https://nbviewer.org/github/rafsanahmed28/Amazon-Web-Scraping/blob/main/Amazon%20Web%20Scraping%20-%20Data%20Project.ipynb?flush_cache=true",
          language: "python",
        },
      ],
    },
  ],
  Tableau: [
    {
      name: "Cyclistic Case Study Visualization",
      image: "/assets/kairos.png",
      medium:
        "https://medium.com/@rafsanahmed2828/from-data-to-insights-googles-cyclistic-case-study-04fb362c2d0d",
      tableau:
        "https://public.tableau.com/app/profile/rafsan.ahmed8668/viz/GoogleCyclisticCaseStudyVisualization/DashboardMain",
      tags: ["Tableau", "Data Visualization"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Designed an interactive Tableau dashboard for the Cyclistic Case Study, visualizing the seasonal trends and usage patterns during different times as well as different routes the users take. The dashboard helps us dive deeper into how the annual users differ from casual users.",
        },
      ],
    },
    {
      name: "Covid-19 Data Visualization Dashboard",
      image: "/assets/covid19viz.png",
      tableau:
        "https://public.tableau.com/app/profile/rafsan.ahmed8668/viz/CovidDataVisualizationDashboard-May2024/Dashboard1",
      tags: ["Tableau", "Data Visualization"],
      files: [
        {
          name: "README.md",
          type: "info",
          content:
            "Developed a Tableau dashboard to visualize Covid-19 infection data across all the countries around the world. The dashboard also gives an overview of the global death count, continental death count, and a filtered view of percentage population infected by country.",
        },
      ],
    },
  ],
};

export default ProjectList;
