const mongoose = require('mongoose');

const CompanyInfoSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: String,
  sector: String,
  industry: String,
  description: String,
  marketCap: mongoose.Schema.Types.Mixed,
  peRatio: mongoose.Schema.Types.Mixed,
  eps: mongoose.Schema.Types.Mixed,
  dividendYield: mongoose.Schema.Types.Mixed,
  financials: mongoose.Schema.Types.Mixed,
  notes: String
});

module.exports = mongoose.model('CompanyInfo', CompanyInfoSchema); 