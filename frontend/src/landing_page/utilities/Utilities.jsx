import React, { useState } from "react";
import SipCalculator from "./SipCalculator";
import SwpCalculator from "./SwpCalculator";
import BrokerageCalculator from "./BrokerageCalculator";
import MarginCalculator from "./MarginCalculator";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./utilities.css";

const calculators = [
  { key: "sip", label: "SIP Calculator", component: <SipCalculator /> },
  { key: "swp", label: "SWP Calculator", component: <SwpCalculator /> },
  { key: "brokerage", label: "Brokerage Calculator", component: <MarginCalculator /> },
  { key: "margin", label: "Margin Calculator", component: <MarginCalculator /> },
];

function Utilities() {
  const [open, setOpen] = useState(null);

  const toggleCalculator = (key) => {
    setOpen(open === key ? null : key);
  };

  return (
    <>
      <Navbar />
      <section className="utilities-section">
        <h1 className="utilities-title">Financial Calculators</h1>
        <div className="utilities-cards">
          {calculators.map((calc) => (
            <div key={calc.key} className={`utilities-card${open === calc.key ? " open" : ""}`}>
              <button
                className="utilities-card-btn"
                onClick={() => toggleCalculator(calc.key)}
                aria-expanded={open === calc.key}
                aria-controls={`content-${calc.key}`}
              >
                {calc.label}
                {/* Animated chevron icon for open/close state */}
                <span className="toggle-icon" aria-hidden="true"></span>
              </button>
              <div
                id={`content-${calc.key}`}
                className="utilities-card-content-wrapper"
              >
                <div className="utilities-card-content">{calc.component}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Utilities;