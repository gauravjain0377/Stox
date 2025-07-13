import React from "react";

export default function TrustedInvestors() {
  return (
    <section className="py-8" style={{ background: '#FAFAFA', width: '100%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: '3.2rem', fontWeight: 800, textAlign: 'center', marginBottom: 12, color: '#111', fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '-0.01em' }}>
          Why Choose TradePro?
        </h2>
        <div style={{ textAlign: 'center',
        color: '#64748b',
        fontSize: '1.18rem',
        marginBottom: '2.5rem',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        lineHeight: 1.5 }}>
          Everything you need to trade and invest in Indian markets
        </div>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {/* Feature 1 */}
          <div style={{ flex: '1 1 320px', minWidth: 260, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 32 }}>
            <div style={{ background: '#19c37d', color: '#fff', borderRadius: 12, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24 }}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#111' }}>Advanced Charting</div>
            <div style={{ color: '#222', fontSize: 18, marginBottom: 18, fontWeight: 400, lineHeight: 1.6 }}>
              Professional-grade charts with 100+ technical indicators and real-time market data across NSE and BSE.
            </div>
            
          </div>
          {/* Feature 2 */}
          <div style={{ flex: '1 1 320px', minWidth: 260, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 32 }}>
            <div style={{ background: '#19c37d', color: '#fff', borderRadius: 12, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24 }}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#111' }}>Bank-grade Security</div>
            <div style={{ color: '#222', fontSize: 18, marginBottom: 18, fontWeight: 400, lineHeight: 1.6 }}>
              Your investments protected with 256-bit encryption, two-factor authentication, and SEBI-regulated security protocols.
            </div>
           
          </div>
          {/* Feature 3 */}
          <div style={{ flex: '1 1 320px', minWidth: 260, maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 32 }}>
            <div style={{ background: '#19c37d', color: '#fff', borderRadius: 12, width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 24 }}>
              <i className="fas fa-bolt"></i>
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8, color: '#111' }}>Lightning Fast Execution</div>
            <div style={{ color: '#222', fontSize: 18, marginBottom: 18, fontWeight: 400, lineHeight: 1.6 }}>
              Execute trades in milliseconds with our high-performance trading engine and dedicated mobile app.
            </div>
           
          </div>
        </div>
      </div>
      {/* FontAwesome CDN for icons (if not already included globally) */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </section>
  );
} 