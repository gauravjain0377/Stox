// Stats.jsx
import React, { useState, useEffect, useRef } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./Stats.css";

// Initial data for stocks (remains the same)
const initialStockData = [
  { name: 'RELIANCE', price: 2847.50, change: 42.30, percent: 1.51, trend: 'up', initialPrice: 2847.50 },
  { name: 'TCS', price: 3965.20, change: -15.80, percent: -0.40, trend: 'down', initialPrice: 3965.20 },
  { name: 'HDFCBANK', price: 1634.75, change: 28.45, percent: 1.77, trend: 'up', initialPrice: 1634.75 },
  { name: 'INFY', price: 1523.90, change: 12.25, percent: 0.81, trend: 'up', initialPrice: 1523.90 }
];


function Stats() {
  const [stocks, setStocks] = useState(initialStockData);
  const cardRefs = useRef([]);

  // This useEffect handles the real-time data simulation.
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });

    const interval = setInterval(() => {
      setStocks(currentStocks => 
        currentStocks.map(stock => {
          const oldPrice = stock.price;
          const fluctuation = (Math.random() - 0.49) * (stock.price * 0.002);
          const newPrice = parseFloat((oldPrice + fluctuation).toFixed(2));
          const newChange = parseFloat((newPrice - stock.initialPrice).toFixed(2));
          const newPercent = parseFloat(((newChange / stock.initialPrice) * 100).toFixed(2));
          const direction = newPrice >= oldPrice ? 'up' : 'down';
          
          return { ...stock, price: newPrice, change: newChange, percent: newPercent, trend: direction };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // This useEffect for the 3D Tilt Effect remains the same.
  useEffect(() => {
    const maxRotate = 8;
    cardRefs.current.forEach(card => {
        if (!card) return;
        card.onmousemove = e => {
            const rect = card.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const rotateY = ((mouseX / width) - 0.5) * 2 * maxRotate;
            const rotateX = (0.5 - (mouseY / height)) * 2 * maxRotate;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        };
        card.onmouseleave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };
    });
  }, [cardRefs]);

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
          {/* Left Card: Real-time Market Data (Unchanged) */}
          <div 
            className="stat-card" 
            data-aos="fade-up" 
            data-aos-delay="200"
            ref={el => cardRefs.current[0] = el}
          >
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
                    <span className="ticker-price">
                      ₹{stock.price.toLocaleString('en-IN')}
                    </span>
                    <span className={`ticker-change ${stock.trend}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percent.toFixed(2)}%) {stock.trend === 'up' ? '↗' : '↘'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT CARD: UPDATED TO F&O HUB --- */}
          <div 
            className="stat-card" 
            data-aos="fade-up" 
            data-aos-delay="300"
            ref={el => cardRefs.current[1] = el}
          >
            <div className="card-header">
              <span className="card-icon orange">📊</span>
              <div>
                <div className="card-title">Futures & Options Hub</div>
                <div className="card-subtitle">Analyse Open Interest, Option Chain & more.</div>
              </div>
            </div>

            {/* NEW: F&O Bar Chart Visual */}
            <div className="fno-chart-container">
                <div className="fno-bar-wrapper">
                    <div className="fno-bar green-bar"></div>
                    <span>Puts OI</span>
                </div>
                <div className="fno-bar-wrapper">
                    <div className="fno-bar red-bar"></div>
                    <span>Calls OI</span>
                </div>
            </div>
            
            {/* NEW: F&O Related Tags */}
            <div className="indicator-tags">
              <span className="tag blue">Option Chain</span>
              <span className="tag green">PCR Ratio</span>
              <span className="tag red">Open Interest</span>
              <span className="tag gray">Max Pain</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Stats;