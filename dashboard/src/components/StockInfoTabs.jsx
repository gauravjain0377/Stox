import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TABS = ['Overview', 'Financials', 'News', 'History'];

export default function StockInfoTabs({ symbol }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Remove .NS or .BSE for company info lookup
  const cleanSymbol = symbol.replace(/\.(NS|BSE)$/i, '');
  const getEndpoint = (tab) => `/api/stocks/${cleanSymbol}/companyinfo`;

  useEffect(() => {
    setLoading(true);
    setError('');
    setData(null);
    axios.get(getEndpoint(activeTab))
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to fetch data'))
      .finally(() => setLoading(false));
  }, [activeTab, symbol]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid #007bff' : '2px solid transparent',
              background: 'none',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ minHeight: 200 }}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && data && (
          <>
            {activeTab === 'Overview' && (
              <div>
                <h2>{data.company_name}</h2>
                <p><b>Sector:</b> {data.sector}</p>
                <p><b>About:</b> {data.about}</p>
                <p><b>History:</b> {data.history}</p>
              </div>
            )}
            {activeTab === 'Financials' && (
              <div>
                <p><b>Market Cap (Cr):</b> {data.financials_2025?.market_cap_crore}</p>
                <p><b>Close Price:</b> {data.financials_2025?.close_price}</p>
                <p><b>PE Ratio:</b> {data.financials_2025?.pe_ratio}</p>
                <p><b>PB Ratio:</b> {data.financials_2025?.pb_ratio}</p>
                <p><b>ROE (%):</b> {data.financials_2025?.roe_percent}</p>
                <p><b>ROCE (%):</b> {data.financials_2025?.roce_percent}</p>
                <p>
                  <b>Latest Returns:</b>
                  1M: {data.financials_2025?.latest_returns?.['1_month']}%,{' '}
                  6M: {data.financials_2025?.latest_returns?.['6_month']}%,{' '}
                  1Y: {data.financials_2025?.latest_returns?.['1_year']}%
                </p>
              </div>
            )}
            {activeTab === 'News' && (
              <ul>
                {data.news_2025?.map((n, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>{n}</li>
                ))}
              </ul>
            )}
            {activeTab === 'History' && (
              <div>
                <p>{data.history}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 