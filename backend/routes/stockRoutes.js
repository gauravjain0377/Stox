const express = require('express');
const router = express.Router();
const { getStocks, getStocksData } = require('../controllers/stockController');

router.get('/data', getStocksData);
router.get('/', getStocks);
router.get('/:symbol', getStocks);

module.exports = router; 