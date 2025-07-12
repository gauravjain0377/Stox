import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

function Navbar() {
  const navbarRef = useRef(null);
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setShrunk(true);
      } else {
        setShrunk(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav ref={navbarRef} className={`custom-navbar${shrunk ? ' shrunk' : ''}`}>
      <div className="navbar-logo">
        <Link to="/">
          <img src="media/images/logo.png" alt="Logo" />
        </Link>
      </div>
      <div className="navbar-menu">
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/support">Support</Link></li>
        </ul>
      </div>
      <div className="navbar-actions">
        <Link to="/login" className="login-link">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
