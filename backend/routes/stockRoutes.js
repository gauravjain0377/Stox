const express = require('express');
const router = express.Router();
const { getStocks, getStocksData, getStockInfo, getStockPrice, getStockHistory, getCompanyInfo, getAllCompanyInfo } = require('../controllers/stockController');

router.get('/data', getStocksData);
router.get('/', getStocks);
router.get('/allcompanyinfo', getAllCompanyInfo);
router.get('/:symbol/info', getStockInfo);
router.get('/:symbol/price', getStockPrice);
router.get('/:symbol/history', getStockHistory);
router.get('/:symbol/companyinfo', getCompanyInfo);
// router.get('/:symbol/overview', getStockOverview);
// router.get('/:symbol/financials', getCompanyFinancials);
// router.get('/:symbol/news', getCompanyNews);
// router.get('/:symbol/history/alpha', getCompanyHistory);
router.get('/:symbol', getStocks);

module.exports = router; 