import React, { useState } from "react";
import "../styles/Contact.css";
import { api } from "../services/api";
import { usePortfolio } from "../context/PortfolioContext";
import { FiMail, FiMapPin, FiLinkedin, FiGithub, FiSend, FiCheck } from "react-icons/fi";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const { portfolio } = usePortfolio();
  const socials = portfolio?.settings?.socials || {};
  const yourEmail = socials.email || "aranya.akd@gmail.com";

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const payload = { name, email, message };

    const tryFallback = async () => {
      await fetch(
        "https://script.google.com/macros/s/AKfycbziN-8CZYf_SLoMykwZLQArQzT_vea5BHcKcxH_RQZ5whzCXoeaYuwZbXhw2ablsjhI/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, date: new Date().toLocaleString() }),
        }
      );
    };

    try {
      await api.sendContactMessage(payload);
      setStatus("success");
    } catch {
      try {
        await tryFallback();
        setStatus("success");
      } catch {
        setStatus("error");
      }
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
  };

  return (
    <section id="contact" className="portfolio-section">
      <div className="section-head-bar">
        <div className="section-head-left">
          <div className="section-tagline">Direct Inquiries</div>
          <h2 className="section-heading">Get In Touch</h2>
        </div>
      </div>

      <div className="contact-grid">
        {/* Left: Contact Info */}
        <div className="contact-card-info">
          <h3 className="contact-card-title">Let’s discuss research, robotics, or engineering collaborations.</h3>
          <p className="contact-card-desc">
            Whether you have questions about my published repositories, hardware designs, or want to discuss prospective research roles, feel free to send a message.
          </p>

          <div className="contact-items">
            <div className="c-item">
              <span className="c-icon"><FiMail /></span>
              <div>
                <span className="c-label">Email</span>
                <a href={`mailto:${yourEmail}`} className="c-value">{yourEmail}</a>
              </div>
            </div>

            <div className="c-item">
              <span className="c-icon"><FiMapPin /></span>
              <div>
                <span className="c-label">Location</span>
                <span className="c-value">Dhaka, Bangladesh (UIU Campus)</span>
              </div>
            </div>

            <div className="c-item">
              <span className="c-icon"><FiLinkedin /></span>
              <div>
                <span className="c-label">LinkedIn</span>
                <a
                  href={socials.linkedin || "https://www.linkedin.com/in/aranya170"}
                  target="_blank"
                  rel="noreferrer"
                  className="c-value"
                >
                  linkedin.com/in/aranya170
                </a>
              </div>
            </div>

            <div className="c-item">
              <span className="c-icon"><FiGithub /></span>
              <div>
                <span className="c-label">GitHub</span>
                <a
                  href={socials.github || "https://github.com/aranya170"}
                  target="_blank"
                  rel="noreferrer"
                  className="c-value"
                >
                  github.com/aranya170
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="contact-card-form">
          {status === "success" ? (
            <div className="contact-success-box">
              <div className="success-badge"><FiCheck /></div>
              <h3>Message Delivered</h3>
              <p>Thank you for reaching out. I will review your note and respond promptly.</p>
              <button className="form-reset-btn" onClick={handleReset} type="button">
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-input-form" onSubmit={handleSend}>
              <div className="form-double-row">
                <div className="input-field">
                  <label htmlFor="c-name">Your Name</label>
                  <input
                    id="c-name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="c-email">Your Email</label>
                  <input
                    id="c-email"
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-field">
                <label htmlFor="c-msg">Project Details / Message</label>
                <textarea
                  id="c-msg"
                  rows={5}
                  placeholder="Tell me about your research inquiry or proposal..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {status === "error" && (
                <p className="error-notice">
                  Submission encountered an issue. Please email directly at {yourEmail}.
                </p>
              )}

              <button className="submit-btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send Message"} <FiSend />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
