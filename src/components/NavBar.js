import React, { Component } from "react";
import "../styles/NavBar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      scrolled: false,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this.toggleMobile = this.toggleMobile.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    document.body.style.overflow = "";
  }

  handleScroll() {
    this.setState({ scrolled: window.scrollY > 20 });
  }

  toggleMobile() {
    this.setState((s) => {
      const nextState = !s.mobileOpen;
      if (nextState) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return { mobileOpen: nextState };
    });
  }

  closeMenu() {
    document.body.style.overflow = "";
    this.setState({ mobileOpen: false });
  }

  render() {
    const { scrolled, mobileOpen } = this.state;
    const navItems = [
      { href: "#projects",   label: "Projects"   },
      { href: "#about",      label: "About"      },
      { href: "#experience", label: "Experience" },
      { href: "#timeline",   label: "Timeline"   },
      { href: "#tech-stack", label: "Tech Stack" },
      { href: "#contact",    label: "Contact"    },
    ];

    return (
      <>
        <nav className={`site-nav${scrolled ? " scrolled" : ""}${mobileOpen ? " menu-open" : ""}`}>
          <div className="nav-inner">
            {/* Brand Logo & Name */}
            <a href="#" className="nav-logo" onClick={this.closeMenu}>
              <img
                src="/icon.png"
                alt="Aranya Kishor Das"
                className="nav-logo-img"
              />
              <span className="nav-logo-text">Aranya Kishor Das</span>
            </a>

            {/* Desktop Navigation Links */}
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.href} className="nav-item">
                  <a href={item.href} className="nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile Hamburger */}
            <button
              className={`nav-hamburger${mobileOpen ? " open" : ""}`}
              onClick={this.toggleMobile}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              type="button"
            >
              <span className="ham-line ham-top" />
              <span className="ham-line ham-mid" />
              <span className="ham-line ham-bot" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-overlay ${mobileOpen ? "active" : ""}`} onClick={this.closeMenu}>
          <div className="mobile-overlay-backdrop" />
          <ul className="mobile-links" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item, idx) => (
              <li
                key={item.href}
                className="mobile-item"
                style={{ animationDelay: `${0.05 + idx * 0.04}s` }}
              >
                <a href={item.href} className="mobile-link" onClick={this.closeMenu}>
                  <span className="mobile-link-num">0{idx + 1}</span>
                  <span className="mobile-link-txt">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

export default NavBar;
