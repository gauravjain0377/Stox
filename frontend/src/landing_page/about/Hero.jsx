import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../home/Hero.css';

function Hero() {
  useEffect(() => {
    AOS.init({ duration: 800, offset: 150, once: true });
  }, []);

  return (
    <section className="hero-section" style={{ minHeight: '70vh', background: '#fafafa' }}>
      <div className="hero-content" data-aos="fade-up">
        <div style={{
          display: 'inline-block',
          background: '#fff',
          borderRadius: '32px',
          boxShadow: '0 4px 24px 0 rgba(255,106,26,0.08)',
          padding: '8px 28px',
          fontWeight: 500,
          fontSize: '1.1rem',
          color: '#555',
          marginBottom: '2.5rem',
        }}>
          Trusted by 50,000+ Indian traders. <span style={{ color: '#ff6a1a', fontWeight: 700, cursor: 'pointer' }}>Join them <span style={{ fontSize: '1.2em', verticalAlign: 'middle' }}>&rarr;</span></span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '4rem', marginBottom: '1.2rem', color: '#000', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.08, background: 'none', WebkitBackgroundClip: 'unset', WebkitTextFillColor: 'unset' }}>
          Building India's Most <br /> TransparentTrading Platform
        </h1>
        <div style={{ fontSize: '1.35rem', color: '#6b7280', fontWeight: 500, marginBottom: '2.2rem', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
          One developer's journey to democratize stock trading for every Indian investor.
        </div>
        <div style={{ fontSize: '1.15rem', color: '#4a5568', fontWeight: 400, maxWidth: 650, margin: '0 auto 2.8rem auto', lineHeight: 1.7 }}>
          Started in 2024 with a simple belief: every Indian deserves access to fair, transparent, and affordable stock trading. What began as a personal project has evolved into a mission to empower millions of investors across India.
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          
        </div>
      </div>
    </section>
  );
}

export default Hero; 