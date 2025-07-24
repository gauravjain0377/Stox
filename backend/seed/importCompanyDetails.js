const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const CompanyInfo = require('../model/CompanyInfoModel');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/test';

async function main() {
  await mongoose.connect(MONGO_URL);
  const filePath = path.join(__dirname, 'companyDetails.json');
  const companies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const company of companies) {
    await CompanyInfo.findOneAndUpdate(
      { symbol: company.symbol },
      company,
      { upsert: true, new: true }
    );
    console.log(`Stored info for ${company.symbol}`);
  }
  await mongoose.disconnect();
  console.log('Done.');
}

main(); 