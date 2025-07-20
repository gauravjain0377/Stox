import React from "react";
import { FaUser, FaChartLine, FaShieldAlt, FaCreditCard, FaFileAlt, FaCog } from "react-icons/fa";

const topics = [
  {
    icon: <FaUser size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />, 
    title: "Getting Started",
    desc: "Account setup, verification, first trades",
    count: 12,
  },
  {
    icon: <FaChartLine size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Trading & Orders",
    desc: "Order types, market hours, strategies",
    count: 18,
  },
  {
    icon: <FaShieldAlt size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Account & Security",
    desc: "2FA, password reset, account safety",
    count: 15,
  },
  {
    icon: <FaCreditCard size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Payments & Withdrawals",
    desc: "Deposits, withdrawals, payment methods",
    count: 10,
  },
  {
    icon: <FaFileAlt size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Tax & Compliance",
    desc: "Tax reporting, SEBI guidelines, compliance",
    count: 8,
  },
  {
    icon: <FaCog size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Technical Support",
    desc: "App issues, platform troubleshooting",
    count: 14,
  },
];

function CreateTicket() {
  return (
    <section className="ticket-topics-section">
      <h2 className="ticket-topics-title">Browse Help Topics</h2>
      <p className="ticket-topics-desc">Find answers to common questions organized by category</p>
      <div className="ticket-topics-grid">
        {topics.map((t, i) => (
          <div className="ticket-topic-card" key={t.title}>
            <div className="ticket-topic-icon">{t.icon}</div>
            <div className="ticket-topic-main">
              <div className="ticket-topic-title">{t.title}</div>
              <div className="ticket-topic-desc">{t.desc}</div>
            </div>
            <div className="ticket-topic-count">{t.count} articles</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CreateTicket;