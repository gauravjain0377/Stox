import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGeneralContext } from "./GeneralContext";

const currency = (n) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : "-";

const Positions = () => {
  const { user } = useGeneralContext();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("All");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState("square"); // 'square' | 'partial'
  const [selectedName, setSelectedName] = useState("");
  const [maxQty, setMaxQty] = useState(0);
  const [partialQty, setPartialQty] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3000);
  };

  const fetchPositions = () => {
    if (!user) return;
    const userId = user.userId || user.id || user._id;
    if (!userId) return;
    setLoading(true);
    setFetchError("");
    axios
      .get(`http://localhost:3000/positions?userId=${userId}`)
      .then((res) => {
        setPositions(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        setPositions([]);
        setFetchError(err?.response?.data?.error || "Failed to load positions");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user) fetchPositions();
  }, [user]);

  // Optional polling for live LTP updates
  useEffect(() => {
    if (!user) return;
    const id = setInterval(fetchPositions, 15000);
    return () => clearInterval(id);
  }, [user]);

  const filtered = positions.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.qty).includes(search);
    const matchesProduct = productFilter === "All" || p.product === productFilter;
    return matchesSearch && matchesProduct;
  });

  const totals = filtered.reduce(
    (acc, p) => {
      const value = (p.ltp || p.price || 0) * (p.qty || 0);
      const pnl = ((p.ltp || p.price || 0) - (p.avg || 0)) * (p.qty || 0);
      acc.totalValue += value;
      acc.totalPnl += pnl;
      acc.totalQty += p.qty || 0;
      return acc;
    },
    { totalValue: 0, totalPnl: 0, totalQty: 0 }
  );

  const handleSquareOff = async (name) => {
    setConfirmType("square");
    setSelectedName(name);
    const pos = positions.find((p) => p.name === name);
    setMaxQty(pos?.qty || 0);
    setPartialQty(pos?.qty || 0);
    setConfirmOpen(true);
  };

  const handlePartialClose = async (name) => {
    setConfirmType("partial");
    setSelectedName(name);
    const pos = positions.find((p) => p.name === name);
    setMaxQty(pos?.qty || 0);
    setPartialQty(Math.min(1, pos?.qty || 1));
    setConfirmOpen(true);
  };

  const executeAction = async () => {
    try {
      setActionLoading(true);
      const userId = user.userId || user.id || user._id;
      if (confirmType === "square") {
        await axios.post("http://localhost:3000/positions/close", { userId, name: selectedName });
        addToast(`Squared off ${selectedName}`);
      } else {
        const qty = Math.max(1, Math.min(maxQty, parseInt(partialQty || 0, 10)));
        await axios.post("http://localhost:3000/positions/partial-close", { userId, name: selectedName, qty });
        addToast(`Closed ${qty} of ${selectedName}`);
      }
      setConfirmOpen(false);
      setActionLoading(false);
      fetchPositions();
    } catch (err) {
      setActionLoading(false);
      addToast(err?.response?.data?.message || "Action failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Toasts */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded shadow text-white ${t.type === "error" ? "bg-red-600" : "bg-green-600"}`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {fetchError}
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Positions ({filtered.length})</h3>
        <div className="ml-auto flex gap-3">
          <input
            type="text"
            placeholder="Search by symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {['All', 'CNC', 'MIS'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrument</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LTP</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No open positions. Place a buy order to create one.
                </td>
              </tr>
            ) : (
              filtered.map((p, index) => {
                const ltp = p.ltp || p.price || 0;
                const value = ltp * (p.qty || 0);
                const pnl = (ltp - (p.avg || 0)) * (p.qty || 0);
                const pnlClass = pnl >= 0 ? "text-green-600" : "text-red-600";
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{p.product || "CNC"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{p.qty}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{currency(p.avg)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{currency(ltp)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{currency(value)}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${pnlClass}`}>₹{currency(pnl)}</td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleSquareOff(p.name)}
                        className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
                      >
                        Square-off
                      </button>
                      <button
                        onClick={() => handlePartialClose(p.name)}
                        className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700"
                      >
                        Partial Close
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-xs text-gray-500" colSpan={2}>Totals</td>
                <td className="px-4 py-3 text-sm text-gray-900">{totals.totalQty}</td>
                <td className="px-4 py-3 text-sm text-gray-900">-</td>
                <td className="px-4 py-3 text-sm text-gray-900">-</td>
                <td className="px-4 py-3 text-sm text-gray-900">₹{currency(totals.totalValue)}</td>
                <td className={`px-4 py-3 text-sm font-medium ${totals.totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}>₹{currency(totals.totalPnl)}</td>
                <td className="px-4 py-3 text-sm"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
            <div className="text-lg font-semibold text-gray-900 mb-1">
              {confirmType === "square" ? "Square-off position" : "Partial close"}
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {confirmType === "square"
                ? `Are you sure you want to square-off ${selectedName}?`
                : `Enter quantity to close for ${selectedName}. Max ${maxQty}.`}
            </div>
            {confirmType === "partial" && (
              <div className="mb-4">
                <input
                  type="number"
                  min={1}
                  max={maxQty}
                  value={partialQty}
                  onChange={(e) => setPartialQty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-1 text-xs text-gray-500">Max: {maxQty}</div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className={`px-3 py-2 rounded text-white ${confirmType === "square" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : confirmType === "square" ? "Confirm Square-off" : "Confirm Partial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;