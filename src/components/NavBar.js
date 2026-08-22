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
    this.setState({ scrolled: window.scrollY > 24 });
  }

  toggleMobile() {
    this.setState((s) => ({ mobileOpen: !s.mobileOpen }));
  }

  closeMenu() {
    this.setState({ mobileOpen: false });
  }

  render() {
    const { scrolled, mobileOpen } = this.state;
    const links = [
      { href: "#about",      label: "About"      },
      { href: "#projects",   label: "Projects"   },
      { href: "#experience", label: "Experience" },
      { href: "#timeline",   label: "Timeline"   },
      { href: "#contact",    label: "Contact"    },
    ];

    return (
      <>
        <nav className={`site-nav${scrolled ? " scrolled" : ""}`}>
          <div className="nav-inner">
            {/* Logo */}
            <a href="#" className="nav-logo" onClick={this.closeMenu}>
              <img
                src="/assets/aranya-kishor-das-logo.png"
                alt="Aranya Kishor Das"
                width="32"
                height="32"
              />
            </a>

            {/* Desktop links */}
            <ul className="nav-links">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="nav-link">{l.label}</a>
                </li>
              ))}
            </ul>

            {/* Hamburger */}
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

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="mobile-overlay" onClick={this.closeMenu}>
            <ul className="mobile-links" onClick={(e) => e.stopPropagation()}>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="mobile-link" onClick={this.closeMenu}>
                    {l.label}
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
