// Stock service for fetching and managing stock data
const API_BASE_URL = 'http://localhost:3000/api';

// Fallback stock data from the seed file - All 50 stocks
const fallbackStocks = [
  { symbol: "RELIANCE", fullName: "Reliance Industries Ltd", price: 2745.30, percent: 0.42, volume: "3.2M", marketCap: "18.3T" },
  { symbol: "HDFCBANK", fullName: "HDFC Bank Ltd", price: 1578.40, percent: 0.75, volume: "2.9M", marketCap: "11.9T" },
  { symbol: "ICICIBANK", fullName: "ICICI Bank Ltd", price: 1076.20, percent: -0.60, volume: "4.3M", marketCap: "7.5T" },
  { symbol: "TCS", fullName: "Tata Consultancy Services Ltd", price: 3194.80, percent: -0.25, volume: "1.8M", marketCap: "11.7T" },
  { symbol: "BHARTIARTL", fullName: "Bharti Airtel Ltd", price: 1082.65, percent: 0.90, volume: "1.4M", marketCap: "6.1T" },
  { symbol: "INFY", fullName: "Infosys Ltd", price: 1567.90, percent: -1.15, volume: "2.1M", marketCap: "6.7T" },
  { symbol: "ITC", fullName: "ITC Ltd", price: 445.20, percent: 1.25, volume: "2.3M", marketCap: "5.6T" },
  { symbol: "KOTAKBANK", fullName: "Kotak Mahindra Bank Ltd", price: 1640.35, percent: 0.21, volume: "1.2M", marketCap: "4.8T" },
  { symbol: "LT", fullName: "Larsen & Toubro Ltd", price: 3410.00, percent: -2.34, volume: "850K", marketCap: "3.8T" },
  { symbol: "SBIN", fullName: "State Bank of India", price: 678.45, percent: -0.85, volume: "5.1M", marketCap: "6.1T" },
  { symbol: "AXISBANK", fullName: "Axis Bank Ltd", price: 1078.90, percent: -0.12, volume: "3.6M", marketCap: "4.2T" },
  { symbol: "HINDUNILVR", fullName: "Hindustan Unilever Ltd", price: 2565.00, percent: 1.45, volume: "1.1M", marketCap: "5.9T" },
  { symbol: "BAJFINANCE", fullName: "Bajaj Finance Ltd", price: 6789.45, percent: -0.95, volume: "420K", marketCap: "4.1T" },
  { symbol: "HCLTECH", fullName: "HCL Technologies Ltd", price: 1372.15, percent: -0.33, volume: "950K", marketCap: "3.9T" },
  { symbol: "MARUTI", fullName: "Maruti Suzuki India Ltd", price: 10895.60, percent: -1.20, volume: "450K", marketCap: "3.3T" },
  { symbol: "ASIANPAINT", fullName: "Asian Paints Ltd", price: 3245.80, percent: 0.65, volume: "850K", marketCap: "3.1T" },
  { symbol: "SUNPHARMA", fullName: "Sun Pharmaceutical Industries Ltd", price: 1245.30, percent: 0.45, volume: "1.2M", marketCap: "2.9T" },
  { symbol: "TITAN", fullName: "Titan Company Ltd", price: 3245.80, percent: 1.10, volume: "680K", marketCap: "2.9T" },
  { symbol: "ULTRACEMCO", fullName: "UltraTech Cement Ltd", price: 8456.70, percent: -0.75, volume: "320K", marketCap: "2.4T" },
  { symbol: "NTPC", fullName: "NTPC Ltd", price: 340.00, percent: 2.34, volume: "2.1M", marketCap: "2.2T" },
  { symbol: "TATAMOTORS", fullName: "Tata Motors Ltd", price: 678.90, percent: 2.15, volume: "3.8M", marketCap: "2.2T" },
  { symbol: "POWERGRID", fullName: "Power Grid Corporation of India Ltd", price: 320.00, percent: 1.23, volume: "1.8M", marketCap: "2.0T" },
  { symbol: "TATASTEEL", fullName: "Tata Steel Ltd", price: 150.00, percent: -2.34, volume: "4.2M", marketCap: "1.6T" },
  { symbol: "JSWSTEEL", fullName: "JSW Steel Ltd", price: 870.00, percent: 1.23, volume: "1.5M", marketCap: "1.5T" },
  { symbol: "NESTLEIND", fullName: "Nestle India Ltd", price: 2345.60, percent: 0.35, volume: "180K", marketCap: "2.3T" },
  { symbol: "HDFCLIFE", fullName: "HDFC Life Insurance Company Ltd", price: 680.00, percent: 2.34, volume: "950K", marketCap: "1.2T" },
  { symbol: "TECHM", fullName: "Tech Mahindra Ltd", price: 1250.00, percent: -2.34, volume: "1.2M", marketCap: "1.1T" },
  { symbol: "WIPRO", fullName: "Wipro Ltd", price: 527.80, percent: 0.28, volume: "1.1M", marketCap: "2.8T" },
  { symbol: "BAJAJFINSV", fullName: "Bajaj Finserv Ltd", price: 1750.00, percent: 3.45, volume: "680K", marketCap: "2.1T" },
  { symbol: "GRASIM", fullName: "Grasim Industries Ltd", price: 1900.00, percent: 1.23, volume: "450K", marketCap: "1.2T" },
  { symbol: "ADANIGREEN", fullName: "Adani Green Energy Ltd", price: 2100.00, percent: -5.67, volume: "320K", marketCap: "3.5T" },
  { symbol: "ADANIPORTS", fullName: "Adani Ports and SEZ Ltd", price: 980.00, percent: 3.45, volume: "850K", marketCap: "2.6T" },
  { symbol: "COALINDIA", fullName: "Coal India Ltd", price: 450.00, percent: 2.34, volume: "2.8M", marketCap: "1.5T" },
  { symbol: "BPCL", fullName: "Bharat Petroleum Corporation Ltd", price: 480.00, percent: 1.23, volume: "1.9M", marketCap: "1.1T" },
  { symbol: "UPL", fullName: "UPL Ltd", price: 650.00, percent: -2.34, volume: "1.2M", marketCap: "990B" },
  { symbol: "HINDALCO", fullName: "Hindalco Industries Ltd", price: 520.00, percent: 1.23, volume: "2.1M", marketCap: "1.6T" },
  { symbol: "EICHERMOT", fullName: "Eicher Motors Ltd", price: 4200.00, percent: 3.45, volume: "280K", marketCap: "1.1T" },
  { symbol: "DIVISLAB", fullName: "Divi's Laboratories Ltd", price: 3900.00, percent: 2.34, volume: "180K", marketCap: "990B" },
  { symbol: "CIPLA", fullName: "Cipla Ltd", price: 1250.00, percent: 2.34, volume: "1.1M", marketCap: "1.1T" },
  { symbol: "BRITANNIA", fullName: "Britannia Industries Ltd", price: 4200.00, percent: 3.45, volume: "320K", marketCap: "1.1T" },
  { symbol: "M&M", fullName: "Mahindra & Mahindra Ltd", price: 1800.00, percent: 3.45, volume: "850K", marketCap: "1.6T" },
  { symbol: "BAJAJ_AUTO", fullName: "Bajaj Auto Ltd", price: 7900.00, percent: 3.45, volume: "450K", marketCap: "1.5T" },
  { symbol: "HERO", fullName: "Hero MotoCorp Ltd", price: 3400.00, percent: 2.34, volume: "680K", marketCap: "1.1T" },
  { symbol: "DRREDDY", fullName: "Dr. Reddy's Laboratories Ltd", price: 5800.00, percent: 2.34, volume: "420K", marketCap: "990B" },
  { symbol: "DABUR", fullName: "Dabur India Ltd", price: 620.00, percent: 3.45, volume: "850K", marketCap: "1.1T" },
  { symbol: "APOLLOHOSP", fullName: "Apollo Hospitals Enterprise Ltd", price: 5800.00, percent: 2.34, volume: "180K", marketCap: "990B" },
  { symbol: "TATACONSUM", fullName: "Tata Consumer Products Ltd", price: 980.00, percent: 3.45, volume: "680K", marketCap: "1.1T" },
  { symbol: "ONGC", fullName: "Oil & Natural Gas Corporation Ltd", price: 270.00, percent: 2.34, volume: "3.2M", marketCap: "2.3T" },
  { symbol: "INDUSINDBK", fullName: "IndusInd Bank Ltd", price: 1450.00, percent: 2.34, volume: "950K", marketCap: "990B" },
  { symbol: "HDFC", fullName: "Housing Development Finance Corporation Ltd", price: 2850.00, percent: 1.85, volume: "1.2M", marketCap: "5.2T" }
];

// Helper function to get user-specific storage key
const getWatchlistKey = (userId) => `watchlists_${userId || 'default'}`;

export const stockService = {
  async getAllStocks() {
    try {
      const response = await fetch('http://localhost:3000/api/stocks');
      if (response.ok) {
        const data = await response.json();
        const stocks = data.stocks || [];
        
        // If backend returns empty or insufficient data, use fallback
        if (stocks.length === 0 || stocks.length < 50) {
          return fallbackStocks;
        }
        
        return stocks;
      }
      return fallbackStocks;
    } catch (error) {
      console.error('StockService: Error fetching stocks:', error);
      return fallbackStocks;
    }
  },

  async getStockData(symbol) {
    try {
      const response = await fetch(`http://localhost:3000/api/stocks/${symbol}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('StockService: Error fetching stock data:', error);
      return null;
    }
  },

  async getCompanyInfo() {
    try {
      const response = await fetch('http://localhost:3000/api/stocks/company-info');
      if (response.ok) {
        const data = await response.json();
        return data.companies || [];
      }
      return [];
    } catch (error) {
      console.error('StockService: Error fetching company info:', error);
      return [];
    }
  },

  async getMostTradedStocks() {
    try {
      const allStocks = await this.getAllStocks();
      return allStocks.slice(0, 8);
    } catch (error) {
      console.error('StockService: Error fetching most traded stocks:', error);
      return fallbackStocks.slice(0, 8);
    }
  },

  async getAllStocksWithData() {
    try {
      const allStocks = await this.getAllStocks();
      
      if (allStocks.length === 0) {
        return fallbackStocks;
      }
      
      return allStocks;
    } catch (error) {
      console.error('StockService: Error fetching all stocks with data:', error);
      return fallbackStocks;
    }
  },

  // Watchlist management functions
  getUserWatchlists(userId) {
    try {
      const key = getWatchlistKey(userId);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('StockService: Error getting user watchlists:', error);
      return [];
    }
  },

  saveUserWatchlists(userId, watchlists) {
    try {
      const key = getWatchlistKey(userId);
      localStorage.setItem(key, JSON.stringify(watchlists));
    } catch (error) {
      console.error('StockService: Error saving user watchlists:', error);
    }
  },

  async getWatchlist(userId) {
    try {
      const watchlists = this.getUserWatchlists(userId);
      // Return the first watchlist's stocks or empty array
      return watchlists.length > 0 ? watchlists[0].stocks : [];
    } catch (error) {
      console.error('StockService: Error fetching watchlist:', error);
      return [];
    }
  },

  async getAllWatchlists(userId) {
    try {
      return this.getUserWatchlists(userId);
    } catch (error) {
      console.error('StockService: Error fetching all watchlists:', error);
      return [];
    }
  },

  async createWatchlist(userId, watchlistName) {
    try {
      const watchlists = this.getUserWatchlists(userId);
      const newWatchlist = {
        id: Date.now(),
        name: watchlistName,
        stocks: []
      };
      const updatedWatchlists = [...watchlists, newWatchlist];
      this.saveUserWatchlists(userId, updatedWatchlists);
      return newWatchlist;
    } catch (error) {
      console.error('StockService: Error creating watchlist:', error);
      return null;
    }
  },

  async updateWatchlist(userId, watchlistId, updatedWatchlist) {
    try {
      const watchlists = this.getUserWatchlists(userId);
      const updatedWatchlists = watchlists.map(w => 
        w.id === watchlistId ? { ...w, ...updatedWatchlist } : w
      );
      this.saveUserWatchlists(userId, updatedWatchlists);
      return true;
    } catch (error) {
      console.error('StockService: Error updating watchlist:', error);
      return false;
    }
  },

  async deleteWatchlist(userId, watchlistId) {
    try {
      const watchlists = this.getUserWatchlists(userId);
      const updatedWatchlists = watchlists.filter(w => w.id !== watchlistId);
      this.saveUserWatchlists(userId, updatedWatchlists);
      return true;
    } catch (error) {
      console.error('StockService: Error deleting watchlist:', error);
      return false;
    }
  },

  async addStockToWatchlist(userId, watchlistId, stock) {
    try {
      const watchlists = this.getUserWatchlists(userId);
      let stockAdded = false;
      
      const updatedWatchlists = watchlists.map(w => {
        if (w.id === watchlistId) {
          const stockExists = w.stocks.some(s => s.symbol === stock.symbol);
          if (!stockExists) {
            stockAdded = true;
            return { ...w, stocks: [...w.stocks, stock] };
          }
        }
        return w;
      });
      
      this.saveUserWatchlists(userId, updatedWatchlists);
      return stockAdded; // Return true only if stock was actually added
    } catch (error) {
      console.error('StockService: Error adding stock to watchlist:', error);
      return false;
    }
  },

  async removeStockFromWatchlist(userId, watchlistId, stockSymbol) {
    try {
      const watchlists = this.getUserWatchlists(userId);
      const updatedWatchlists = watchlists.map(w => {
        if (w.id === watchlistId) {
          return { ...w, stocks: w.stocks.filter(s => s.symbol !== stockSymbol) };
        }
        return w;
      });
      this.saveUserWatchlists(userId, updatedWatchlists);
      return true;
    } catch (error) {
      console.error('StockService: Error removing stock from watchlist:', error);
      return false;
    }
  },

  async getWatchlistSummary(userId) {
    try {
      const watchlists = this.getUserWatchlists(userId);
      const totalItems = watchlists.reduce((sum, w) => sum + w.stocks.length, 0);
      const allStocks = watchlists.flatMap(w => w.stocks);
      
      return {
        count: watchlists.length,
        items: allStocks.slice(0, 3), // Show first 3 items from all watchlists
        totalItems: totalItems,
        watchlists: watchlists
      };
    } catch (error) {
      console.error('StockService: Error fetching watchlist summary:', error);
      return {
        count: 0,
        items: [],
        totalItems: 0,
        watchlists: []
      };
    }
  }
}; 