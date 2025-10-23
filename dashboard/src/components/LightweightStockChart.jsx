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
  // Generate highly detailed, realistic chart data with natural volatility
  const generateRealisticChartData = (range, basePrice, symbol, percent) => {
    const now = new Date();
    const data = [];
    const labels = [];
    let points = 0;
    const seed = getSeedFromSymbol(symbol || "");
    const rand = (i) => seededRandom(seed + i);
    
    // Determine starting price based on percent change
    const startPrice = basePrice / (1 + percent / 100);
    let currentValue = startPrice;
    
    switch (range) {
      case '1D':
        // ULTRA HIGH-FREQUENCY: 375 points (every minute 9:15 AM - 3:30 PM)
        points = 375;
        for (let i = 0; i < points; i++) {
          const totalMinutes = i;
          const hour = 9 + Math.floor((15 + totalMinutes) / 60);
          const minute = (15 + totalMinutes) % 60;
          
          // Show labels every 30 minutes
          if (i % 30 === 0 || i === 0 || i === points - 1) {
            labels.push(`${hour}:${minute.toString().padStart(2, '0')}`);
          } else {
            labels.push('');
          }
          
          const targetPrice = basePrice;
          const trendToTarget = (targetPrice - currentValue) * 0.015;
          const volatility = basePrice * 0.002;
          const randomWalk = (rand(i) - 0.5) * 2 * volatility;
          const momentum = i > 0 ? (data[i - 1] - (i > 1 ? data[i - 2] : startPrice)) * 0.3 : 0;
          
          currentValue = currentValue + trendToTarget + randomWalk + momentum;
          currentValue = Math.max(startPrice * 0.97, Math.min(startPrice * 1.03, currentValue));
          data.push(Number(currentValue.toFixed(2)));
        }
        break;
        
      case '1W':
        // HIGH-FREQUENCY: 150 points (every 30 minutes for a week)
        points = 150;
        for (let i = 0; i < points; i++) {
          const totalMinutes = i * 30;
          const tradingDays = Math.floor(totalMinutes / 390); // 390 min per day
          const minutesInDay = totalMinutes % 390;
          
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - tradingDays));
          date.setHours(9, 15 + minutesInDay, 0, 0);
          
          // Show date labels for each day
          if (minutesInDay < 30 || i === 0 || i === points - 1) {
            labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
          } else {
            labels.push('');
          }
          
          const targetPrice = basePrice;
          const trendToTarget = (targetPrice - currentValue) * 0.012;
          const volatility = basePrice * 0.004;
          const randomWalk = (rand(i * 2) - 0.5) * 2 * volatility;
          const momentum = i > 0 ? (data[i - 1] - (i > 1 ? data[i - 2] : startPrice)) * 0.4 : 0;
          
          currentValue = currentValue + trendToTarget + randomWalk + momentum;
          currentValue = Math.max(startPrice * 0.92, Math.min(startPrice * 1.08, currentValue));
          data.push(Number(currentValue.toFixed(2)));
        }
        break;
        
      case '1M':
        // HIGH-FREQUENCY: 120 points (every 2-3 hours for a month)
        points = 120;
        for (let i = 0; i < points; i++) {
          const hoursPerPoint = (20 * 6.5) / points; // 20 trading days, 6.5 hours each
          const totalHours = i * hoursPerPoint;
          const tradingDay = Math.floor(totalHours / 6.5);
          
          const date = new Date(now);
          date.setDate(now.getDate() - (19 - tradingDay));
          
          // Show date every 6 points (roughly every day)
          if (i % 6 === 0 || i === 0 || i === points - 1) {
            labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
          } else {
            labels.push('');
          }
          
          const targetPrice = basePrice;
          const trendToTarget = (targetPrice - currentValue) * 0.018;
          const volatility = basePrice * 0.006;
          const randomWalk = (rand(i * 3) - 0.5) * 2 * volatility;
          const momentum = i > 0 ? (data[i - 1] - (i > 1 ? data[i - 2] : startPrice)) * 0.35 : 0;
          
          currentValue = currentValue + trendToTarget + randomWalk + momentum;
          currentValue = Math.max(startPrice * 0.85, Math.min(startPrice * 1.15, currentValue));
          data.push(Number(currentValue.toFixed(2)));
        }
        break;
        
      case '1Y':
        // DAILY DATA: 250 points (every trading day for a year)
        points = 250;
        for (let i = 0; i < points; i++) {
          const daysAgo = Math.floor((249 - i) * 1.46); // ~365 days / 250 trading days
          const date = new Date(now);
          date.setDate(now.getDate() - daysAgo);
          
          // Show month labels
          if (i % 20 === 0 || i === 0 || i === points - 1) {
            labels.push(date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));
          } else {
            labels.push('');
          }
          
          const targetPrice = basePrice;
          const trendToTarget = (targetPrice - currentValue) * 0.025;
          const volatility = basePrice * 0.012;
          const randomWalk = (rand(i * 5) - 0.5) * 2 * volatility;
          const momentum = i > 0 ? (data[i - 1] - (i > 1 ? data[i - 2] : startPrice)) * 0.3 : 0;
          
          currentValue = currentValue + trendToTarget + randomWalk + momentum;
          currentValue = Math.max(startPrice * 0.7, Math.min(startPrice * 1.4, currentValue));
          data.push(Number(currentValue.toFixed(2)));
        }
        break;
        
      case '5Y':
        // WEEKLY DATA: 260 points (every week for 5 years)
        points = 260;
        for (let i = 0; i < points; i++) {
          const weeksAgo = 259 - i;
          const date = new Date(now);
          date.setDate(now.getDate() - (weeksAgo * 7));
          
          // Show year labels
          if (i % 52 === 0 || i === 0 || i === points - 1) {
            labels.push(date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }));
          } else {
            labels.push('');
          }
          
          const targetPrice = basePrice;
          const trendToTarget = (targetPrice - currentValue) * 0.015;
          const volatility = basePrice * 0.018;
          const randomWalk = (rand(i * 7) - 0.5) * 2 * volatility;
          const momentum = i > 0 ? (data[i - 1] - (i > 1 ? data[i - 2] : startPrice)) * 0.25 : 0;
          
          currentValue = currentValue + trendToTarget + randomWalk + momentum;
          currentValue = Math.max(startPrice * 0.5, Math.min(startPrice * 2, currentValue));
          data.push(Number(currentValue.toFixed(2)));
        }
        break;
        
      default:
        // MONTHLY DATA: 300 points (every month for 25 years)
        points = 300;
        for (let i = 0; i < points; i++) {
          const monthsAgo = 299 - i;
          const date = new Date(now);
          date.setMonth(now.getMonth() - monthsAgo);
          
          // Show year labels
          if (i % 24 === 0 || i === 0 || i === points - 1) {
            labels.push(date.toLocaleDateString('en-IN', { year: 'numeric' }));
          } else {
            labels.push('');
          }
          
          const targetPrice = basePrice;
          const trendToTarget = (targetPrice - currentValue) * 0.01;
          const volatility = basePrice * 0.022;
          const randomWalk = (rand(i * 10) - 0.5) * 2 * volatility;
          const momentum = i > 0 ? (data[i - 1] - (i > 1 ? data[i - 2] : startPrice)) * 0.2 : 0;
          
          currentValue = currentValue + trendToTarget + randomWalk + momentum;
          currentValue = Math.max(startPrice * 0.3, Math.min(startPrice * 3, currentValue));
          data.push(Number(currentValue.toFixed(2)));
        }
    }
    
    return { labels, data, startPrice };
  };
  
  const { labels, data, startPrice } = generateRealisticChartData(range, price, symbol, percent);
  
  // Determine if overall trend is gain or loss
  const finalPrice = data[data.length - 1];
  const overallGain = finalPrice >= startPrice;
  
  // Create gradient that changes color at the starting price level
  const chartData = {
    labels,
    datasets: [
      {
        label: `${symbol} Price`,
        data,
        borderColor: overallGain ? '#22c55e' : '#ef4444',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const chartArea = context.chart.chartArea;
          
          if (!chartArea) {
            return null;
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          
          if (overallGain) {
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
            gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.2)');
            gradient.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
          } else {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
            gradient.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');
          }
          
          return gradient;
        },
        fill: true,
        tension: 0.2, // Smooth but not too smooth - realistic
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: overallGain ? '#22c55e' : '#ef4444',
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: overallGain ? '#22c55e' : '#ef4444',
        borderWidth: 2,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return context[0].label || '';
          },
          label: (context) => {
            const value = context.parsed.y;
            const change = ((value - startPrice) / startPrice * 100).toFixed(2);
            const changeText = change >= 0 ? `+${change}%` : `${change}%`;
            return [
              `Price: ₹${value.toFixed(2)}`,
              `Change: ${changeText}`
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          drawBorder: true,
          borderColor: '#e5e7eb',
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        ticks: {
          callback: (value) => `₹${value.toFixed(0)}`,
          color: '#6b7280',
          font: {
            size: 11,
          },
          padding: 8,
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
  };
  
  return (
    <div style={{ width: '100%', height: '350px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LightweightStockChart;
