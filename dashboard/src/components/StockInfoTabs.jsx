import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TABS = ['Overview', 'Financials', 'News', 'History'];

// Add CSS for smooth tab transitions
const tabContentStyle = {
  transition: 'opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)',
  opacity: 1,
  transform: 'translateY(0px)'
};
const tabContentHiddenStyle = {
  opacity: 0,
  transform: 'translateY(24px)'
};

export default function StockInfoTabs({ symbol }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showingTab, setShowingTab] = useState(activeTab);
  const [tabVisible, setTabVisible] = useState(true);

  // Animate tab change
  useEffect(() => {
    setTabVisible(false);
    const timeout = setTimeout(() => {
      setShowingTab(activeTab);
      setTabVisible(true);
    }, 180); // fade out, then fade in
    return () => clearTimeout(timeout);
  }, [activeTab]);

  // Remove .NS or .BSE for company info lookup
  const cleanSymbol = symbol.replace(/\.(NS|BSE)$/i, '');
  const getEndpoint = (tab) => `/api/stocks/${cleanSymbol}/companyinfo`;

  useEffect(() => {
    console.log('Requesting company info for:', cleanSymbol, 'Endpoint:', getEndpoint(activeTab));
    setLoading(true);
    setError('');
    setData(null);
    axios.get(getEndpoint(activeTab))
      .then(res => {
        console.log('Company info data:', res.data); // Debug: log the received data
        setData(res.data);
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch data'))
      .finally(() => setLoading(false));
  }, [activeTab, symbol]);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: 0, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e7eb', background: '#f9fafb', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            style={{
              flex: 1,
              padding: '14px 0',
              border: 'none',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#2563eb' : '#6b7280',
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 17,
              borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
              borderTopLeftRadius: tab === TABS[0] ? 16 : 0,
              borderTopRightRadius: tab === TABS[TABS.length-1] ? 16 : 0,
              transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(37,99,235,0.04)' : 'none',
            }}
            onClick={() => setActiveTab(tab)}
            onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
            onMouseOut={e => e.currentTarget.style.background = activeTab === tab ? '#fff' : 'transparent'}
            aria-selected={activeTab === tab}
            aria-label={tab}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ minHeight: 220, padding: '32px 32px 24px 32px', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, background: '#fff' }}>
        {loading && <div style={{ color: '#2563eb', fontWeight: 500 }}>Loading...</div>}
        {error && <div style={{ color: '#ef4444', fontWeight: 500 }}>{error}</div>}
        {!loading && !error && data && (
          <div
            key={showingTab}
            style={tabVisible ? tabContentStyle : tabContentHiddenStyle}
          >
            {showingTab === 'Overview' && (
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{data.company_name || <span style={{color: 'gray'}}>No Name</span>}</h2>
                <p style={{ fontSize: 16, color: '#2563eb', fontWeight: 600, marginBottom: 8 }}><b>Sector:</b> {data.sector || <span style={{color: 'gray'}}>N/A</span>}</p>
                <p style={{ fontSize: 16, marginBottom: 16 }}><b>About:</b> {data.about || <span style={{color: 'gray'}}>N/A</span>}</p>
                <p style={{ fontSize: 15, color: '#374151' }}><b>History:</b> {data.history || <span style={{color: 'gray'}}>N/A</span>}</p>
              </div>
            )}
            {showingTab === 'Financials' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div><b>Market Cap (Cr):</b><br />{data.financials_2025?.market_cap_crore ?? <span style={{color: 'gray'}}>N/A</span>}</div>
                <div><b>Close Price:</b><br />{data.financials_2025?.close_price ?? <span style={{color: 'gray'}}>N/A</span>}</div>
                <div><b>PE Ratio:</b><br />{data.financials_2025?.pe_ratio ?? <span style={{color: 'gray'}}>N/A</span>}</div>
                <div><b>PB Ratio:</b><br />{data.financials_2025?.pb_ratio ?? <span style={{color: 'gray'}}>N/A</span>}</div>
                <div><b>ROE (%):</b><br />{data.financials_2025?.roe_percent ?? <span style={{color: 'gray'}}>N/A</span>}</div>
                <div><b>ROCE (%):</b><br />{data.financials_2025?.roce_percent ?? <span style={{color: 'gray'}}>N/A</span>}</div>
                <div style={{ gridColumn: '1 / span 2', marginTop: 8 }}>
                  <b>Latest Returns:</b><br />
                  1M: {data.financials_2025?.latest_returns?.['1_month'] ?? <span style={{color: 'gray'}}>N/A</span>}%, {' '}
                  6M: {data.financials_2025?.latest_returns?.['6_month'] ?? <span style={{color: 'gray'}}>N/A</span>}%, {' '}
                  1Y: {data.financials_2025?.latest_returns?.['1_year'] ?? <span style={{color: 'gray'}}>N/A</span>}%
                </div>
              </div>
            )}
            {showingTab === 'News' && (
              <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {Array.isArray(data.news_2025) && data.news_2025.length > 0 ? (
                  data.news_2025.map((n, i) => (
                    <li key={i} style={{ marginBottom: 16, background: '#f3f4f6', borderRadius: 8, padding: '12px 16px', color: '#374151', fontSize: 15 }}>{n}</li>
                  ))
                ) : (
                  <li style={{color: 'gray'}}>No news available.</li>
                )}
              </ul>
            )}
            {showingTab === 'History' && (
              <div style={{ fontSize: 15, color: '#374151' }}>
                <p>{data.history || <span style={{color: 'gray'}}>N/A</span>}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 