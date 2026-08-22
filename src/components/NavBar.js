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
  }

  handleScroll() {
    this.setState({ scrolled: window.scrollY > 20 });
  }

  toggleMobile() {
    this.setState((s) => ({ mobileOpen: !s.mobileOpen }));
  }

  closeMenu() {
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
        <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
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
              aria-label="Toggle menu"
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="mobile-overlay" onClick={this.closeMenu}>
            <ul className="mobile-links" onClick={(e) => e.stopPropagation()}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="mobile-link" onClick={this.closeMenu}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
}

export default NavBar;
