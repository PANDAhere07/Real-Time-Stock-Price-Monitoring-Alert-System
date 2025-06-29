import { useState } from 'react';
import { useStocks } from '../contexts/StockContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

export default function Analytics() {
  const { stocks, watchlist } = useStocks();
  const [selectedStocks, setSelectedStocks] = useState<string[]>(['AAPL', 'GOOGL', 'MSFT']);

  // Performance comparison data
  const comparisonData = selectedStocks.map((symbol) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    return {
      name: symbol,
      performance: stock?.changePercent || 0,
      volume: stock ? stock.volume / 1000000 : 0,
    };
  });

  // Market distribution
  const marketDistribution = [
    { name: 'Gainers', value: stocks.filter((s) => s.changePercent > 0).length },
    { name: 'Losers', value: stocks.filter((s) => s.changePercent < 0).length },
    { name: 'Unchanged', value: stocks.filter((s) => s.changePercent === 0).length },
  ];

  const COLORS = ['#10b981', '#ef4444', '#6b7280'];

  // Top performers
  const topGainers = [...stocks]
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);

  const topLosers = [...stocks]
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  const handleStockToggle = (symbol: string) => {
    if (selectedStocks.includes(symbol)) {
      setSelectedStocks(selectedStocks.filter((s) => s !== symbol));
    } else if (selectedStocks.length < 5) {
      setSelectedStocks([...selectedStocks, symbol]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stock comparison selector */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
        <h3 className="text-white mb-4">Compare Stocks (Select up to 5)</h3>
        <div className="flex flex-wrap gap-2">
          {stocks.slice(0, 10).map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleStockToggle(stock.symbol)}
              className={`px-4 py-2 rounded-xl border transition ${
                selectedStocks.includes(stock.symbol)
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
              disabled={!selectedStocks.includes(stock.symbol) && selectedStocks.length >= 5}
            >
              {stock.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Performance comparison chart */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
        <h3 className="text-white mb-6">Performance Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3548" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f36',
                  border: '1px solid #2d3548',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="performance" fill="#3b82f6" name="Change %" radius={[8, 8, 0, 0]} />
              <Bar dataKey="volume" fill="#8b5cf6" name="Volume (M)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market distribution */}
        <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-white mb-6">Market Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1f36',
                    border: '1px solid #2d3548',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market summary */}
        <div className="space-y-4">
          <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
            <h3 className="text-white mb-4">Market Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-gray-400">Total Gainers</p>
                    <p className="text-white">{marketDistribution[0].value} stocks</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-8 h-8 text-red-400" />
                  <div>
                    <p className="text-gray-400">Total Losers</p>
                    <p className="text-white">{marketDistribution[1].value} stocks</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-gray-400">Active Alerts</p>
                    <p className="text-white">{watchlist.length} stocks tracked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top gainers and losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Top Gainers
          </h3>
          <div className="space-y-3">
            {topGainers.map((stock, index) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-4 bg-green-500/5 rounded-xl border border-green-500/10 hover:bg-green-500/10 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white">{stock.symbol}</p>
                    <p className="text-gray-400">${stock.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400">+{stock.changePercent.toFixed(2)}%</p>
                  <p className="text-gray-400">+${stock.change.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            Top Losers
          </h3>
          <div className="space-y-3">
            {topLosers.map((stock, index) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-red-400">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white">{stock.symbol}</p>
                    <p className="text-gray-400">${stock.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400">{stock.changePercent.toFixed(2)}%</p>
                  <p className="text-gray-400">${stock.change.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
