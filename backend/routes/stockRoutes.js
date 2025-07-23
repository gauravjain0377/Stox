const express = require('express');
const router = express.Router();
const { getStocks, getStocksData, getStockInfo, getStockPrice, getStockHistory } = require('../controllers/stockController');

router.get('/data', getStocksData);
router.get('/', getStocks);
router.get('/:symbol/info', getStockInfo);
router.get('/:symbol/price', getStockPrice);
router.get('/:symbol/history', getStockHistory);
router.get('/:symbol', getStocks);

module.exports = router; 