import React from "react";
import { FaComments, FaPhoneAlt, FaEnvelope, FaCrown, FaCheckCircle } from "react-icons/fa";

const contacts = [
  {
    icon: <FaComments size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />, 
    title: "Live Chat",
    desc: "Get instant help from our team.",
    details: [
      { icon: <FaCheckCircle color="#ff6a1a" size={14} />, text: "Average response: 30 seconds" },
    ],
  },
  {
    icon: <FaPhoneAlt size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Phone Support",
    desc: "Speak directly with our experts.",
    details: [
      { icon: <FaCheckCircle color="#ff6a1a" size={14} />, text: "Call: +91 8949956653" },
    ],
  },
  {
    icon: <FaEnvelope size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Email Support",
    desc: "Send detailed queries and get comprehensive answers.",
    details: [
      { icon: <FaCheckCircle color="#ff6a1a" size={14} />, text: "gjain0229@gmail.com" },
    ],
  },
  {
    icon: <FaCrown size={32} color="#ff6a1a" style={{ background: '#fff3e6', borderRadius: 8, padding: 6 }} />,
    title: "Priority Support",
    desc: "Premium support for Pro users.",
    details: [
      { icon: <FaCheckCircle color="#ff6a1a" size={14} />, text: "Dedicated relationship manager" },
    ],
  },
];

function GetInTouch() {
  return (
    <section className="getintouch-section" id="get-in-touch-section">
      <h2 className="getintouch-title">Get in Touch</h2>
      <p className="getintouch-desc">Choose the best way to reach our support team based on your needs.</p>
      <div className="getintouch-grid">
        {contacts.map((c, i) => (
          <div className="getintouch-card" key={c.title}>
            <div className="getintouch-icon">{c.icon}</div>
            <div className="getintouch-card-title">{c.title}</div>
            <div className="getintouch-card-desc">{c.desc}</div>
            <ul className="getintouch-details">
              {c.details.map((d, j) => (
                <li key={j}>{d.icon} <span>{d.text}</span></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GetInTouch; 