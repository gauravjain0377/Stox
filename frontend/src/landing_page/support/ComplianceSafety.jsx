import React from "react";
import { FaUniversity, FaShieldAlt, FaAward } from "react-icons/fa";

const items = [
  {
    icon: <FaUniversity size={54} color="#ff6a1a" style={{ background: 'rgba(255,106,26,0.07)', borderRadius: '50%', padding: 16 }} />, 
    title: "SEBI Registered",
    subtitle: "Registration No: INZ000XXXXXX",
    desc: "Regulated by Securities and Exchange Board of India.",
  },
  {
    icon: <FaShieldAlt size={54} color="#ff6a1a" style={{ background: 'rgba(255,106,26,0.07)', borderRadius: '50%', padding: 16 }} />,
    title: "Secure Platform",
    subtitle: "Bank-Grade Security",
    desc: "256-bit SSL encryption and multi-factor authentication.",
  },
  {
    icon: <FaAward size={54} color="#ff6a1a" style={{ background: 'rgba(255,106,26,0.07)', borderRadius: '50%', padding: 16 }} />,
    title: "Trusted Platform",
    subtitle: "2M+ Active Users",
    desc: "Rated 4.8/5 by traders across India.",
  },
];

function ComplianceSafety() {
  return (
    <section className="compliance-section">
      <h2 className="compliance-title">Regulatory Compliance &amp; Safety</h2>
      <p className="compliance-desc">Your investments are protected under Indian financial regulations and guidelines.</p>
      <div className="compliance-grid">
        {items.map((item, i) => (
          <div className="compliance-card" key={item.title}>
            <div className="compliance-icon">{item.icon}</div>
            <div className="compliance-card-title">{item.title}</div>
            <div className="compliance-card-subtitle">{item.subtitle}</div>
            <div className="compliance-card-desc">{item.desc}</div>
          </div>
        ))}
      </div>
      <div className="compliance-disclaimer">
        All investments are subject to market risks. Please read all scheme-related documents carefully before investing. SEBI Registration details are available on our regulatory page.
      </div>
    </section>
  );
}

export default ComplianceSafety; 