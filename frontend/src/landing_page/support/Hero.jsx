import React from "react";

function Hero() {
  const handleContactClick = () => {
    const el = document.getElementById("get-in-touch-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="support-hero-modern">
      <div className="support-hero-badge">24/7 Customer Support Available</div>
      <h1 className="support-hero-title">Get the Help<br />You Need</h1>
      <p className="support-hero-subtitle">
        Our dedicated support team is here to assist you with all your trading<br />
        questions, technical issues, and account queries. Access resources,<br />
        contact experts, or find answers instantly.
      </p>
      <div className="support-hero-actions">
        <button className="support-hero-btn-primary" onClick={handleContactClick}>Contact Support</button>
      </div>
      <div className="support-hero-footer-note">
       NSE &bull; BSE &bull; Trusted by 2M+ Traders &bull; 99.9% Uptime
      </div>
    </section>
  );
}

export default Hero;