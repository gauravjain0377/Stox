// TrustedInvestors.jsx
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './TrustedInvestors.css'; // Import the new CSS file

function TrustedInvestors() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  return (
    <section className="trusted-section">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">
          Empowering Traders Across India
        </h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          India's most reliable trading platform with cutting-edge technology, regulatory
          compliance, and unwavering commitment to investor success.
        </p>

        <div className="stats-container">
          {/* Card 1 */}
          <div className="stat-item" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-number">2 M+</div>
            <h3 className="stat-title">2M+ Active Traders</h3>
            <p className="stat-description">
              Growing community of retail and institutional investors actively
              trading on our platform
            </p>
          </div>

          {/* Card 2 */}
          <div className="stat-item" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-number">₹50,000 Cr+</div>
            <h3 className="stat-title">₹50,000 Cr+ Assets Under Management</h3>
            <p className="stat-description">
              Total value of assets managed and traded through our secure platform
            </p>
          </div>

          {/* Card 3 */}
          <div className="stat-item" data-aos="fade-up" data-aos-delay="400">
            <div className="stat-number">100 %</div>
            <h3 className="stat-title">99.9% Uptime Guaranteed</h3>
            <p className="stat-description">
              Rock-solid infrastructure ensuring your trades execute when markets move
            </p>
          </div>

          {/* Card 4 */}
          <div className="stat-item" data-aos="fade-up" data-aos-delay="500">
            <div className="stat-number stat-number--orange">SEBI</div>
            <h3 className="stat-title">SEBI Registered & Regulated</h3>
            <p className="stat-description">
              Fully compliant with Indian securities regulations for your peace of mind
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedInvestors;