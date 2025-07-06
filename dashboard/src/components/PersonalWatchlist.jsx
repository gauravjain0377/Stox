import React, { useState } from 'react';
import { useTheme } from "../context/ThemeContext";
import { watchlist as allStocks } from "../data/data";
import "../styles/PersonalWatchlist.css";
import { FaSearch, FaPlus } from 'react-icons/fa';

const MiniChart = ({ data, isPositive }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 30 - ((value - min) / range) * 30;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="60" height="30" className="mini-chart">
      <polyline
        fill="none"
        stroke={isPositive ? "#10b981" : "#ef4444"}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

const defaultWatchlist = [{ id: Date.now(), name: 'My Watchlist', stocks: [] }];

const PersonalWatchlist = () => {
  const { theme } = useTheme();
  const [watchlists, setWatchlists] = useState(defaultWatchlist);
  const [activeWatchlist, setActiveWatchlist] = useState(defaultWatchlist[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [addStockInput, setAddStockInput] = useState('');
  const [editingWatchlist, setEditingWatchlist] = useState(null);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [showAddWatchlist, setShowAddWatchlist] = useState(false);
  const [showDeleteWatchlistModal, setShowDeleteWatchlistModal] = useState(false);
  const [showDeleteStockModal, setShowDeleteStockModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  
  // Sample stock data
  const sampleStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.15, changePercent: 1.45, volume: '45.2M' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.80, change: -15.20, changePercent: -0.55, volume: '12.8M' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 310.45, change: 8.75, changePercent: 2.89, volume: '28.9M' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.30, change: 12.80, changePercent: 5.50, volume: '35.6M' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 135.90, change: -3.45, changePercent: -2.48, volume: '22.1M' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 320.75, change: 18.25, changePercent: 6.02, volume: '18.7M' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 485.20, change: 25.60, changePercent: 5.57, volume: '15.3M' },
    { symbol: 'NFLX', name: 'Netflix Inc.', price: 425.80, change: -8.90, changePercent: -2.05, volume: '8.9M' }
  ];

  // Add new watchlist
  const handleAddWatchlist = () => {
    if (newWatchlistName.trim()) {
      const newWatchlist = {
        id: Date.now(),
        name: newWatchlistName.trim(),
        stocks: []
      };
      setWatchlists([...watchlists, newWatchlist]);
      setNewWatchlistName('');
      setShowAddWatchlist(false);
      setActiveWatchlist(newWatchlist.id);
    }
  };

  // Delete watchlist
  const handleDeleteWatchlist = (watchlistId) => {
    setItemToDelete({ type: 'watchlist', id: watchlistId, name: watchlists.find(w => w.id === watchlistId)?.name });
    setShowDeleteWatchlistModal(true);
  };
  const confirmDeleteWatchlist = () => {
    const updatedWatchlists = watchlists.filter(w => w.id !== itemToDelete.id);
    setWatchlists(updatedWatchlists);
    if (activeWatchlist === itemToDelete.id) {
      setActiveWatchlist(updatedWatchlists[0]?.id || null);
    }
    setShowDeleteWatchlistModal(false);
    setItemToDelete(null);
  };

  // Delete stock
  const handleDeleteStock = (stockName) => {
    setItemToDelete({ type: 'stock', name: stockName });
    setShowDeleteStockModal(true);
  };
  const confirmDeleteStock = () => {
    const activeWatchlistData = watchlists.find(w => w.id === activeWatchlist);
    if (activeWatchlistData) {
      const updatedStocks = activeWatchlistData.stocks.filter(s => s.name !== itemToDelete.name);
      const updatedWatchlists = watchlists.map(w =>
        w.id === activeWatchlist ? { ...w, stocks: updatedStocks } : w
      );
      setWatchlists(updatedWatchlists);
    }
    setShowDeleteStockModal(false);
    setItemToDelete(null);
  };

  // Add stock to watchlist from dropdown
  const handleAddStock = (stock) => {
    if (!stock || !activeWatchlist) return;
    const activeWatchlistData = watchlists.find(w => w.id === activeWatchlist);
    if (activeWatchlistData && !activeWatchlistData.stocks.find(s => s.name === stock.name)) {
      const updatedWatchlists = watchlists.map(w =>
        w.id === activeWatchlist
          ? { ...w, stocks: [...w.stocks, stock] }
          : w
      );
      setWatchlists(updatedWatchlists);
    }
    setAddStockInput('');
    setShowStockDropdown(false);
  };

  // Rename watchlist
  const handleRenameWatchlist = (watchlistId) => {
    setEditingWatchlist(watchlistId);
    setNewWatchlistName(watchlists.find(w => w.id === watchlistId)?.name || '');
  };
  const confirmRenameWatchlist = () => {
    if (newWatchlistName.trim()) {
      const updatedWatchlists = watchlists.map(w =>
        w.id === editingWatchlist ? { ...w, name: newWatchlistName.trim() } : w
      );
      setWatchlists(updatedWatchlists);
      setEditingWatchlist(null);
      setNewWatchlistName('');
    }
  };

  // Filtered stocks for search in add dropdown
  const filteredStockOptions = allStocks.filter(stock => {
    const activeWatchlistData = watchlists.find(w => w.id === activeWatchlist);
    const alreadyAdded = activeWatchlistData?.stocks.some(s => s.name === stock.name);
    return (
      (stock.name.toLowerCase().includes(addStockInput.toLowerCase())) &&
      !alreadyAdded
    );
  });

  // Filtered stocks for table search
  const filteredStocks = watchlists
    .find(w => w.id === activeWatchlist)
    ?.stocks.filter(stock =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="modern-watchlist">
      {/* Watchlist Tabs */}
      <div className="watchlist-tabs">
        {watchlists.map(watchlist => (
          <div key={watchlist.id} className="watchlist-tab-container">
            {editingWatchlist === watchlist.id ? (
              <div className="add-watchlist-tab">
                <input
                  type="text"
                  className="add-watchlist-input"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && confirmRenameWatchlist()}
                  onBlur={confirmRenameWatchlist}
                  autoFocus
                />
                <button className="add-watchlist-btn" onClick={confirmRenameWatchlist}>✓</button>
              </div>
            ) : (
              <button
                className={`watchlist-tab ${activeWatchlist === watchlist.id ? 'active' : ''}`}
                onClick={() => setActiveWatchlist(watchlist.id)}
              >
                {watchlist.name}
                <button
                  className="delete-watchlist-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWatchlist(watchlist.id);
                  }}
                  title="Delete watchlist"
                >
                  ×
                </button>
              </button>
            )}
          </div>
        ))}
        {showAddWatchlist ? (
          <div className="add-watchlist-tab">
            <input
              type="text"
              className="add-watchlist-input"
              placeholder="Watchlist name"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddWatchlist()}
              onBlur={() => {
                if (!newWatchlistName.trim()) {
                  setShowAddWatchlist(false);
                  setNewWatchlistName('');
                }
              }}
              autoFocus
            />
            <button className="add-watchlist-btn" onClick={handleAddWatchlist}>+</button>
          </div>
        ) : (
          <button
            className="watchlist-tab"
            onClick={() => setShowAddWatchlist(true)}
            style={{ background: '#f1f5f9', color: '#64748b' }}
          >
            + New Watchlist
          </button>
        )}
      </div>

      {/* Search and Add Bar */}
      <div className="watchlist-search-bar-modern">
        <div className="input-group">
          <span className="input-icon"><FaSearch /></span>
          <input
            type="text"
            className="watchlist-search-input-modern"
            placeholder="Search stocks in watchlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="input-group" style={{ position: 'relative', flex: 1 }}>
          <span className="input-icon"><FaPlus /></span>
          <input
            type="text"
            className="watchlist-add-input-modern"
            placeholder="Add stock (type to search)"
            value={addStockInput}
            onChange={(e) => {
              setAddStockInput(e.target.value);
              setShowStockDropdown(true);
              setDropdownIndex(-1);
            }}
            onFocus={() => setShowStockDropdown(true)}
            onKeyDown={e => {
              if (!showStockDropdown) return;
              if (e.key === 'ArrowDown') {
                setDropdownIndex(i => Math.min(i + 1, filteredStockOptions.length - 1));
              } else if (e.key === 'ArrowUp') {
                setDropdownIndex(i => Math.max(i - 1, 0));
              } else if (e.key === 'Enter' && dropdownIndex >= 0) {
                handleAddStock(filteredStockOptions[dropdownIndex]);
              }
            }}
            autoComplete="off"
          />
          {showStockDropdown && filteredStockOptions.length > 0 && (
            <div className="stock-dropdown-list-modern">
              {filteredStockOptions.map((stock, idx) => (
                <div
                  key={stock.name}
                  className={`stock-dropdown-item-modern${dropdownIndex === idx ? ' selected' : ''}`}
                  onClick={() => handleAddStock(stock)}
                  onMouseEnter={() => setDropdownIndex(idx)}
                >
                  <span className="stock-symbol-modern">{stock.name}</span>
                  <span className="stock-price-modern">₹{stock.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="watchlist-table-outer">
        <table className="watchlist-table-modern">
          <thead>
            <tr>
              <th>Company</th>
              <th>Price</th>
              <th>Change</th>
              <th>Volume</th>
              <th>Chart</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map(stock => (
                <tr key={stock.name}>
                  <td>
                    <div className="company-cell">
                      <span className="company-name">{stock.name}</span>
                    </div>
                  </td>
                  <td className="market-price">
                    {typeof stock.price === 'number' ? `₹${stock.price.toFixed(2)}` : '—'}
                  </td>
                  <td className={`day-change ${stock.percent >= 0 ? 'up' : 'down'}`}>
                    {typeof stock.percent === 'number' ? `${stock.percent >= 0 ? '+' : ''}${stock.percent.toFixed(2)}%` : '—'}
                  </td>
                  <td>{stock.volume || '—'}</td>
                  <td>
                    <svg className="mini-chart" width="60" height="30" viewBox="0 0 60 30">
                      <path
                        d="M0,15 L10,12 L20,18 L30,8 L40,22 L50,5 L60,10"
                        stroke={stock.percent >= 0 ? '#22a06b' : '#ef4444'}
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </td>
                  <td>
                    <button
                      className="delete-stock-btn"
                      onClick={() => handleDeleteStock(stock.name)}
                      title="Remove from watchlist"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  {searchTerm ? 'No stocks found matching your search.' : 'No stocks in this watchlist yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Watchlist Confirmation Modal */}
      {showDeleteWatchlistModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteWatchlistModal(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Watchlist</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowDeleteWatchlistModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete "<strong>{itemToDelete?.name}</strong>"?</p>
              <p>This action cannot be undone and will remove all stocks from this watchlist.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-cancel" 
                onClick={() => setShowDeleteWatchlistModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-delete" 
                onClick={confirmDeleteWatchlist}
              >
                Delete Watchlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Stock Confirmation Modal */}
      {showDeleteStockModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteStockModal(false)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Remove Stock</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowDeleteStockModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to remove "<strong>{itemToDelete?.name}</strong>" from this watchlist?</p>
              <p>You can always add it back later.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-cancel" 
                onClick={() => setShowDeleteStockModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-delete" 
                onClick={confirmDeleteStock}
              >
                Remove Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalWatchlist; 