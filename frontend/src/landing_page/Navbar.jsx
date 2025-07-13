import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const navbarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      ref={navbarRef}
      className="custom-navbar"
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0',
        background: 'transparent',
        boxShadow: 'none',
        borderRadius: '0',
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'static',
      }}
    >
      <div className="navbar-logo modern-logo-area">
        <Link to="/">
          <img src="media/images/logo.png" alt="Logo" className="modern-logo-img" style={{ height: '42px' }} />
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
        <Link to="/login" className={`open-account-btn${location.pathname === '/login' ? ' active' : ''}`}>Login</Link>
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
