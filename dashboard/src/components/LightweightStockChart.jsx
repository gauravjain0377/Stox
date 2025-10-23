import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Helper functions
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getSeedFromSymbol(symbol) {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const LightweightStockChart = ({ 
  symbol, 
  price, 
  percent, 
  range = '1D'
}) => {
  const generateChartData = (range, basePrice, symbol, percent) => {
    const now = new Date();
    const data = [];
    const labels = [];
    let points = 0;
    const seed = getSeedFromSymbol(symbol || "");
    const rand = (i) => seededRandom(seed + i);
    
    switch (range) {
      case '1D':
        points = 78;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setHours(9, 15 + i * 5, 0, 0);
          labels.push(i % 12 === 0 ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '');
          
          const volatility = 0.001;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          data.push(Number(value.toFixed(2)));
        }
        break;
        
      case '1W':
        points = 7;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          labels.push(date.toLocaleDateString('en-IN', { weekday: 'short' }));
          
          const volatility = 0.015;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          data.push(Number(value.toFixed(2)));
        }
        break;
        
      case '1M':
        points = 30;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - (29 - i));
          labels.push(i % 5 === 0 ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '');
          
          const volatility = 0.02;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          data.push(Number(value.toFixed(2)));
        }
        break;
        
      case '1Y':
        points = 52;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setDate(now.getDate() - (251 - i * 5));
          labels.push(i % 4 === 0 ? date.toLocaleDateString('en-IN', { month: 'short' }) : '');
          
          const volatility = 0.03;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          data.push(Number(value.toFixed(2)));
        }
        break;
        
      case '5Y':
        points = 60;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (59 - i));
          labels.push(i % 6 === 0 ? date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' }) : '');
          
          const volatility = 0.1;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          data.push(Number(value.toFixed(2)));
        }
        break;
        
      default:
        points = 100;
        for (let i = 0; i < points; i++) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (99 - i));
          labels.push(i % 10 === 0 ? date.toLocaleDateString('en-IN', { year: 'numeric' }) : '');
          
          const volatility = 0.15;
          const trend = (percent / 100) * (i / points);
          const noise = (rand(i) - 0.5) * 2 * volatility;
          const value = basePrice * (1 + trend + noise);
          data.push(Number(value.toFixed(2)));
        }
    }
    
    return { labels, data };
  };
  
  const { labels, data } = generateChartData(range, price, symbol, percent);
  const isGain = percent >= 0;
  
  const chartData = {
    labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data,
        borderColor: isGain ? '#22c55e' : '#ef4444',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 350);
          gradient.addColorStop(0, isGain ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)');
          gradient.addColorStop(1, isGain ? 'rgba(34, 197, 94, 0.0)' : 'rgba(239, 68, 68, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: isGain ? '#22c55e' : '#ef4444',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: isGain ? '#22c55e' : '#ef4444',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: (value) => `₹${value.toFixed(0)}`,
        },
      },
    },
  };
  
  return (
    <div style={{ width: '100%', height: '350px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LightweightStockChart;
