import React from "react";
import './Hero.css'; // Import the CSS file
import { Link } from 'react-router-dom';
import ChargesTable from './ChargesTable';

const pricingOptions = [
  {
    title: "Free Equity Delivery",
    price: 0,
    description: "All equity delivery investments (NSE, BSE) are absolutely free — ₹0 brokerage.",
    cardType: "free",
    badge: false,
  },
  {
    title: "Intraday & F&O Trades",
    price: 20,
    description: "Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity.",
    cardType: "paid",
    badge: true,
  },
  {
    title: "Free Direct MF",
    price: 0,
    description: "All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.",
    cardType: "free",
    badge: false,
  },
];

function Hero() {
  return (
    <section className="pricing-hero">
      <div className="pricing-header">
        <div>
          <h1 className="pricing-title">Pricing</h1>
          <p className="pricing-subtitle">
            Free equity investments and flat <span className="pricing-accent">₹20</span> intraday and F&O trades.
          </p>
        </div>
        <Link to="/signup" className="pricing-cta">
          Start Investing
        </Link>
      </div>
      
      <div className="pricing-cards">
        {pricingOptions.map((option, idx) => (
          <div
            key={idx}
            className={`pricing-card pricing-card--${option.cardType}`}
          >
            {option.badge && (
              <div className="pricing-badge">
                Most Popular
              </div>
            )}
            
            <div className="pricing-price-container">
              <span className="pricing-currency">₹</span>
              <span className="pricing-amount">
                {option.price}
              </span>
            </div>
            
            <h3 className="pricing-card-title">
              {option.title}
            </h3>
            
            <p className="pricing-card-description">
              {option.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="pricing-bottom">
        <h2 className="pricing-bottom-title">
          Zero Fixed Charges, Zero Hidden Charges
        </h2>
        <p className="pricing-bottom-description">
          Transparent pricing designed for every Indian investor. No surprises, just simple and fair charges.
        </p>
      </div>
    </section>
  );
}

export default Hero;