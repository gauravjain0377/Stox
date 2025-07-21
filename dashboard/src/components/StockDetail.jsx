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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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

const StockDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRange, setSelectedRange] = useState('1D');

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/stocks/${symbol}`);
        if (!response.ok) {
          throw new Error('Stock not found');
        }
        const data = await response.json();
        setStock(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [symbol]);

  // Chart data using mock generator
  const chartData = stock ? (() => {
    const mock = generateMockChartData(selectedRange, stock.price, stock.symbol || stock.name, stock.percent);
    return {
      labels: mock.labels,
      datasets: [
        {
          label: 'Price',
          data: mock.data,
          borderColor: stock.percent >= 0 ? '#00b386' : '#e74c3c',
          borderWidth: 2,
          tension: 0.6,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  })() : { labels: [], datasets: [] };

  // Chart options as before
  const chartOptions = stock ? (() => {
    const mock = generateMockChartData(selectedRange, stock.price, stock.symbol || stock.name, stock.percent);
    const min = Math.min(...mock.data);
    const max = Math.max(...mock.data);
    const buffer = (max - min) * 0.02 || 1; // 2% buffer or at least 1
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#fff',
          borderWidth: 1,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `₹${context.parsed.y?.toFixed(2)}`,
            title: (context) => context[0].label,
          },
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          display: false,
          grid: { display: false, drawBorder: false },
          ticks: { display: false },
        },
        y: {
          display: false,
          grid: { display: false, drawBorder: false },
          ticks: { display: false },
          min: min - buffer,
          max: max + buffer,
        },
      },
      elements: { point: { radius: 0, hoverRadius: 4 } },
    };
  })() : {};

  const timeRanges = ['1D', '2D', '1W', '1M', '1Y', '5Y', 'All'];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stock details...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Stock Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    );
  }

  if (!stock) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{stock.symbol}</h1>
                <p className="text-sm text-gray-500">{stock.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">₹{stock.price ? stock.price.toLocaleString() : 'N/A'}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    {stock.percent >= 0 ? (
                      <TrendingUp size={16} className="text-green-600" />
                    ) : (
                      <TrendingDown size={16} className="text-red-600" />
                    )}
                    <span className={`text-sm font-semibold ${stock.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.percent >= 0 ? '+' : ''}{typeof stock.percent === 'number' ? stock.percent.toFixed(2) : 'N/A'}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Volume</p>
                  <p className="font-semibold">{stock.volume}</p>
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-64">
                <div className="flex gap-2 my-4">
                  {timeRanges.map((r) => (
                    <button
                      key={r}
                      className={`px-3 py-1 rounded ${selectedRange === r ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setSelectedRange(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <Line data={chartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm"
            >
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'financials', 'news', 'history'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Company Overview</h3>
                    <p className="text-gray-600">
                      {stock.fullName} is a leading company in the Indian market. The stock has shown 
                      {stock.percent >= 0 ? ' positive ' : ' negative '} 
                      performance with a {typeof stock.percent === 'number' ? stock.percent.toFixed(2) : 'N/A'}% change today.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <p className="text-sm text-gray-500">Market Cap</p>
                        <p className="font-semibold">{stock.marketCap}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Volume</p>
                        <p className="font-semibold">{stock.volume}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'financials' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Financial Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">P/E Ratio</p>
                        <p className="font-semibold">25.4</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">EPS</p>
                        <p className="font-semibold">₹125.6</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">ROE</p>
                        <p className="font-semibold">18.2%</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Debt/Equity</p>
                        <p className="font-semibold">0.3</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'news' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Latest News</h3>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900">Company Reports Strong Q3 Results</h4>
                        <p className="text-sm text-gray-600 mt-1">2 hours ago</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium text-gray-900">New Product Launch Announced</h4>
                        <p className="text-sm text-gray-600 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Trading History</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">52 Week High</span>
                        <span className="font-semibold">₹3,450</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">52 Week Low</span>
                        <span className="font-semibold">₹2,890</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Average Volume</span>
                        <span className="font-semibold">2.1M</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Buy/Sell Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                    <Plus size={16} />
                    <span>Buy</span>
                  </button>
                  <button className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                    <Minus size={16} />
                    <span>Sell</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Market Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open</span>
                  <span className="font-semibold">₹{stock.price ? stock.price.toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">High</span>
                  <span className="font-semibold">₹{stock.price ? (stock.price * 1.02).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Low</span>
                  <span className="font-semibold">₹{stock.price ? (stock.price * 0.98).toLocaleString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Market Cap</span>
                  <span className="font-semibold">{stock.marketCap}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StockDetail; 