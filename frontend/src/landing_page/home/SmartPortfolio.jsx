import React from "react";

function SmartPortfolio() {
  return (
    <section className="container py-5" style={{ marginTop: '-1.5rem' }}>
      <div className="row" style={{ display: 'flex', gap: '0', justifyContent: 'center' }}>
        {/* Left: Smart Portfolio */}
        <div className="col-12 col-md-6" style={{ padding: '2rem' }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(34,42,53,0.08)',
            padding: '2.2rem',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid #e0e7ef',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.7rem', color: '#22c55e', background: '#dcfce7', borderRadius: '8px', padding: '0.3rem 0.7rem' }}>🕒</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b' }}>Smart Portfolio</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>AI-Powered Insights</div>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(90deg, #f1f5f9 60%, #f0fdf4 100%)', borderRadius: '12px', padding: '1.2rem 1.5rem', marginBottom: '0.7rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <div style={{ fontWeight: 600, color: '#64748b', fontSize: '1.05rem' }}>Total Portfolio Value</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <span style={{ fontWeight: 800, fontSize: '2rem', color: '#1e293b' }}>₹3,64,111</span>
                <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem' }}>+₹18,247 (+5.3%) <span style={{ fontWeight: 400 }}>today</span></span>
              </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#222', fontSize: '1.07rem', letterSpacing: '0.04em' }}>RELIANCE</div>
                <div style={{ color: '#64748b', fontSize: '0.98rem' }}>50 shares</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b' }}>₹1,42,375</div>
                <div style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.98rem' }}>+5.2%</div>
              </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem 1.2rem', marginBottom: '0.7rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#222', fontSize: '1.07rem', letterSpacing: '0.04em' }}>TCS</div>
                <div style={{ color: '#64748b', fontSize: '0.98rem' }}>25 shares</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b' }}>₹99,130</div>
                <div style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.98rem' }}>-2.1%</div>
              </div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#222', fontSize: '1.07rem', letterSpacing: '0.04em' }}>HDFCBANK</div>
                <div style={{ color: '#64748b', fontSize: '0.98rem' }}>75 shares</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b' }}>₹1,22,606</div>
                <div style={{ color: '#22c55e', fontWeight: 600, fontSize: '0.98rem' }}>+3.8%</div>
              </div>
            </div>
            <div style={{ color: '#fb923c', fontWeight: 600, fontSize: '1.05rem', marginTop: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span> AI Recommendation: <span style={{ color: '#64748b', fontWeight: 500 }}>Consider rebalancing</span>
            </div>
          </div>
        </div>
        {/* Right: Learn & Invest */}
        <div className="col-12 col-md-6" style={{ padding: '2rem' }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(34,42,53,0.08)',
            padding: '2.2rem',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid #e0e7ef',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.7rem', color: '#fb923c', background: '#fff7ed', borderRadius: '8px', padding: '0.3rem 0.7rem' }}>📚</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b' }}>Learn & Invest</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>Stay Informed</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>IPO Alert: Bajaj Housing Finance <span style={{ color: '#64748b', fontSize: '0.95em', marginLeft: 8 }}>IPO</span></span>
                <span style={{ background: '#fb923c', color: '#fff', borderRadius: '8px', padding: '0.2rem 0.8rem', fontWeight: 600, fontSize: '0.95rem' }}>New</span>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.9rem 1.2rem' }}>
                <span>Understanding Options Trading <span style={{ color: '#64748b', fontSize: '0.95em', marginLeft: 8 }}>Education</span></span>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.9rem 1.2rem' }}>
                <span>Q2 Results: IT Sector Analysis <span style={{ color: '#64748b', fontSize: '0.95em', marginLeft: 8 }}>Research</span></span>
              </div>
              <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '0.9rem 1.2rem', display: 'flex', alignItems: 'center' }}>
                <span>Expert Pick: Pharma Stocks <span style={{ color: '#64748b', fontSize: '0.95em', marginLeft: 8 }}>Recommendation</span></span>
                <span style={{ color: '#fb923c', fontSize: '1.1rem', marginLeft: 8 }}>★</span>
              </div>
            </div>
            <div style={{ background: 'linear-gradient(90deg, #f1f5f9 60%, #fef3c7 100%)', borderRadius: '10px', padding: '1rem 1.2rem', marginTop: '0.7rem', color: '#64748b', fontWeight: 500, fontSize: '1.05rem' }}>
              <span style={{ color: '#0284c7', fontWeight: 700 }}>Market Insight:</span> Nifty 50 is showing bullish momentum. Consider large-cap stocks for your portfolio.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SmartPortfolio; 