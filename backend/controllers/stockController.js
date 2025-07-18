const Stock = require('../model/StockModel');
const yahooFinance = require('yahoo-finance2').default;

exports.getStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find().limit(10);
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
    // Fetch data for all symbols in parallel
    const results = await Promise.all(
      symbolList.map(async (symbol) => {
        try {
          const data = await yahooFinance.quote(symbol);
          console.log('Yahoo data for', symbol, ':', data); // Log the data
          return {
            symbol: data.symbol,
            name: data.shortName,
            price: data.regularMarketPrice,
            change: data.regularMarketChange,
            percentChange: data.regularMarketChangePercent,
            volume: data.regularMarketVolume,
            marketTime: data.regularMarketTime,
            currency: data.currency,
            exchange: data.fullExchangeName,
          };
        } catch (err) {
          console.error('Error fetching', symbol, ':', err.message); // Log the error
          return { symbol, error: 'Not found or unavailable' };
        }
      })
    );
    res.json({ data: results });
  } catch (error) {
    console.error('General error in getStocksData:', error.message); // Log general error
    res.status(500).json({ data: [], error: error.message });
  }
}; 