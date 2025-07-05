const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  price: { type: Number, required: true },
  percent: { type: Number, required: true },
  volume: { type: String, required: true },
  marketCap: { type: String, required: true }
});

module.exports = mongoose.model('Stock', StockSchema); 