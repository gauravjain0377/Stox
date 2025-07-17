// SmartPortfolio.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup';
import { FaBriefcase, FaBookOpen, FaLightbulb, FaStar } from 'react-icons/fa';
import './SmartPortfolio.css';

// Data can be fetched from an API
const holdingsData = [
  { name: 'RELIANCE', shares: 50, value: 142375, change: '+5.2%', trend: 'up' },
  { name: 'TCS', shares: 25, value: 99130, change: '-2.1%', trend: 'down' },
  { name: 'HDFCBANK', shares: 75, value: 122606, change: '+3.8%', trend: 'up' },
];

const articlesData = [
  { title: 'IPO Alert: Bajaj Housing Finance', tag: 'IPO', new: true },
  { title: 'Understanding Options Trading', tag: 'Education' },
  { title: 'Q2 Results: IT Sector Analysis', tag: 'Research' },
  { title: 'Expert Pick: Pharma Stocks', tag: 'Recommendation', featured: true },
];

function SmartPortfolio() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="sp-section">
      <div className="container">
        <div className="sp-grid">
          {/* Left Card: Smart Portfolio */}
          <div className="sp-card" data-aos="fade-right">
            <div className="sp-card-header">
              <span className="sp-icon green"><FaBriefcase /></span>
              <div>
                <h3 className="sp-card-title">Smart Portfolio</h3>
                <p className="sp-card-subtitle">AI-Powered Insights</p>
              </div>
            </div>

            <div className="portfolio-value-box">
              <p className="pv-label">Total Portfolio Value</p>
              <div className="pv-amount-row">
                <span className="pv-amount">
                  ₹<CountUp end={364111} duration={2.5} separator="," />
                </span>
                <span className="pv-change up">+₹18,247 (+5.3%) today</span>
              </div>
            </div>

            <div className="holdings-list">
              {holdingsData.map(holding => (
                <div key={holding.name} className="holding-item">
                  <div>
                    <p className="holding-name">{holding.name}</p>
                    <p className="holding-shares">{holding.shares} shares</p>
                  </div>
                  <div className="holding-value-col">
                    <p className="holding-value">₹{holding.value.toLocaleString('en-IN')}</p>
                    <p className={`holding-change ${holding.trend}`}>{holding.change}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="ai-recommendation">
              <span className="ai-icon"><FaLightbulb /></span>
              <p><strong>AI Recommendation:</strong> Consider rebalancing for optimal growth.</p>
            </div>
          </div>

          {/* Right Card: Learn & Invest */}
          <div className="sp-card" data-aos="fade-left">
            <div className="sp-card-header">
              <span className="sp-icon orange"><FaBookOpen /></span>
              <div>
                <h3 className="sp-card-title">Learn & Invest</h3>
                <p className="sp-card-subtitle">Stay Ahead of the Market</p>
              </div>
            </div>
            
            <div className="articles-list">
              {articlesData.map(article => (
                <div key={article.title} className="article-item">
                  <p className="article-title">{article.title} <span className="article-category">{article.tag}</span></p>
                  <div>
                    {article.new && <span className="article-badge new">New</span>}
                    {article.featured && <span className="article-badge featured"><FaStar /></span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="market-insight-box">
              <p><strong>Market Insight:</strong> Nifty 50 is showing bullish momentum. Consider large-cap stocks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SmartPortfolio;