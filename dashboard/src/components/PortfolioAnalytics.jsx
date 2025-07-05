import React, { useState } from "react";
import { Line, Doughnut, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { useTheme } from "../context/ThemeContext";
import "../styles/PortfolioAnalytics.css";

const timeOptions = ["Week", "Month", "Year"];

const PortfolioAnalytics = () => {
  const [time, setTime] = useState("Month");
  const { theme } = useTheme();

  // Dynamic color palette based on theme
  const softPalette = theme === 'dark' 
    ? ["#3b82f6", "#60a5fa", "#a5b4fc", "#fbbf24", "#34d399", "#f87171", "#f472b6"]
    : ["#2563eb", "#60a5fa", "#a5b4fc", "#fbbf24", "#34d399", "#f87171", "#f472b6"];

  const mockData = {
    portfolioHistory: {
      Week: [3100, 3200, 3150, 3300, 3400, 3500, 3550],
      Month: [2800, 2850, 2900, 3000, 3100, 3200, 3150, 3300, 3400, 3500, 3550],
      Year: [2000, 2100, 2200, 2500, 2700, 3000, 3200, 3400, 3550]
    },
    sectorAllocation: {
      labels: ["IT", "Finance", "Energy", "Pharma", "Auto"],
      data: [40, 25, 15, 10, 10]
    },
    pnlPerStock: {
      labels: ["INFY", "TCS", "ONGC", "HDFCBANK", "RELIANCE"],
      data: [1200, 800, -200, 400, -100]
    },
    tradePerformance: {
      win: 18,
      loss: 7
    }
  };

  // Portfolio Value Over Time
  const lineData = {
    labels: Array(mockData.portfolioHistory[time].length)
      .fill(0)
      .map((_, i) => `${time} ${i + 1}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: mockData.portfolioHistory[time],
        borderColor: theme === 'dark' ? "#3b82f6" : "#2563eb",
        backgroundColor: theme === 'dark' ? "rgba(59,130,246,0.1)" : "rgba(37,99,235,0.08)",
        tension: 0.3,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 7
      }
    ]
  };

  // Sector-wise Allocation
  const doughnutData = {
    labels: mockData.sectorAllocation.labels,
    datasets: [
      {
        data: mockData.sectorAllocation.data,
        backgroundColor: softPalette,
        borderWidth: 2
      }
    ]
  };

  // Profit/Loss Per Stock
  const barData = {
    labels: mockData.pnlPerStock.labels,
    datasets: [
      {
        label: "Profit/Loss (₹)",
        data: mockData.pnlPerStock.data,
        backgroundColor: mockData.pnlPerStock.data.map(v =>
          v >= 0 ? "#34d399" : "#f87171"
        )
      }
    ]
  };

  // Trade Performance
  const pieData = {
    labels: ["Win", "Loss"],
    datasets: [
      {
        data: [mockData.tradePerformance.win, mockData.tradePerformance.loss],
        backgroundColor: ["#34d399", "#f87171"]
      }
    ]
  };

  // Chart options with theme-aware colors
  const chartOptions = {
    plugins: { 
      tooltip: { enabled: true },
      legend: { 
        position: "bottom",
        labels: {
          color: theme === 'dark' ? '#f8fafc' : '#1e293b'
        }
      }
    },
    scales: { 
      x: { 
        grid: { color: theme === 'dark' ? '#334155' : '#f3f4f6' },
        ticks: { color: theme === 'dark' ? '#cbd5e1' : '#64748b' }
      }, 
      y: { 
        grid: { color: theme === 'dark' ? '#334155' : '#f3f4f6' },
        ticks: { color: theme === 'dark' ? '#cbd5e1' : '#64748b' }
      } 
    }
  };

  return (
    <div className="portfolio-analytics-container">
      <div className="analytics-header">
        <h2>Portfolio Analytics</h2>
        <div className="time-filters">
          {timeOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setTime(opt)}
              className={`time-filter-btn ${time === opt ? 'active' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      
      <div className="analytics-grid">
        <div className="chart-card">
          <h4>Portfolio Value Over Time</h4>
          <Line data={lineData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h4>Sector Allocation</h4>
          <Doughnut data={doughnutData} options={chartOptions} />
        </div>
      </div>
      
      <div className="analytics-grid">
        <div className="chart-card">
          <h4>Profit/Loss Per Stock</h4>
          <Bar data={barData} options={{
            ...chartOptions,
            indexAxis: "y"
          }} />
        </div>
        <div className="chart-card">
          <h4>Trade Performance</h4>
          <Pie data={pieData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics; 