import { useState } from 'react';
import { useStocks } from '../contexts/StockContext';
import { Plus, X, TrendingUp, TrendingDown, Search } from 'lucide-react';

interface WatchlistManagerProps {
  onSelectStock: (symbol: string) => void;
}

export default function WatchlistManager({ onSelectStock }: WatchlistManagerProps) {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist } = useStocks();
  const [isAddingStock, setIsAddingStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const watchedStocks = stocks.filter((stock) => watchlist.includes(stock.symbol));
  const availableStocks = stocks.filter(
    (stock) =>
      !watchlist.includes(stock.symbol) &&
      (stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddStock = (symbol: string) => {
    addToWatchlist(symbol);
    setSearchQuery('');
    setIsAddingStock(false);
  };

  return (
    <div className="space-y-6">
      {/* Add stock button */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
        {!isAddingStock ? (
          <button
            onClick={() => setIsAddingStock(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            Add Stock to Watchlist
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search stocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setIsAddingStock(false);
                  setSearchQuery('');
                }}
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition"
              >
                Cancel
              </button>
            </div>

            {searchQuery && (
              <div className="max-h-60 overflow-y-auto border border-gray-700 rounded-xl">
                {availableStocks.length > 0 ? (
                  availableStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleAddStock(stock.symbol)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition border-b border-gray-800 last:border-b-0"
                    >
                      <div className="text-left">
                        <div className="text-white">{stock.symbol}</div>
                        <div className="text-gray-400">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white">${stock.price.toFixed(2)}</div>
                        <div
                          className={
                            stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                          }
                        >
                          {stock.changePercent >= 0 ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No stocks found</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Watchlist */}
      <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-white">Your Watchlist ({watchedStocks.length})</h3>
        </div>

        {watchedStocks.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="mb-2">Your watchlist is empty</p>
            <p>Add stocks to track their performance</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {watchedStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="p-6 hover:bg-gray-800/30 transition cursor-pointer"
                onClick={() => onSelectStock(stock.symbol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white">{stock.symbol}</h4>
                      <span className="text-gray-400">{stock.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white">${stock.price.toFixed(2)}</span>
                      <span
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                          stock.changePercent >= 0 
                            ? 'bg-green-500/10 text-green-400' 
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {stock.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        {stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWatchlist(stock.symbol);
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}