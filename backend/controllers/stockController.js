const Stock = require('../model/StockModel');

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