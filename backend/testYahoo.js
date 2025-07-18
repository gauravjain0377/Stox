const yahooFinance = require('yahoo-finance2').default;

const symbols = [
  'TCS.NS',
  'RELIANCE.NS',
  'INFY.NS',
  'HDFCBANK.NS',
  'ICICIBANK.NS',
  'BHARTIARTL.NS',
  'HCLTECH.NS',
  'WIPRO.NS',
  'AXISBANK.NS',
  'KOTAKBANK.NS'
];

async function test() {
  const results = await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const data = await yahooFinance.quote(symbol);
        console.log('Yahoo data for', symbol, ':', data);
        return { symbol, price: data.regularMarketPrice };
      } catch (err) {
        console.error('Yahoo error for', symbol, ':', err.message);
        return { symbol, error: err.message };
      }
    })
  );
  console.log('Results:', results);
}

test(); 