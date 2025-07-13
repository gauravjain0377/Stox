import React from "react";

function Stats() {
  return (
    <section className="container py-8">
      <h1 style={{
        fontSize: '2.6rem',
        fontWeight: 700,
        textAlign: 'center',
        marginBottom: '0.5rem',
        letterSpacing: '-0.02em',
        color: '#1e293b',
        fontFamily: 'Inter, Poppins, Montserrat, sans-serif',
        textShadow: '0 2px 8px rgba(34,42,53,0.04)'
      }}>
        Complete Trading Platform for Indian Markets
      </h1>
      <p style={{
        textAlign: 'center',
        color: '#64748b',
        fontSize: '1.18rem',
        marginBottom: '2.5rem',
        fontWeight: 400,
        letterSpacing: '-0.01em',
        lineHeight: 1.5
      }}>
        From real-time market data to AI-powered insights, everything you need to trade and<br />
        invest in Indian stock markets with confidence.
      </p>
      <div className="row" style={{ display: 'flex', gap: '0', justifyContent: 'center' }}>
        {/* Left: Real-time Market Data */}
        <div className="col-12 col-md-6" style={{ padding: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 60%, #e0f2fe 100%)',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(34,42,53,0.08)',
            padding: '2.2rem',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid #e0e7ef',
            transition: 'box-shadow 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.7rem', color: '#0ea5e9', background: '#e0f2fe', borderRadius: '8px', padding: '0.3rem 0.7rem' }}>📈</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b' }}>Live Market Data</div>
                <div style={{ fontSize: '1rem', color: '#64748b' }}>NSE • BSE • Real-time</div>
              </div>
            </div>
            {[{
              name: 'RELIANCE', price: '₹2,847.50', change: '+42.30 (+1.51%)', color: '#16a34a', icon: '↗'
            }, {
              name: 'TCS', price: '₹3,965.20', change: '-15.80 (-0.40%)', color: '#dc2626', icon: '↘'
            }, {
              name: 'HDFCBANK', price: '₹1,634.75', change: '+28.45 (+1.77%)', color: '#16a34a', icon: '↗'
            }, {
              name: 'INFY', price: '₹1,523.90', change: '+12.25 (+0.81%)', color: '#16a34a', icon: '↗'
            }].map((stock, i) => (
              <div key={stock.name} style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '1rem 1.2rem',
                marginBottom: i !== 3 ? '0.7rem' : 0,
                boxShadow: '0 1px 4px rgba(34,42,53,0.03)',
                display: 'flex', flexDirection: 'column', gap: '0.2rem',
                transition: 'box-shadow 0.2s',
              }}>
                <div style={{ fontWeight: 600, color: '#222', fontSize: '1.07rem', letterSpacing: '0.04em' }}>{stock.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.23rem' }}>{stock.price}</span>
                  <span style={{ color: stock.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>{stock.change} <span style={{ fontSize: '1.1em' }}>{stock.icon}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Advanced Charting */}
        <div className="col-12 col-md-6" style={{ padding: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 60%, #fef3c7 100%)',
            borderRadius: '20px',
            boxShadow: '0 4px 24px rgba(34,42,53,0.08)',
            padding: '2.2rem',
            minHeight: '340px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            border: '1px solid #e0e7ef',
            transition: 'box-shadow 0.2s',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.28rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <span style={{ fontSize: '1.7rem', color: '#fb923c', background: '#fff7ed', borderRadius: '8px', padding: '0.3rem 0.7rem' }}>📊</span>
              Technical Analysis
            </div>
            <div style={{ color: '#64748b', fontSize: '1.05rem', marginBottom: '0.5rem' }}>100+ Indicators</div>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1.5rem', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(34,42,53,0.03)' }}>
              {/* Placeholder for chart */}
              <svg width="120" height="60" viewBox="0 0 120 60">
                <circle cx="10" cy="50" r="4" fill="#222" />
                <circle cx="30" cy="40" r="4" fill="#222" />
                <circle cx="50" cy="35" r="4" fill="#222" />
                <circle cx="70" cy="30" r="4" fill="#222" />
                <circle cx="90" cy="25" r="4" fill="#222" />
                <circle cx="110" cy="20" r="4" fill="#222" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
                <span>9:15 AM</span>
                <span>3:30 PM</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.7rem' }}>
              <span style={{ background: '#e0f2fe', color: '#0284c7', borderRadius: '8px', padding: '0.2rem 0.8rem', fontWeight: 600, fontSize: '0.97rem' }}>RSI</span>
              <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '8px', padding: '0.2rem 0.8rem', fontWeight: 600, fontSize: '0.97rem' }}>MACD</span>
              <span style={{ background: '#f3f4f6', color: '#222', borderRadius: '8px', padding: '0.2rem 0.8rem', fontWeight: 600, fontSize: '0.97rem' }}>SMA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
