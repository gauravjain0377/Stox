// Stats.jsx
import React, { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./Stats.css";

// Initial data for stocks - can be fetched from an API
const initialStockData = [
  { name: 'RELIANCE', price: 2847.50, change: '+42.30', percent: '+1.51%', trend: 'up' },
  { name: 'TCS', price: 3965.20, change: '-15.80', percent: '-0.40%', trend: 'down' },
  { name: 'HDFCBANK', price: 1634.75, change: '+28.45', percent: '+1.77%', trend: 'up' },
  { name: 'INFY', price: 1523.90, change: '+12.25', percent: '+0.81%', trend: 'up' }
];

function Stats() {
  const [stocks, setStocks] = useState(initialStockData);

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({ duration: 800, once: true });

    // Simulate real-time price update for the first stock (Reliance)
    const interval = setInterval(() => {
      setStocks(currentStocks => {
        const newStocks = [...currentStocks];
        // Fluctuate the price slightly
        const oldPrice = newStocks[0].price;
        const newPrice = oldPrice + (Math.random() - 0.5) * 5;
        newStocks[0].price = parseFloat(newPrice.toFixed(2));
        return newStocks;
      });
    }, 2000); // Update every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="stats-section">
      <div className="container">
        <h1 className="stats-main-title" data-aos="fade-up">
          A Complete Platform for the Indian Market
        </h1>
        <p className="stats-main-desc" data-aos="fade-up" data-aos-delay="100">
          From real-time data to AI-powered insights, everything you need to trade and
          invest in Indian stock markets with confidence.
        </p>

        <div className="stats-grid">
          {/* Left Card: Real-time Market Data */}
          <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
            <div className="card-header">
              <span className="card-icon blue">📈</span>
              <div>
                <div className="card-title">Live Market Data</div>
                <div className="card-subtitle">NSE • BSE • Real-time</div>
              </div>
            </div>
            <div className="stock-tickers">
              {stocks.map((stock) => (
                <div key={stock.name} className="ticker-item">
                  <div className="ticker-name">{stock.name}</div>
                  <div className="ticker-details">
                    <span className="ticker-price">₹{stock.price.toLocaleString('en-IN')}</span>
                    <span className={`ticker-change ${stock.trend}`}>
                      {stock.change} ({stock.percent}) {stock.trend === 'up' ? '↗' : '↘'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card: Advanced Charting */}
          <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
            <div className="card-header">
              <span className="card-icon orange">📊</span>
              <div className="card-title">Technical Analysis</div>
            </div>
            <div className="card-subtitle full-width">Over 100+ powerful indicators</div>
            
            {/* Animated Chart Placeholder */}
            <div className="chart-container">
               <svg className="animated-chart" viewBox="0 0 100 40" preserveAspectRatio="none">
                 <path d="M 0,35 C 20,10 30,15 50,20 S 70,30 100,5" />
               </svg>
            </div>

            <div className="indicator-tags">
              <span className="tag blue">RSI</span>
              <span className="tag red">MACD</span>
              <span className="tag gray">Bollinger Bands</span>
              <span className="tag green">SMA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;