import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaInfoCircle, FaDollarSign, FaHeadset, FaCalculator } from "react-icons/fa";
import './Navbar.css';

function Navbar() {
  const navbarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Debug: Log menu state changes
  useEffect(() => {
    console.log('Menu state changed to:', menuOpen);
  }, [menuOpen]);

  // Close menu when clicking outside and prevent body scroll when open
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav
      ref={navbarRef}
      className="custom-navbar"
      style={{
        width: '100%',
        maxWidth: '100%',
        margin: '0',
        background: '#fafafa',
        boxShadow: 'none',
        borderRadius: '0',
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'visible',
        zIndex: 2000,
      }}
    >
      <div className="navbar-logo modern-logo-area">
        <Link to="/">
          <img src="media/images/logo.png" alt="Logo" className="modern-logo-img" style={{ height: '60px' }} />
        </Link>
      </div>
      <div 
        className={`navbar-menu modern-navbar-menu ${menuOpen ? "open" : ""}`}
        style={{
          overflow: 'visible',
          position: 'relative',
        }}
      >
        <ul>
          <li>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              <FaInfoCircle style={{ fontSize: '18px', opacity: 0.8 }} />
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              <FaDollarSign style={{ fontSize: '18px', opacity: 0.8 }} />
              <span>Pricing</span>
            </Link>
          </li>
          <li>
            <Link to="/support" className={location.pathname === '/support' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              <FaHeadset style={{ fontSize: '18px', opacity: 0.8 }} />
              <span>Support</span>
            </Link>
          </li>
          <li>
            <Link to="/utilities" className={location.pathname === '/utilities' ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              <FaCalculator style={{ fontSize: '18px', opacity: 0.8 }} />
              <span>Utilities</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-actions modern-navbar-actions">
        <Link to="/login" className={`open-account-btn${location.pathname === '/login' ? ' active' : ''}`}>Login</Link>
        <button 
          className={`hamburger${menuOpen ? ' open' : ''}`} 
          aria-label="Toggle menu" 
          aria-expanded={menuOpen}
          onMouseEnter={() => {
            // Open on hover for better UX
            if (window.innerWidth <= 900) {
              setMenuOpen(true);
            }
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked! Current state:', menuOpen);
            const newState = !menuOpen;
            console.log('Setting menu to:', newState);
            setMenuOpen(newState);
          }}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
