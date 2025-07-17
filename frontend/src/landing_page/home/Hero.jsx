// Hero.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiCheckCircle, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi';
import './Hero.css';

const portfolioData = [
  { name: 'TCS', company: 'Tata Consultancy Services', price: '2,847', change: '+1.2%', trend: 'up' },
  { name: 'Infosys', company: 'Infosys Limited', price: '1,456', change: '-0.8%', trend: 'down' },
  { name: 'Reliance', company: 'Reliance Industries', price: '2,234', change: '+2.1%', trend: 'up' },
];

function Hero() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true,
    });
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg-lines" />
      <div className="hero-content" data-aos="fade-up">
        <button className="hero-badge">
          Zero Hidden Charges <span>&rarr;</span>
        </button>
        <h1 className="hero-title">
          Start Your Investment<br />Journey in Indian Markets
        </h1>
        <p className="hero-desc">
          Trade stocks, mutual funds, and IPOs with zero hidden charges. Join 2M+ Indian investors building wealth through smart investing.
        </p>
        <div className="hero-stats">
          <span><FiCheckCircle /> SEBI Registered</span>
          <span><FiTrendingUp /> NSE/BSE Member</span>
          <span><FiUsers /> 2M+ Users</span>
          <span><FiZap /> ₹0 AMC Forever</span>
        </div>
        <div className="hero-buttons-wrapper">
          <a href="/register" className="hero-btn-primary">Open Free Demat Account</a>
          <a href="/markets" className="hero-btn-secondary">Explore Markets</a>
        </div>
      </div>

      <div className="hero-portfolio-preview" data-aos="fade-up" data-aos-delay="200">
        <div className="portfolio-header">
          <h3>Your Portfolio</h3>
          <span className="portfolio-gain">+₹12,450 (2.3%)</span>
        </div>
        <div className="portfolio-grid">
          {portfolioData.map(stock => (
            <div key={stock.name} className="portfolio-stock-item">
              <div className="stock-info">
                <p className="stock-name">{stock.name}</p>
                <p className="stock-company">{stock.company}</p>
              </div>
              <div className="stock-price-info">
                <p className="stock-price">₹{stock.price}</p>
                <p className={`stock-change ${stock.trend}`}>{stock.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;