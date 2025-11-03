const Stock = require('../model/StockModel');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
yahooFinance._notices.suppress(['yahooSurvey']);
const CompanyInfo = require('../model/CompanyInfoModel');

exports.getStocks = async (req, res, next) => {
  try {
    console.log('Fetching all stocks from database');
    const stocks = await Stock.find();
    console.log(`Found ${stocks.length} stocks`);
    res.json(stocks);
  } catch (err) {
    console.error('Error fetching stocks:', err);
    next(err);
  }
};

exports.getStockBySymbol = async (req, res, next) => {
  try {
    console.log('Fetching stock by symbol:', req.params.symbol);
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
    if (!stock) {
      console.log('Stock not found:', req.params.symbol);
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.json(stock);
  } catch (err) {
    console.error('Error fetching stock by symbol:', err);
    next(err);
  }
};

exports.getStocksData = async (req, res) => {
  try {
    const symbols = req.query.symbols;
    console.log('Fetching stock data for symbols:', symbols);
    if (!symbols) {
      return res.status(400).json({ data: [], error: 'No symbols provided' });
    }
    const symbolList = symbols.split(',').map(s => s.trim());
    const results = await Promise.all(
      symbolList.map(async (symbol) => {
        try {
          // Append .NS if not present for Indian stocks
          const yfSymbol = /\.(NS|BSE)$/i.test(symbol) ? symbol : symbol + '.NS';
          console.log('Fetching Yahoo Finance data for:', yfSymbol);
          const data = await yahooFinance.quote(yfSymbol);
          
          // Check if data is valid
          if (!data) {
            console.warn(`⚠️  No data returned for ${yfSymbol}`);
            return { symbol, error: 'No data returned' };
          }
          
          // Calculate lower and upper circuit limits (5% from previous close)
          const previousClose = data.regularMarketPreviousClose || 0;
          const lowerCircuit = previousClose ? Number((previousClose * 0.95).toFixed(2)) : null;
          const upperCircuit = previousClose ? Number((previousClose * 1.05).toFixed(2)) : null;
          
          return {
            symbol: symbol, // base symbol for matching
            name: data.shortName,
            price: data.regularMarketPrice,
            percentChange: data.regularMarketChangePercent,
            previousClose: previousClose || null,
            lowerCircuit: lowerCircuit,
            upperCircuit: upperCircuit,
            volume: data.regularMarketVolume,
            marketCap: data.marketCap || null,
          };
        } catch (err) {
          console.error(`Error fetching data for ${symbol}:`, err.message);
          return { symbol, error: 'Not found or unavailable' };
        }
      })
    );
    res.json({ data: results });
  } catch (error) {
    console.error('Error in getStocksData:', error);
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
    
    // Check if data is valid
    if (!data) {
      return res.status(404).json({ error: 'No data found' });
    }
    
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
  try {
    const symbol = req.params.symbol;
    
    if (!symbol) {
      return res.status(400).json({ 
        success: false,
        error: 'Stock symbol is required' 
      });
    }
    
    // Try exact match first, then uppercase, then case-insensitive
    let info = await CompanyInfo.findOne({ symbol: symbol });
    if (!info) {
      info = await CompanyInfo.findOne({ symbol: symbol.toUpperCase() });
    }
    if (!info) {
      info = await CompanyInfo.findOne({ symbol: { $regex: new RegExp(`^${symbol}$`, 'i') } });
    }
    
    if (info) {
      // Return consistent data structure with all fields
      res.json({
        success: true,
        data: info
      });
    } else {
      // Return consistent error structure
      res.status(404).json({ 
        success: false,
        error: 'No company info found for this stock symbol' 
      });
    }
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error while fetching company information' 
    });
  }
};

exports.getAllCompanyInfo = async (req, res) => {
  try {
    const all = await CompanyInfo.find({});
    res.json({
      success: true,
      data: all
    });
  } catch (error) {
    console.error('Error fetching all company info:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error while fetching company information' 
    });
  }
};