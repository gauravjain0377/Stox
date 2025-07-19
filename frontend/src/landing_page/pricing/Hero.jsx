import React from "react";

const pricingOptions = [
  {
    title: "Free Equity Delivery",
    price: 0,
    description: "All equity delivery investments (NSE, BSE) are absolutely free — ₹0 brokerage.",
    bg: "#eafff6",
    priceColor: "#00b386",
    titleColor: "#1d2b35",
    descColor: "#4a5568",
    border: "#e4e9ef",
    badge: false,
    glow: false,
    img: "/media/images/pricingEquity.svg",
    imgAlt: "Equity Delivery",
  },
  {
    title: "Intraday & F&O Trades",
    price: 20,
    description: "Flat ₹20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity.",
    bg: "#fffde7",
    priceColor: "#00b386",
    titleColor: "#1d2b35",
    descColor: "#4a5568",
    border: "#e4e9ef",
    badge: true,
    glow: true,
    img: "/media/images/intradayTrades.svg",
    imgAlt: "Intraday & F&O Trades",
  },
  {
    title: "Free Direct MF",
    price: 0,
    description: "All direct mutual fund investments are absolutely free — ₹0 commissions & DP charges.",
    bg: "#eafff6",
    priceColor: "#00b386",
    titleColor: "#1d2b35",
    descColor: "#4a5568",
    border: "#e4e9ef",
    badge: false,
    glow: false,
    img: "/media/images/pricingMF.svg",
    imgAlt: "Direct Mutual Fund",
  },
];

function Hero() {
  return (
    <section className="w-full bg-[#fafbfc] py-16 px-4 flex flex-col items-center font-inter">
      <div className="w-full max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1d2b35] mb-3">Pricing</h1>
          <p className="text-lg md:text-xl text-[#4a5568] font-medium">
            Free equity investments and flat <span className="text-[#00b386] font-bold">₹20</span> intraday and F&O trades.
          </p>
        </div>
        <button className="mt-6 md:mt-0 px-8 py-3 bg-[#00b386] hover:bg-[#009e74] text-white font-semibold rounded-lg shadow transition-all text-lg font-inter">Start Investing</button>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-y-14 md:gap-y-0 md:gap-x-8">
        {pricingOptions.map((option, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center max-w-sm w-full md:w-[340px] min-h-[340px] py-10 px-6 mx-auto"
            tabIndex={0}
            aria-label={option.title}
            style={{
              background: option.bg,
              border: `1.5px solid ${option.border}`,
              borderRadius: 36,
              boxShadow: "0 8px 40px 0 rgba(34,197,94,0.10)",
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {option.badge && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-yellow-300 text-[#1d2b35] text-base font-semibold px-6 py-2 rounded-full shadow z-10 border border-yellow-200 text-center" style={{letterSpacing: 0.1, fontWeight: 600}}>
                Most Popular
              </span>
            )}
            {/* Card Image */}
            <img
              src={option.img}
              alt={option.imgAlt}
              style={{ width: 96, height: 96, objectFit: 'contain', marginBottom: 20 }}
              loading="lazy"
            />
            <div className="flex items-baseline mb-6 mt-2 justify-center w-full">
              <span
                className="font-extrabold text-6xl md:text-6xl text-center"
                style={{
                  color: option.priceColor,
                  filter: option.glow ? "drop-shadow(0 0 32px #00b386)" : undefined,
                  letterSpacing: -1.5,
                }}
              >
                ₹ {option.price}
              </span>
            </div>
            <div className="text-3xl font-bold mb-5 text-center" style={{color: option.titleColor, letterSpacing: -0.5}}>{option.title}</div>
            <div className="text-lg font-medium text-center max-w-xs mx-auto leading-relaxed" style={{color: option.descColor, opacity: 0.92}}>{option.description}</div>
          </div>
        ))}
      </div>
      <div className="w-full max-w-3xl mx-auto mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1d2b35] mb-2">Zero Fixed Charges, Zero Hidden Charges</h2>
        <p className="text-[#4a5568] text-lg">Transparent pricing designed for every Indian investor. No surprises, just simple and fair charges.</p>
      </div>
    </section>
  );
}

export default Hero;