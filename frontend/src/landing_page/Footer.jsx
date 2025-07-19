import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "#FAFAFA", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', color: '#222', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 0 24px', position: 'relative', zIndex: 1 }}>
        {/* Top: Logo, Brand, Tagline, Social Icons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0, marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ background: '#19c37d', color: '#fff', fontWeight: 700, fontSize: 22, borderRadius: 8, padding: '6px 14px', letterSpacing: 1 }}>TP</div>
            <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 0.01 }}>StockSathi</span>
          </div>
          <div style={{ color: '#444', fontSize: 17, marginBottom: 18, maxWidth: 520 }}>
            India's most trusted stock trading platform with zero brokerage equity delivery and transparent pricing.
          </div>
          
        </div>
        {/* Divider */}
        <div style={{ borderTop: '1px solid #ececec', margin: '0 0 0 0', width: '100%' }} />
        {/* Four columns */}
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'space-between', margin: '40px 0 0 0' }}>
          <div style={{ minWidth: 160 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Products</div>
            <div style={{ color: '#444', fontWeight: 400, fontSize: 16, lineHeight: 2 }}>
              <div>Equity Trading</div>
              <div>F&O Trading</div>
              <div>Mutual Funds</div>
              <div>IPO Applications</div>
            </div>
          </div>
          <div style={{ minWidth: 160 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Support</div>
            <div style={{ color: '#444', fontWeight: 400, fontSize: 16, lineHeight: 2 }}>
              <div>Help Center</div>
              <div>Contact Support</div>
              <div>Trading Tutorial</div>
              <div>Market Updates</div>
            </div>
          </div>
          <div style={{ minWidth: 160 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Legal</div>
            <div style={{ color: '#444', fontWeight: 400, fontSize: 16, lineHeight: 2 }}>
              <div>Privacy Policy</div>
              <div>Terms of Service</div>
              <div>Risk Disclosure</div>
              <div>SEBI Registration</div>
            </div>
          </div>
          <div style={{ minWidth: 220, maxWidth: 320 }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>Disclaimer</div>
            <div style={{ color: '#888', fontWeight: 400, fontSize: 15, lineHeight: 1.7 }}>
            StockSathi   is a SEBI registered broker. Securities investments are subject to market risks. Please read all related documents carefully before investing.
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div style={{ borderTop: '1px solid #ececec', margin: '40px 0 0 0', width: '100%' }} />
        
      </div>
      {/* Large bottom text */}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '10vw',
          fontWeight: 800,
          color: '#cccccc',
          opacity: 0.7,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          marginTop: 32,
          marginBottom: 0,
          lineHeight: 1.1,
        }}
        aria-hidden="true"
      >
        StockSathi
      </div>

      <div style={{ color: '#888', fontSize: 15, textAlign: 'center', padding: '18px 0 8px 0', letterSpacing: 0.01 }}>
          © 2025 StockSathi. All rights reserved.
        </div>

      {/* FontAwesome CDN for icons (if not already included globally) */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </footer>
  );
}
