const Stock = require('../model/StockModel');
const yahooFinance = require('yahoo-finance2').default;
const CompanyInfo = require('../model/CompanyInfoModel');

exports.getStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    next(err);
  }
};

exports.getStockBySymbol = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (err) {
    next(err);
  }
};

exports.getStocksData = async (req, res) => {
  try {
    const symbols = req.query.symbols;
    if (!symbols) {
      return res.status(400).json({ data: [], error: 'No symbols provided' });
    }
    const symbolList = symbols.split(',').map(s => s.trim());
    const results = await Promise.all(
      symbolList.map(async (symbol) => {
        try {
          // Append .NS if not present for Indian stocks
          const yfSymbol = /\.(NS|BSE)$/i.test(symbol) ? symbol : symbol + '.NS';
          const data = await yahooFinance.quote(yfSymbol);
          return {
            symbol: symbol, // base symbol for matching
            name: data.shortName,
            price: data.regularMarketPrice,
            percentChange: data.regularMarketChangePercent,
            previousClose: data.regularMarketPreviousClose, // <-- add this
            volume: data.regularMarketVolume,
            marketCap: data.marketCap,
          };
        } catch (err) {
          return { symbol, error: 'Not found or unavailable' };
        }
      })
    );
    res.json({ data: results });
  } catch (error) {
    res.status(500).json({ data: [], error: error.message });
  }
};

// Get static stock info (name, symbol, etc.) from MongoDB
exports.getStockInfo = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json({ symbol: stock.symbol, name: stock.fullName });
  } catch (err) {
    next(err);
  }
};

// Get live price and percent from Yahoo Finance
exports.getStockPrice = async (req, res, next) => {
  try {
    const data = await yahooFinance.quote(req.params.symbol);
    res.json({ price: data.regularMarketPrice, percent: data.regularMarketChangePercent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch price' });
  }
};

// Get historical chart data from Yahoo Finance
exports.getStockHistory = async (req, res, next) => {
  const { range = '1d', interval = '5m' } = req.query;
  try {
    const result = await yahooFinance._chart(req.params.symbol, { range, interval });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// Remove company info logic from Yahoo Finance overview controller
// Only keep real-time price and trading logic in this file
// (No company info logic here)

// Alpha Vantage: Financials
exports.getCompanyFinancials = async (req, res) => {
  try {
    const data = await fetchCompanyFinancials(req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Alpha Vantage: News
exports.getCompanyNews = async (req, res) => {
  try {
    const data = await fetchCompanyNews(req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Alpha Vantage: History
exports.getCompanyHistory = async (req, res) => {
  try {
    const data = await fetchCompanyHistory(req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getCompanyInfo = async (req, res) => {
  const info = await CompanyInfo.findOne({ symbol: req.params.symbol });
  if (info) {
    res.json(info);
  } else {
    res.status(404).json({ error: 'No company info found.' });
  }
};

exports.getAllCompanyInfo = async (req, res) => {
  const all = await CompanyInfo.find({});
  res.json(all);
}; 