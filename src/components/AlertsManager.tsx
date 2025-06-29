import { useState } from 'react';
import { useStocks } from '../contexts/StockContext';
import { Plus, Edit2, Trash2, Bell, BellOff, AlertCircle } from 'lucide-react';
import { Alert } from '../types';

export default function AlertsManager() {
  const { stocks, alerts, addAlert, updateAlert, deleteAlert } = useStocks();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'above' as 'above' | 'below',
    threshold: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.threshold) {
      return;
    }

    const threshold = parseFloat(formData.threshold);
    if (isNaN(threshold) || threshold <= 0) {
      return;
    }

    if (editingId) {
      updateAlert(editingId, {
        symbol: formData.symbol,
        type: formData.type,
        threshold,
      });
      setEditingId(null);
    } else {
      addAlert({
        symbol: formData.symbol,
        type: formData.type,
        threshold,
      });
      setIsAdding(false);
    }

    setFormData({ symbol: '', type: 'above', threshold: '' });
  };

  const handleEdit = (alert: Alert) => {
    setEditingId(alert.id);
    setFormData({
      symbol: alert.symbol,
      type: alert.type,
      threshold: alert.threshold.toString(),
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ symbol: '', type: 'above', threshold: '' });
  };

  const triggeredAlerts = alerts.filter((alert) => alert.triggered);
  const activeAlerts = alerts.filter((alert) => !alert.triggered);

  return (
    <div className="space-y-6">
      {/* Add/Edit alert form */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            Create New Alert
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-white mb-4">
              {editingId ? 'Edit Alert' : 'Create New Alert'}
            </h3>

            <div>
              <label className="block text-gray-300 mb-2">Stock Symbol</label>
              <select
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
                required
              >
                <option value="">Select a stock</option>
                {stocks.map((stock) => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Alert Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as 'above' | 'below' })
                }
                className="w-full px-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
              >
                <option value="above">Price goes above</option>
                <option value="below">Price goes below</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Threshold Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
                className="w-full px-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition shadow-lg shadow-blue-500/25"
              >
                {editingId ? 'Update Alert' : 'Create Alert'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-3 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Triggered alerts */}
      {triggeredAlerts.length > 0 && (
        <div className="bg-[#1a1f36] rounded-2xl border border-red-500/30 overflow-hidden">
          <div className="bg-red-500/10 border-b border-red-500/20 p-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-red-400">Triggered Alerts ({triggeredAlerts.length})</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {triggeredAlerts.map((alert) => {
              const stock = stocks.find((s) => s.symbol === alert.symbol);
              return (
                <div key={alert.id} className="p-6 bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BellOff className="w-5 h-5 text-red-400" />
                        <span className="text-white">{alert.symbol}</span>
                        <span className="text-gray-400">
                          {alert.type === 'above' ? 'above' : 'below'} ${alert.threshold.toFixed(2)}
                        </span>
                      </div>
                      {stock && (
                        <p className="text-gray-400 ml-8">
                          Current price: ${stock.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active alerts */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-white">Active Alerts ({activeAlerts.length})</h3>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="mb-2">No active alerts</p>
            <p>Create alerts to get notified when prices reach your targets</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {activeAlerts.map((alert) => {
              const stock = stocks.find((s) => s.symbol === alert.symbol);
              return (
                <div key={alert.id} className="p-6 hover:bg-gray-800/30 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-5 h-5 text-blue-400" />
                        <span className="text-white">{alert.symbol}</span>
                        <span className="text-gray-400">
                          {alert.type === 'above' ? 'above' : 'below'} ${alert.threshold.toFixed(2)}
                        </span>
                      </div>
                      {stock && (
                        <p className="text-gray-400 ml-8">
                          Current price: ${stock.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(alert)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}