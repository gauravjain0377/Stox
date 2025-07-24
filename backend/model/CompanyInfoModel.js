const mongoose = require('mongoose');

const CompanyInfoSchema = new mongoose.Schema({
  company_name: String,
  symbol: { type: String, required: true, unique: true },
  sector: String,
  about: String,
  financials_2025: mongoose.Schema.Types.Mixed,
  news_2025: [mongoose.Schema.Types.Mixed],
  history: String
});

module.exports = mongoose.model('CompanyInfo', CompanyInfoSchema); 