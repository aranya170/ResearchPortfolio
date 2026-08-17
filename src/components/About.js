import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Icon from "./Icons";
import "../styles/About.css";
import { usePortfolio } from "../context/PortfolioContext";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { portfolio } = usePortfolio();
  const aboutData = portfolio?.about || {
    title: "About Me",
    profile_image: "/assets/Aranya Kishor Das.png",
    paragraphs: [
      `Hi, my name is Aranya and I enjoy solving puzzles, building things, and exploring technology. My journey began in 2015 when I became fascinated by <span class="highlight">remote-controlled cars</span> and microcontrollers like <span class="highlight">Arduino and ESP</span>. That childhood curiosity sparked a lifelong passion for electronics and robotics.`,
      `From 2015 to 2019, I explored the vast fields of computer science, graphics design, and software engineering. During the pandemic, I deep-dived into <span class="highlight">Web Development and Figma Design</span>. My academic journey eventually led me to United International University, after receiving 19 admission offers from universities in the <span class="highlight">USA and Switzerland</span>.`,
      `In 2024, I pivoted my focus toward <span class="highlight">Deep Learning and Artificial Intelligence</span>. Today, I serve as an Undergraduate Research Assistant at UIU, a Teaching Assistant for IoT and Robotics, and the <span class="highlight">President of the UIU Robotics Club</span>, where I continue to push the boundaries of intelligent systems.`,
      `Outside of work, I love playing video games. I'm also into aesthetic interior designs and I love hoarding cool tech products.`
    ],
    timeline_link_text: "View my timeline to learn more about my unique journey",
    contact_button_text: "Get in Touch"
  };

  const aboutRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-title",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".about-flex-container > *",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-content",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, aboutRef);

    return () => ctx.revert();
  }, [aboutData]);

  const paragraphs = Array.isArray(aboutData.paragraphs) ? aboutData.paragraphs : [];

  return (
    <section id="about" ref={aboutRef}>
      <div className="about-content">
        <div className="about-flex-container">
          <div className="about-image-container">
            <img 
              src={aboutData.profile_image || "/assets/Aranya Kishor Das.png"} 
              alt="Aranya Kishor Das" 
              className="about-profile-image"
            />
          </div>
          
          <div className="about-text-content">
            <div className="section-header">
              <span className="section-title about-title">{aboutData.title || "About Me"}</span>
            </div>

            <div className="about-description">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: para }}
                />
              ))}
            </div>

            <p className="about-timeline-link">
              <a href="#timeline">
                <span role="img" aria-label="timeline"></span>
                {aboutData.timeline_link_text || "View my timeline to learn more about my unique journey"}{" "}
                <span className="about-timeline-highlight">unique journey</span>{" "}
                &rarr;
              </a>
            </p>
            <div className="about-actions">
              <a href="#contact" className="resume-button btn-effect">
                {aboutData.contact_button_text || "Get in Touch"} <Icon name="Mail" className="button-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
