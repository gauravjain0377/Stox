import React, { useState, useEffect } from 'react';
import { useGeneralContext } from "./GeneralContext";
import { useLocation } from 'react-router-dom';
import { watchlist as allStocks } from "../data/data";
import { stockService } from "../services/stockService";
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

const PersonalWatchlist = () => {
  const { user } = useGeneralContext();
  const location = useLocation();
  const [watchlists, setWatchlists] = useState([]);
  const [activeWatchlist, setActiveWatchlist] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Load user watchlists
  useEffect(() => {
    const loadWatchlists = async () => {
      try {
        setLoading(true);
        const userId = user?.id || user?.username || 'default';
        const userWatchlists = await stockService.getAllWatchlists(userId);
        setWatchlists(userWatchlists);
        if (userWatchlists.length > 0) {
          setActiveWatchlist(userWatchlists[0].id);
        }
      } catch (error) {
        console.error('Error loading watchlists:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlists();
  }, [user]);

  // Check URL parameters for auto-create watchlist
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const action = searchParams.get('action');
    
    if (action === 'create') {
      setShowAddWatchlist(true);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, '/watchlist');
    }
  }, [location.search]);

  // Add new watchlist
  const handleAddWatchlist = async () => {
    if (newWatchlistName.trim()) {
      try {
        const userId = user?.id || user?.username || 'default';
        const newWatchlist = await stockService.createWatchlist(userId, newWatchlistName.trim());
        if (newWatchlist) {
          setWatchlists([...watchlists, newWatchlist]);
          setActiveWatchlist(newWatchlist.id);
        }
        setNewWatchlistName('');
        setShowAddWatchlist(false);
      } catch (error) {
        console.error('Error creating watchlist:', error);
      }
    }
  };

  // Delete watchlist
  const handleDeleteWatchlist = (watchlistId) => {
    setItemToDelete({ type: 'watchlist', id: watchlistId, name: watchlists.find(w => w.id === watchlistId)?.name });
    setShowDeleteWatchlistModal(true);
  };
  const confirmDeleteWatchlist = async () => {
    try {
      const userId = user?.id || user?.username || 'default';
      const success = await stockService.deleteWatchlist(userId, itemToDelete.id);
      if (success) {
        const updatedWatchlists = watchlists.filter(w => w.id !== itemToDelete.id);
        setWatchlists(updatedWatchlists);
        if (activeWatchlist === itemToDelete.id) {
          setActiveWatchlist(updatedWatchlists[0]?.id || null);
        }
      }
      setShowDeleteWatchlistModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting watchlist:', error);
    }
  };

  // Delete stock
  const handleDeleteStock = (stockSymbol) => {
    setItemToDelete({ type: 'stock', symbol: stockSymbol });
    setShowDeleteStockModal(true);
  };
  const confirmDeleteStock = async () => {
    try {
      const userId = user?.id || user?.username || 'default';
      const success = await stockService.removeStockFromWatchlist(userId, activeWatchlist, itemToDelete.symbol);
      if (success) {
        const activeWatchlistData = watchlists.find(w => w.id === activeWatchlist);
        if (activeWatchlistData) {
          const updatedStocks = activeWatchlistData.stocks.filter(s => s.symbol !== itemToDelete.symbol);
          const updatedWatchlists = watchlists.map(w =>
            w.id === activeWatchlist ? { ...w, stocks: updatedStocks } : w
          );
          setWatchlists(updatedWatchlists);
        }
      }
      setShowDeleteStockModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error removing stock:', error);
    }
  };

  // Add stock to watchlist from dropdown
  const handleAddStock = async (stock) => {
    if (!stock || !activeWatchlist) return;
    try {
      const userId = user?.id || user?.username || 'default';
      
      // Convert stock data to the expected format
      const formattedStock = {
        symbol: stock.name, // Use name as symbol
        name: stock.name,
        price: stock.price,
        percent: stock.percent,
        volume: stock.volume
      };
      
      const success = await stockService.addStockToWatchlist(userId, activeWatchlist, formattedStock);
      if (success) {
        // Stock was successfully added, reload the watchlists to get the updated data
        const updatedWatchlists = await stockService.getAllWatchlists(userId);
        setWatchlists(updatedWatchlists);
        setMessage(`${formattedStock.symbol} added to watchlist!`);
        setMessageType('success');
      } else {
        setMessage(`${formattedStock.symbol} is already in this watchlist`);
        setMessageType('warning');
      }
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
      
      setAddStockInput('');
      setShowStockDropdown(false);
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  // Rename watchlist
  const handleRenameWatchlist = (watchlistId) => {
    setEditingWatchlist(watchlistId);
    setNewWatchlistName(watchlists.find(w => w.id === watchlistId)?.name || '');
  };
  const confirmRenameWatchlist = async () => {
    if (newWatchlistName.trim()) {
      try {
        const userId = user?.id || user?.username || 'default';
        const success = await stockService.updateWatchlist(userId, editingWatchlist, { name: newWatchlistName.trim() });
        if (success) {
          const updatedWatchlists = watchlists.map(w =>
            w.id === editingWatchlist ? { ...w, name: newWatchlistName.trim() } : w
          );
          setWatchlists(updatedWatchlists);
        }
        setEditingWatchlist(null);
        setNewWatchlistName('');
      } catch (error) {
        console.error('Error renaming watchlist:', error);
      }
    }
  };

  // Filtered stocks for search in add dropdown
  const filteredStockOptions = allStocks.filter(stock => {
    const activeWatchlistData = watchlists.find(w => w.id === activeWatchlist);
    const alreadyAdded = activeWatchlistData?.stocks.some(s => s.symbol === stock.name);
    return (
      stock.name && 
      stock.name.toLowerCase().includes(addStockInput.toLowerCase()) &&
      !alreadyAdded
    );
  });

  // Filtered stocks for table search
  const filteredStocks = watchlists
    .find(w => w.id === activeWatchlist)
    ?.stocks.filter(stock =>
      (stock.symbol && stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (stock.name && stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

  if (loading) {
    return (
      <div className="modern-watchlist">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading watchlists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-watchlist">
      {/* Message Display */}
      {message && (
        <div className={`message ${messageType === 'success' ? 'success' : 'warning'}`}>
          {message}
        </div>
      )}
      
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
                      onClick={() => handleDeleteStock(stock.symbol)}
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
                    {searchTerm ? 'No stocks found matching your search.' : 'No stocks in this watchlist yet. Add stocks using the search bar above!'}
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
              <p>Are you sure you want to remove "<strong>{itemToDelete?.symbol}</strong>" from this watchlist?</p>
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