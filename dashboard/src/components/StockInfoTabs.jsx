import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const TABS = ['Overview', 'Financials', 'News', 'History'];

export default function StockInfoTabs({ symbol }) {
  // Validate input
  if (!symbol || typeof symbol !== 'string') {
    console.error('Invalid symbol prop provided to StockInfoTabs:', symbol);
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 0, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ padding: '32px', textAlign: 'center', color: '#ef4444' }}>
          Invalid stock symbol provided
        </div>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Remove .NS or .BSE for company info lookup
  const cleanSymbol = symbol.replace(/\.(NS|BSE)$/i, '');
  const getEndpoint = (tab) => `/api/stocks/${cleanSymbol}/companyinfo`;

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after component unmount
    
    const fetchCompanyInfo = async (retryCount = 0) => {
      const maxRetries = 2;
      
      if (!isMounted) return;
      
      console.log('Requesting company info for:', cleanSymbol, 'Endpoint:', getEndpoint(activeTab));
      setLoading(true);
      setError('');
      setData(null);
      
      try {
        const response = await axios.get(getEndpoint(activeTab), {
          timeout: 10000 // 10 second timeout
        });
        
        if (!isMounted) return;
        
        console.log('Company info data:', response.data); // Debug: log the received data
        
        // Handle new response structure
        if (response.data.success === false) {
          // Backend returned an error
          setError(response.data.error || 'No data available for this stock');
        } else if (response.data && Object.keys(response.data).length > 0) {
          // Extract data from new structure
          const companyData = response.data.data || response.data;
          setData(companyData);
        } else {
          setError('No data available for this stock');
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error fetching company info:', err);
        
        // Retry mechanism for network errors
        if ((err.code === 'ECONNABORTED' || err.request) && retryCount < maxRetries) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            if (isMounted) {
              fetchCompanyInfo(retryCount + 1);
            }
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }
        
        // More detailed error handling
        if (err.code === 'ECONNABORTED') {
          setError('Request timeout. Please try again.');
        } else if (err.response) {
          // Server responded with error status
          if (err.response.status === 404) {
            setError('Company information not found for this stock');
          } else {
            const errorMessage = err.response.data?.error || 
                                err.response.data?.message || 
                                `Server error: ${err.response.status}`;
            setError(errorMessage);
          }
        } else if (err.request) {
          // Network error
          setError('Network error. Please check your connection.');
        } else {
          // Other error
          setError('Failed to fetch data. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    StockInfoTabs.propTypes = {
      symbol: PropTypes.string.isRequired
    };
    
    // Only fetch if we have a valid symbol
    if (cleanSymbol) {
      fetchCompanyInfo();
    } else {
      setError('Invalid stock symbol');
      setLoading(false);
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [activeTab, symbol, cleanSymbol]);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 0, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            style={{
              flex: 1,
              padding: '16px 0',
              border: 'none',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#2563eb' : '#6b7280',
              fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 17,
              borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
              borderTopLeftRadius: tab === TABS[0] ? 16 : 0,
              borderTopRightRadius: tab === TABS[TABS.length-1] ? 16 : 0,
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(37,99,235,0.08)' : 'none',
              position: 'relative',
              overflow: 'hidden',
              transform: 'translateZ(0)', // Enable hardware acceleration
              zIndex: activeTab === tab ? 2 : 1
            }}
            onClick={() => setActiveTab(tab)}
            onMouseOver={e => {
              e.currentTarget.style.background = activeTab === tab ? '#fff' : '#f3f4f6';
              e.currentTarget.style.color = activeTab === tab ? '#2563eb' : '#4b5563';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = activeTab === tab ? '#fff' : 'transparent';
              e.currentTarget.style.color = activeTab === tab ? '#2563eb' : '#6b7280';
            }}
            aria-selected={activeTab === tab}
            aria-label={tab}
          >
            <motion.span
              whileHover={{ y: -2 }}
              whileTap={{ y: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {tab}
            </motion.span>
          </button>
        ))}
      </div>
      <div style={{ minHeight: 220, padding: '32px 32px 24px 32px', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, background: '#fff', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ color: '#2563eb', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 16, height: 16, border: '2px solid #2563eb', borderRightColor: 'transparent', borderRadius: '50%' }}
                />
                Loading...
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ color: '#ef4444', fontWeight: 500 }}
              >
                {error}
              </motion.div>
            )}
            {!loading && !error && (
              data ? (
                <>
                  {activeTab === 'Overview' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.h2 
                        style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {data.company_name || <span style={{color: 'gray'}}>No Name</span>}
                      </motion.h2>
                      <motion.p 
                        style={{ fontSize: 16, color: '#2563eb', fontWeight: 600, marginBottom: 8 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <b>Sector:</b> {data.sector || <span style={{color: 'gray'}}>N/A</span>}
                      </motion.p>
                      <motion.p 
                        style={{ fontSize: 16, marginBottom: 16 }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <b>About:</b> {data.about || <span style={{color: 'gray'}}>N/A</span>}
                      </motion.p>
                      <motion.p 
                        style={{ fontSize: 15, color: '#374151' }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <b>History:</b> {data.history || <span style={{color: 'gray'}}>N/A</span>}
                      </motion.p>
                    </motion.div>
                  )}
                  {activeTab === 'Financials' && (
                    <motion.div 
                      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {Object.entries({
                        'Market Cap (Cr)': data.financials_2025?.market_cap_crore,
                        'Close Price': data.financials_2025?.close_price,
                        'PE Ratio': data.financials_2025?.pe_ratio,
                        'PB Ratio': data.financials_2025?.pb_ratio,
                        'ROE (%)': data.financials_2025?.roe_percent,
                        'ROCE (%)': data.financials_2025?.roce_percent
                      }).map(([label, value], index) => (
                        <motion.div 
                          key={label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          style={{ padding: '12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}
                        >
                          <b>{label}:</b><br />
                          {value ?? <span style={{color: 'gray'}}>N/A</span>}
                        </motion.div>
                      ))}
                      <motion.div 
                        style={{ gridColumn: '1 / span 2', marginTop: 8, padding: '12px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <b>Latest Returns:</b><br />
                        1M: {data.financials_2025?.latest_returns?.['1_month'] ?? <span style={{color: 'gray'}}>N/A</span>}%, {' '}
                        6M: {data.financials_2025?.latest_returns?.['6_month'] ?? <span style={{color: 'gray'}}>N/A</span>}%, {' '}
                        1Y: {data.financials_2025?.latest_returns?.['1_year'] ?? <span style={{color: 'gray'}}>N/A</span>}%
                      </motion.div>
                    </motion.div>
                  )}
                  {activeTab === 'News' && (
                    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                      {Array.isArray(data.news_2025) && data.news_2025.length > 0 ? (
                        data.news_2025.map((n, i) => (
                          <motion.li 
                            key={i} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{ marginBottom: 16, background: '#f3f4f6', borderRadius: 8, padding: '12px 16px', color: '#374151', fontSize: 15 }}
                          >
                            {n}
                          </motion.li>
                        ))
                      ) : (
                        <li style={{color: 'gray'}}>No news available.</li>
                      )}
                    </ul>
                  )}
                  {activeTab === 'History' && (
                    <motion.div 
                      style={{ fontSize: 15, color: '#374151' }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {data.history || <span style={{color: 'gray'}}>N/A</span>}
                      </motion.p>
                    </motion.div>
                  )}
                </>
              ) : (
                // Fallback when no data is available
                <motion.div 
                  style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p>No information available for this stock</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    Company data may be temporarily unavailable
                  </p>
                </motion.div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}