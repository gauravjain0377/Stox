import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const navbarRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Interpolate style values for smooth resizing
  // scrollY 0-60px: interpolate from expanded to collapsed
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const progress = clamp(scrollY / 60, 0, 1);
  const width = `${1200 - (780 * progress)}px`; // 1200px to 420px
  const paddingX = 40 - (22 * progress); // 40px to 18px
  const paddingY = 18 - (10 * progress); // 18px to 8px
  const borderRadius = 32 - (8 * progress); // 32px to 24px
  const top = 32 - (20 * progress); // 32px to 12px
  const logoHeight = 42 - (12 * progress); // 42px to 30px

  return (
    <nav
      ref={navbarRef}
      className="custom-navbar"
      style={{
        width,
        maxWidth: width,
        padding: `${paddingY}px ${paddingX}px`,
        borderRadius: `${borderRadius}px`,
        top: `${top}px`,
        margin: '0 auto',
        background: '#fafbfc',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
        position: 'fixed',
        zIndex: 2000,
        backdropFilter: 'blur(12px) saturate(180%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        left: 0,
        right: 0,
      }}
    >
      <div className="navbar-logo modern-logo-area">
        <Link to="/">
          <img src="media/images/logo.png" alt="Logo" className="modern-logo-img" style={{ height: `${logoHeight}px`, transition: 'height 0.5s cubic-bezier(.4,2,.6,1)' }} />
        </Link>
      </div>
      <div className="navbar-menu modern-navbar-menu">
        <ul className={menuOpen ? "open" : ""}>
          <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
          <li><Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>Pricing</Link></li>
          <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link></li>
          <li><Link to="/support" className={location.pathname === '/support' ? 'active' : ''}>Support</Link></li>
        </ul>
      </div>
      <div className="navbar-actions modern-navbar-actions">
        <Link to="/login" className={`login-link${location.pathname === '/login' ? ' active' : ''}`}>Login</Link>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} aria-label="Toggle menu" onClick={() => setMenuOpen(m => !m)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
