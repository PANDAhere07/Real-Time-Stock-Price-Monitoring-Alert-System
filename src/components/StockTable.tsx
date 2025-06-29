import { useState, useMemo } from 'react';
import { useStocks } from '../contexts/StockContext';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Star } from 'lucide-react';

interface StockTableProps {
  selectedStock: string | null;
  onSelectStock: (symbol: string) => void;
}

type SortField = 'symbol' | 'name' | 'price' | 'changePercent' | 'volume';
type SortOrder = 'asc' | 'desc';

export default function StockTable({ selectedStock, onSelectStock }: StockTableProps) {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist } = useStocks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterWatchlist, setFilterWatchlist] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedStocks = useMemo(() => {
    let result = [...stocks];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by watchlist
    if (filterWatchlist) {
      result = result.filter((stock) => watchlist.includes(stock.symbol));
    }

    // Sort
    result.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [stocks, searchQuery, filterWatchlist, sortField, sortOrder, watchlist]);

  const toggleWatchlist = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (watchlist.includes(symbol)) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(symbol);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h3 className="text-white mb-4">Market Stocks</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search stocks by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500"
            />
          </div>
          <button
            onClick={() => setFilterWatchlist(!filterWatchlist)}
            className={`px-4 py-2.5 rounded-xl border transition ${
              filterWatchlist
                ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Star className={`w-5 h-5 inline mr-2 ${filterWatchlist ? 'fill-current' : ''}`} />
            Watchlist
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left">
                <span className="sr-only">Watchlist</span>
              </th>
              <th
                className="px-6 py-4 text-left text-gray-400 cursor-pointer hover:text-white transition"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center gap-2">
                  Symbol
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-gray-400 cursor-pointer hover:text-white transition"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Name
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-right text-gray-400 cursor-pointer hover:text-white transition"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-2">
                  Price
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-right text-gray-400 cursor-pointer hover:text-white transition"
                onClick={() => handleSort('changePercent')}
              >
                <div className="flex items-center justify-end gap-2">
                  Change
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-gray-400">Volume</th>
              <th className="px-6 py-4 text-right text-gray-400">Market Cap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredAndSortedStocks.map((stock) => (
              <tr
                key={stock.symbol}
                onClick={() => onSelectStock(stock.symbol)}
                className={`cursor-pointer transition hover:bg-gray-800/50 ${
                  selectedStock === stock.symbol ? 'bg-blue-500/10' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <button
                    onClick={(e) => toggleWatchlist(stock.symbol, e)}
                    className="text-gray-500 hover:text-yellow-500 transition"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        watchlist.includes(stock.symbol) ? 'fill-yellow-500 text-yellow-500' : ''
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-white">{stock.symbol}</td>
                <td className="px-6 py-4 text-gray-400">{stock.name}</td>
                <td className="px-6 py-4 text-right text-white">
                  ${stock.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${
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
                    <span>
                      {stock.changePercent >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-gray-400">
                  {(stock.volume / 1000000).toFixed(2)}M
                </td>
                <td className="px-6 py-4 text-right text-gray-400">{stock.marketCap}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSortedStocks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No stocks found. Try adjusting your search or filters.
          </div>
        )}
      </div>
    </div>
  );
}