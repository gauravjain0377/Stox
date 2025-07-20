import React, { useState } from "react";


const faqs = [
  {
    question: "What are the trading hours for Indian stock markets?",
    answer: "The regular trading hours for NSE and BSE are 9:15 AM to 3:30 PM, Monday to Friday (excluding holidays).",
  },
  {
    question: "How do I comply with SEBI regulations on my trades?",
    answer: "Compliance with SEBI regulations involves ensuring fair trade practices, adhering to margin requirements, and timely settlement of trades. All trades are electronically reported, and brokers handle most reporting obligations on your behalf.",
  },
  {
    question: "What are the different types of orders I can place?",
    answer: "You can place market orders, limit orders, stop-loss orders, and cover orders, among others, depending on your trading strategy.",
  },
  {
    question: "How is STT (Securities Transaction Tax) calculated?",
    answer: "STT is calculated as a percentage of the transaction value and varies for different types of trades (intraday, delivery, F&O, etc.).",
  },
  {
    question: "What documents do I need for account verification?",
    answer: "You typically need PAN card, Aadhaar card, bank proof, and a photograph for account verification.",
  },
  {
    question: "How can I withdraw my trading profits?",
    answer: "You can withdraw profits by placing a fund withdrawal request from your trading account to your linked bank account.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(1); // Open the second FAQ by default

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="faq-modern-section">
      <div className="faq-modern-container">
        <div className="faq-modern-left">
          <h2 className="faq-modern-title">Frequently Asked<br />Questions</h2>
          <p className="faq-modern-desc">
            Quick answers to common questions about trading,<br />regulations, and platform features.
          </p>
        </div>
        <div className="faq-modern-right">
          {faqs.map((faq, idx) => (
            <div className={`faq-modern-item${openIndex === idx ? " open" : ""}`} key={faq.question}>
              <button
                className="faq-modern-question"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-modern-answer-${idx}`}
              >
                <span className={`faq-modern-icon${openIndex === idx ? " open" : ""}`}>{openIndex === idx ? "–" : "+"}</span>
                <span className="faq-modern-qtext">{faq.question}</span>
              </button>
              {openIndex === idx && (
                <div className="faq-modern-answer" id={`faq-modern-answer-${idx}`}>{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ; 