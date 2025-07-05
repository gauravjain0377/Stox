import React from "react";
import { useGeneralContext } from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Link } from 'react-router-dom';

const Holdings = () => {
  const { holdings: allHoldings, holdingsLoading, openSellWindow, usingFallbackData } = useGeneralContext();

  // Show loading message while fetching holdings
  if (holdingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show message when no holdings are found
  if (!allHoldings || allHoldings.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        textAlign: 'center'
      }}>
        <h3 className="title">Holdings (0)</h3>
        <p style={{ fontSize: '16px', color: '#666', marginTop: '20px' }}>
          You don't have any holdings yet.
        </p>
        <p style={{ fontSize: '14px', color: '#999', marginTop: '10px' }}>
          Start trading to see your holdings here.
        </p>
      </div>
    );
  }

  // Calculate total portfolio value
  const totalPortfolioValue = allHoldings.reduce((sum, stock) => sum + stock.price * stock.qty, 0);

  // Dummy sparkline data (replace with real price history if available)
  const getSparklineData = (stock) => {
    // If you have price history, use it here. For now, use random walk for demo.
    const base = stock.price;
    let arr = [base];
    for (let i = 1; i < 10; i++) {
      arr.push(arr[i-1] + (Math.random() - 0.5) * base * 0.01);
    }
    return arr;
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      {usingFallbackData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Using Demo Data
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Backend server is not running. Showing demo holdings data. 
                  Start the backend with: <code className="bg-yellow-100 px-1 rounded">cd backend && npm start</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <h3 className="title" style={{ marginBottom: 24 }}>Holdings ({allHoldings.length})</h3>
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #0001', padding: 24, marginBottom: 32 }}>
        <div className="order-table" style={{ overflowX: 'auto' }}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Avg. Buy</th>
                <th>LTP</th>
                <th>Current Value</th>
                <th>P&L (₹)</th>
                <th>P&L (%)</th>
                <th>Trend</th>
                <th>Sell</th>
              </tr>
            </thead>
            <tbody>
              {allHoldings.map((stock, index) => {
                const curValue = stock.price * stock.qty;
                const profit = curValue - stock.avg * stock.qty;
                const profitPercent = stock.avg > 0 ? (profit / (stock.avg * stock.qty)) * 100 : 0;
                const profClass = profit >= 0 ? "profit" : "loss";
                return (
                  <tr key={index}>
                    <td>
                      <Link
                        to={`/stock/${stock.name}`}
                        className="stock-link"
                        title="View details"
                      >
                        <span className="stock-link-text">
                          {stock.name}
                          <span className="stock-link-underline" />
                        </span>
                      </Link>
                    </td>
                    <td style={{ textAlign: 'right' }}>{stock.qty}</td>
                    <td style={{ textAlign: 'right' }}>{stock.avg.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>{stock.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>{curValue.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: profit >= 0 ? '#2ecc40' : '#e74c3c', fontWeight: 600 }}>{profit.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', color: profitPercent >= 0 ? '#2ecc40' : '#e74c3c', fontWeight: 600 }}>{profitPercent.toFixed(2)}%</td>
                    <td style={{ textAlign: 'center' }}>
                      <Sparklines data={getSparklineData(stock)} width={60} height={20} margin={4}>
                        <SparklinesLine color={profit >= 0 ? '#2ecc40' : '#e74c3c'} style={{ fill: "none" }} />
                      </Sparklines>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button className="btn btn-red" onClick={() => openSellWindow(stock)}>
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
            Total Portfolio Value: <span style={{ color: '#007bff' }}>₹{totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      {/* Existing summary row and graph remain below */}
      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={{
        labels: allHoldings.map((stock) => stock.name),
        datasets: [
          {
            label: "Stock Price",
            data: allHoldings.map((stock) => stock.price),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      }} />
    </div>
  );
};

export default Holdings;
