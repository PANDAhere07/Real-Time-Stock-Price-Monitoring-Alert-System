import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useStocks } from '../contexts/StockContext';

export default function MarketOverview() {
  const { stocks, watchlist } = useStocks();

  // Calculate market stats
  const gainers = stocks.filter((s) => s.changePercent > 0).length;
  const losers = stocks.filter((s) => s.changePercent < 0).length;
  const avgChange =
    stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length;
  const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);

  const stats = [
    {
      label: 'Gainers',
      value: gainers,
      change: '+' + ((gainers / stocks.length) * 100).toFixed(1) + '%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      label: 'Losers',
      value: losers,
      change: ((losers / stocks.length) * 100).toFixed(1) + '%',
      icon: TrendingDown,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    {
      label: 'Avg Change',
      value: avgChange.toFixed(2) + '%',
      change: avgChange > 0 ? 'Positive' : 'Negative',
      icon: Activity,
      color: avgChange > 0 ? 'from-blue-500 to-cyan-600' : 'from-orange-500 to-amber-600',
      bgColor: avgChange > 0 ? 'bg-blue-500/10' : 'bg-orange-500/10',
      borderColor: avgChange > 0 ? 'border-blue-500/20' : 'border-orange-500/20',
    },
    {
      label: 'Watchlist',
      value: watchlist.length,
      change: 'Stocks tracked',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-[#1a1f36] rounded-2xl border ${stat.borderColor} p-6 hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-white mb-1">{stat.value}</h3>
              <p className="text-gray-500">{stat.change}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
