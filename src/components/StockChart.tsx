import { useState } from 'react';
import { useStocks } from '../contexts/StockContext';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, BarChart2, Activity } from 'lucide-react';

interface StockChartProps {
  symbol: string;
}

export default function StockChart({ symbol }: StockChartProps) {
  const { getStockBySymbol, historicalData } = useStocks();
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const stock = getStockBySymbol(symbol);
  const data = historicalData[symbol] || [];

  if (!stock) return null;

  const isPositive = stock.changePercent >= 0;
  const lineColor = isPositive ? '#10b981' : '#ef4444';
  const gradientId = `gradient-${symbol}`;

  return (
    <div className="space-y-6">
      {/* Stock header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white">{stock.symbol.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-white mb-1">{stock.symbol}</h2>
            <p className="text-gray-400">{stock.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-white mb-1">${stock.price.toFixed(2)}</div>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>
                {isPositive ? '+' : ''}
                {stock.change.toFixed(2)} ({isPositive ? '+' : ''}
                {stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Chart type toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-lg transition ${
                chartType === 'area'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-500 hover:bg-gray-800'
              }`}
              title="Area chart"
            >
              <Activity className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-lg transition ${
                chartType === 'line'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-500 hover:bg-gray-800'
              }`}
              title="Line chart"
            >
              <BarChart2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 bg-[#0a0e27] rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3548" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f36',
                  border: '1px solid #2d3548',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          ) : (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3548" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1f36',
                  border: '1px solid #2d3548',
                  borderRadius: '12px',
                  padding: '12px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={lineColor}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: lineColor }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Additional stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0a0e27] rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 mb-2">Open</p>
          <p className="text-white">${stock.openPrice.toFixed(2)}</p>
        </div>
        <div className="bg-[#0a0e27] rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 mb-2">Volume</p>
          <p className="text-white">{(stock.volume / 1000000).toFixed(2)}M</p>
        </div>
        <div className="bg-[#0a0e27] rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 mb-2">Market Cap</p>
          <p className="text-white">{stock.marketCap}</p>
        </div>
        <div className="bg-[#0a0e27] rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 mb-2">Change</p>
          <p className={isPositive ? 'text-green-400' : 'text-red-400'}>
            {isPositive ? '+' : ''}${Math.abs(stock.change).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
