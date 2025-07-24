import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { useGeneralContext } from './GeneralContext';
import StockInfoTabs from './StockInfoTabs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
);

// Simple seeded pseudo-random generator
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
const generateMockChartData = (range, price, symbol, percent) => {
  const now = new Date();
  let labels = [];
  let data = [];
  let points = 0;
  const seed = getSeedFromSymbol(symbol || "");
  let rand = (i) => {
    // Deterministic pseudo-random for each stock
    return seededRandom(seed + i);
  };
  switch (range) {
    case '1D': {
      const startHour = 9, startMinute = 15, totalMinutes = 390;
      let open = price;
      let last = open;
      // Bias trend based on percent
      let trendBias = percent >= 0 ? 0.0003 : -0.0003;
      for (let i = 0; i < totalMinutes; i++) {
        const hour = startHour + Math.floor((startMinute + i) / 60);
        const minute = (startMinute + i) % 60;
        labels.push(minute === 0 ? `${hour}:${minute.toString().padStart(2, '0')}` : '');
        // Simulate realistic market movement with bias
        let trend = trendBias * i;
        if (i > 120 && i < 270) trend += (percent >= 0 ? -0.0002 : 0.0002) * (i - 120); // midday reversal
        // Add small seeded random noise
        const noise = (rand(i) - 0.5) * open * 0.002;
        let next = open * (1 + trend) + noise;
        // Clamp to ±2% of open
        next = Math.max(open * 0.98, Math.min(open * 1.02, next));
        last = next;
        data.push(Number(last.toFixed(2)));
      }
      break;
    }
    case '2D':
      points = 40;
      for (let i = 0; i < points; i++) {
        labels.push(`Day ${1 + Math.floor(i/20)} ${9 + Math.floor((i%20)/2)}:${(i%2)*30 === 0 ? '00' : '30'}`);
        data.push(price * (0.97 + Math.random() * 0.06));
      }
      break;
    case '1W':
      points = 7;
      for (let i = 0; i < points; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        labels.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
        data.push(price * (0.95 + Math.random() * 0.1));
      }
      break;
    case '1M':
      points = 30;
      for (let i = 0; i < points; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - (29 - i));
        labels.push(`${d.getDate()}/${d.getMonth()+1}`);
        data.push(price * (0.9 + Math.random() * 0.2));
      }
      break;
    case '1Y':
      points = 12;
      for (let i = 0; i < points; i++) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - (11 - i));
        labels.push(d.toLocaleDateString('en-IN', { month: 'short' }));
        data.push(price * (0.8 + Math.random() * 0.4));
      }
      break;
    case '5Y':
      points = 5;
      for (let i = 0; i < points; i++) {
        const d = new Date(now);
        d.setFullYear(now.getFullYear() - (4 - i));
        labels.push(d.getFullYear().toString());
        data.push(price * (0.5 + Math.random() * 1.0));
      }
      break;
    case 'All':
      points = 10;
      for (let i = 0; i < points; i++) {
        const d = new Date(now);
        d.setFullYear(now.getFullYear() - (9 - i));
        labels.push(d.getFullYear().toString());
        data.push(price * (0.3 + Math.random() * 1.5));
      }
      break;
    default:
      labels = [];
      data = [];
  }
  return { labels, data };
};

// Realistic monotonic random walk for smooth, natural price action, with optimal point count and spacing
function generateRealisticLineData(range, price, symbol, percent) {
  const now = new Date();
  let labels = [];
  let data = [];
  let points = 0;
  const seed = getSeedFromSymbol(symbol || "");
  let rand = (i) => seededRandom(seed + i);
  let base = price;
  let interval = 1;
  let volatility = 0.012 + Math.abs(percent) * 0.006;
  let clampLow = 0.8, clampHigh = 1.2;
  switch (range) {
    case '1D': points = 90; interval = Math.floor(376 / 90); volatility = 0.012 + Math.abs(percent) * 0.006; clampLow = 0.8; clampHigh = 1.2; break;
    case '1W': points = 60; interval = Math.floor(240 / 60); volatility = 0.015 + Math.abs(percent) * 0.008; clampLow = 0.8; clampHigh = 1.2; break;
    case '1M': points = 120; interval = Math.floor(120 / 120); volatility = 0.025 + Math.abs(percent) * 0.012; clampLow = 0.75; clampHigh = 1.25; break;
    case '1Y': points = 52; interval = Math.floor(260 / 52); volatility = 0.03 + Math.abs(percent) * 0.015; clampLow = 0.7; clampHigh = 1.3; break;
    case '5Y': points = 60; interval = 1; volatility = 0.10 + Math.abs(percent) * 0.05; clampLow = 0.5; clampHigh = 1.5; break;
    case 'All': points = 60; interval = 1; volatility = 0.15 + Math.abs(percent) * 0.08; clampLow = 0.4; clampHigh = 1.6; break;
    default: points = 60; interval = 1; break;
  }
  let last = base;
  for (let i = 0; i < points; i++) {
    let maxStep = base * volatility;
    let step = (rand(i) - 0.5) * 2 * maxStep;
    let trend = (percent / 100) * (i / points) * base * 0.5;
    let next = last + step + trend;
    // Clamp for realism
    next = Math.max(base * clampLow, Math.min(base * clampHigh, next));
    last = next;
    data.push(Number(last.toFixed(2)));
    let d = new Date(now);
    if (range === '1D') {
      d.setHours(9, 15, 0, 0);
      d.setMinutes(d.getMinutes() + i * Math.floor(376 / points));
    } else if (range === '1W') {
      d.setDate(now.getDate() - (points - i - 1));
    } else if (range === '1M') {
      d.setDate(now.getDate() - (points - i - 1));
    } else if (range === '1Y') {
      d.setDate(now.getDate() - (points - i - 1) * Math.floor(365 / points));
    } else if (range === '5Y') {
      d.setMonth(now.getMonth() - (points - i - 1)); // ~1 month apart
    } else if (range === 'All') {
      d.setMonth(now.getMonth() - (points - i - 1) * 2); // ~2 months apart
    }
    labels.push(d);
  }
  return { labels, data };
}

// Generate realistic OHLC data for candlestick chart
function generateOHLCData(range, price, symbol, percent) {
  const now = new Date();
  let data = [];
  let points = 0;
  const seed = getSeedFromSymbol(symbol || "");
  let rand = (i) => seededRandom(seed + i);
  let base = price;
  switch (range) {
    case '1W': points = 7; break;
    case '1M': points = 30; break;
    case '1Y': points = 52; break;
    case '5Y': points = 60; break;
    case 'All': points = 60; break;
    default: points = 30;
  }
  let prevClose = base;
  for (let i = 0; i < points; i++) {
    let open = prevClose;
    let trend = (percent / 100) * (i / points) * base * 0.5;
    let close = open * (1 + (rand(i) - 0.5) * 0.08 + trend / base);
    let high = Math.max(open, close) * (1 + rand(i + 1) * 0.04);
    let low = Math.min(open, close) * (1 - rand(i + 2) * 0.04);
    high = Math.min(high, base * 1.2);
    low = Math.max(low, base * 0.8);
    let d = new Date(now);
    if (range === '1W') {
      d.setDate(now.getDate() - (points - i - 1));
    } else if (range === '1M') {
      d.setDate(now.getDate() - (points - i - 1));
    } else if (range === '1Y') {
      d.setDate(now.getDate() - (points - i - 1) * 7);
    } else {
      d.setFullYear(now.getFullYear() - (points - i - 1));
    }
    data.push({ x: d, o: Number(open.toFixed(2)), h: Number(high.toFixed(2)), l: Number(low.toFixed(2)), c: Number(close.toFixed(2)) });
    prevClose = close;
  }
  return data;
}

const StockDetail = () => {
  const { selectedStock } = useGeneralContext();
  const navigate = useNavigate();
  const [tradeAlert, setTradeAlert] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // Time range options for candlestick chart
  const timeRanges = [
    { label: '1D', points: 60, trend: 0.002 },
    { label: '1W', points: 7, trend: 0.01 },
    { label: '1M', points: 30, trend: 0.02 },
    { label: '1Y', points: 52, trend: 0.05 },
    { label: '5Y', points: 60, trend: 0.1 },
    { label: 'All', points: 100, trend: 0.15 },
  ];
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);

  // Generate random OHLC data for candlestick with real Date objects
  function generateRandomOHLC(base, points = 60, trendStrength = 0.004) {
    let arr = [];
    let prevClose = base;
    const trend = (Math.random() - 0.5) * trendStrength;
    const now = new Date();
    for (let i = 0; i < points; i++) {
      let open = prevClose;
      let close = open * (1 + (Math.random() - 0.5) * 0.02 + trend);
      let high = Math.max(open, close) * (1 + Math.random() * 0.01);
      let low = Math.min(open, close) * (1 - Math.random() * 0.01);
      // Clamp for realism
      high = Math.min(high, base * 1.1);
      low = Math.max(low, base * 0.9);
      // Date: go back (points - i - 1) days from now
      let date = new Date(now);
      date.setDate(now.getDate() - (points - i - 1));
      arr.push({ x: date, o: Number(open.toFixed(2)), h: Number(high.toFixed(2)), l: Number(low.toFixed(2)), c: Number(close.toFixed(2)) });
      prevClose = close;
    }
    return arr;
  }

  // Generate line chart data for selected range (use improved generator)
  const lineChartData = React.useMemo(() => {
    if (!selectedStock) return { labels: [], datasets: [] };
    const { label } = selectedRange;
    const { labels, data } = generateRealisticLineData(label, selectedStock.price, selectedStock.symbol, selectedStock.percent);
    // Use percent if available, otherwise fallback to price comparison
    let isGain = false;
    if (typeof selectedStock.percent === 'number') {
      isGain = selectedStock.percent >= 0;
    } else {
      isGain = data.length > 1 && data[data.length - 1] >= data[0];
    }
    const lineColor = isGain ? '#22c55e' : '#ef4444';
    const areaStart = isGain ? 'rgba(34,197,94,0.10)' : 'rgba(239,68,68,0.10)';
    const areaEnd = isGain ? 'rgba(34,197,94,0.00)' : 'rgba(239,68,68,0.00)';
    return {
      labels,
      datasets: [
        {
          label: '',
          data,
          borderColor: (ctx) => {
            if (!ctx || !ctx.chart || !ctx.chart.chartArea) return lineColor;
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, lineColor);
            gradient.addColorStop(1, lineColor);
            return gradient;
          },
          borderWidth: 3.5,
          pointRadius: 0,
          fill: true,
          backgroundColor: (ctx) => {
            if (!ctx || !ctx.chart || !ctx.chart.chartArea) return areaStart;
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, areaStart);
            gradient.addColorStop(1, areaEnd);
            return gradient;
          },
          tension: 0.25,
          shadowBlur: 8,
          shadowColor: lineColor,
        },
      ],
    };
  }, [selectedStock, selectedRange]);

  const ohlcData = React.useMemo(() => {
    if (!selectedStock || selectedRange.label === '1D') return null;
    return generateOHLCData(selectedRange.label, selectedStock.price, selectedStock.symbol, selectedStock.percent);
  }, [selectedStock, selectedRange]);

  // Trade simulation
  const handleTrade = (type) => {
    setTradeAlert(`Simulated: ${type === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${symbol}`);
    setTimeout(() => setTradeAlert(null), 2000);
  };

  if (!selectedStock) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No Stock Selected</h2>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Go Back</button>
      </div>
    );
  }

  const price = selectedStock.price;
  const name = selectedStock.name;
  const symbol = selectedStock.symbol;
  const percent = selectedStock.percent;

  const chartType = selectedRange.label === '1D' ? 'line' : 'candlestick';
  const isLine = chartType === 'line';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                &#8592;
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{name}</h1>
                <p className="text-sm text-gray-500">{symbol}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">₹{price ? price.toLocaleString() : 'N/A'}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`text-sm font-semibold ${percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{percent >= 0 ? '+' : ''}{typeof percent === 'number' ? percent.toFixed(2) : 'N/A'}%</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <div className="flex gap-2 my-4">
                  {timeRanges.map((r) => (
                    <button
                      key={r.label}
                      className={`px-3 py-1 rounded ${selectedRange.label === r.label ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setSelectedRange(r)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                {/* Chart rendering */}
                <Line
                  data={{
                    labels: lineChartData.labels,
                    datasets: lineChartData.datasets,
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                      axis: 'x',
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        enabled: true,
                        backgroundColor: '#222',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#222',
                        borderWidth: 1,
                        cornerRadius: 6,
                        padding: 12,
                        callbacks: {
                          label: ctx => {
                            const price = ctx.parsed.y;
                            const idx = ctx.dataIndex;
                            const range = selectedRange.label;
                            const dateObj = ctx.chart.data.labels[idx];
                            let dateStr = '';
                            if (range === '1D') {
                              dateStr = `${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
                            } else if (range === '1W' || range === '1M') {
                              dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                            } else {
                              dateStr = dateObj.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                            }
                            return `₹${price} | ${dateStr}`;
                          },
                        },
                        displayColors: false,
                        caretSize: 0,
                        yAlign: 'bottom',
                        mode: 'index',
                        intersect: false,
                      },
                    },
                    scales: {
                      x: {
                        display: false,
                        grid: { display: false },
                        ticks: { display: false },
                        type: 'time',
                        time: {
                          tooltipFormat: 'PPpp',
                        },
                      },
                      y: {
                        display: false,
                        grid: { display: false },
                        ticks: { display: false },
                        min: lineChartData.datasets[0]?.data ? Math.min(...lineChartData.datasets[0].data) * 0.98 : undefined,
                        max: lineChartData.datasets[0]?.data ? Math.max(...lineChartData.datasets[0].data) * 1.02 : undefined,
                      },
                    },
                    layout: {
                      padding: {
                        left: 10,
                        right: 10,
                        top: 30,
                        bottom: 20,
                      },
                    },
                  }}
                  height={250}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6">
                <StockInfoTabs symbol={symbol + '.BSE'} />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade</h3>
              {tradeAlert && <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">{tradeAlert}</div>}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter quantity" />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Total Cost</span>
                  <span className="font-semibold">₹{price && quantity ? (price * quantity).toLocaleString() : '0'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2" onClick={() => handleTrade('buy')}><span>Buy</span></button>
                  <button className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2" onClick={() => handleTrade('sell')}><span>Sell</span></button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-gray-600">Open</span><span className="font-semibold">-</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">High</span><span className="font-semibold">-</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Low</span><span className="font-semibold">-</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Market Cap</span><span className="font-semibold">-</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Volume</span><span className="font-semibold">-</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Dividend Yield</span><span className="font-semibold">-</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail; 