import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero-section py-8">
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-lines">
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
          <div className="hero-line" />
        </div>
        <button className="hero-badge">Zero Hidden Charges <span>&rarr;</span></button>
        <h1 className="hero-title">Start Your Investment<br />Journey in Indian Markets</h1>
        <p className="hero-desc">Trade stocks, mutual funds, and IPOs with zero hidden charges. Join 2M+ Indian investors building wealth through smart investing.</p>
        <div className="hero-stats">
          <span>SEBI Registered</span>
          <span>NSE/BSE Member</span>
          <span>2M+ Users</span>
          <span>&#8377;0 AMC Forever</span>
        </div>
        <a href="/signup" className="hero-open-account-btn">Open Account</a>
      </div>
    </section>
  );
}

export default Hero;