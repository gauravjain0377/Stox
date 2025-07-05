const mongoose = require('mongoose');
const Stock = require('../model/StockModel');
require('dotenv').config();

const stocks = [
  { symbol: "TCS", fullName: "Tata Consultancy Services Ltd.", price: 3194.80, percent: -0.25, volume: "1.8M", marketCap: "11.7T" },
  { symbol: "RELIANCE", fullName: "Reliance Industries Ltd.", price: 2745.30, percent: 0.42, volume: "3.2M", marketCap: "18.3T" },
  { symbol: "INFY", fullName: "Infosys Ltd.", price: 1567.90, percent: -1.15, volume: "2.1M", marketCap: "6.7T" },
  { symbol: "HDFCBANK", fullName: "HDFC Bank Ltd.", price: 1578.40, percent: 0.75, volume: "2.9M", marketCap: "11.9T" },
  { symbol: "ICICIBANK", fullName: "ICICI Bank Ltd.", price: 1076.20, percent: -0.60, volume: "4.3M", marketCap: "7.5T" },
  { symbol: "BHARTIARTL", fullName: "Bharti Airtel Ltd.", price: 1082.65, percent: 0.90, volume: "1.4M", marketCap: "6.1T" },
  { symbol: "HCLTECH", fullName: "HCL Technologies Ltd.", price: 1372.15, percent: -0.33, volume: "950K", marketCap: "3.9T" },
  { symbol: "WIPRO", fullName: "Wipro Ltd.", price: 527.80, percent: 0.28, volume: "1.1M", marketCap: "2.8T" },
  { symbol: "AXISBANK", fullName: "Axis Bank Ltd.", price: 1078.90, percent: -0.12, volume: "3.6M", marketCap: "4.2T" },
  { symbol: "KOTAKBANK", fullName: "Kotak Mahindra Bank Ltd.", price: 1640.35, percent: 0.21, volume: "1.2M", marketCap: "4.8T" }
];

// Use default URI if environment variable is not set
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test";

console.log('Connecting to MongoDB...');
console.log('URI:', mongoUri);

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
    await Stock.deleteMany({});
    console.log('Cleared existing stocks');
    await Stock.insertMany(stocks);
    console.log('Stocks seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('\nTo fix this:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Create a .env file in the backend folder with:');
    console.log('   MONGO_URI=mongodb://localhost:27017/stockdb');
    process.exit(1);
  }); 