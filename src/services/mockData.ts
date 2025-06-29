import { Stock, HistoricalDataPoint } from '../types';

// Mock stock data
export const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    openPrice: 173.5,
    change: 1.93,
    changePercent: 1.11,
    volume: 58234567,
    marketCap: '2.75T',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.35,
    openPrice: 143.2,
    change: -0.85,
    changePercent: -0.59,
    volume: 24567890,
    marketCap: '1.78T',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    openPrice: 376.8,
    change: 2.11,
    changePercent: 0.56,
    volume: 32145678,
    marketCap: '2.82T',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 151.23,
    openPrice: 152.1,
    change: -0.87,
    changePercent: -0.57,
    volume: 41234567,
    marketCap: '1.56T',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 242.84,
    openPrice: 238.5,
    change: 4.34,
    changePercent: 1.82,
    volume: 98765432,
    marketCap: '771B',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 495.22,
    openPrice: 492.3,
    change: 2.92,
    changePercent: 0.59,
    volume: 45678901,
    marketCap: '1.22T',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    price: 338.15,
    openPrice: 340.2,
    change: -2.05,
    changePercent: -0.60,
    volume: 18765432,
    marketCap: '865B',
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    price: 445.67,
    openPrice: 443.8,
    change: 1.87,
    changePercent: 0.42,
    volume: 5678901,
    marketCap: '192B',
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 119.45,
    openPrice: 121.2,
    change: -1.75,
    changePercent: -1.44,
    volume: 67890123,
    marketCap: '193B',
  },
  {
    symbol: 'INTC',
    name: 'Intel Corporation',
    price: 43.21,
    openPrice: 42.9,
    change: 0.31,
    changePercent: 0.72,
    volume: 34567890,
    marketCap: '182B',
  },
];

// Generate historical data for charts (last 30 days)
export function generateHistoricalData(symbol: string, currentPrice: number): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const days = 30;
  let price = currentPrice * 0.9; // Start from 10% lower

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic variation
    const change = (Math.random() - 0.48) * (currentPrice * 0.02);
    price = Math.max(currentPrice * 0.7, price + change);
    
    // Trend towards current price as we get closer to today
    const daysFromToday = i;
    const trendFactor = daysFromToday / days;
    price = price * (1 - trendFactor * 0.02) + currentPrice * trendFactor * 0.02;

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }

  // Ensure the last price matches current price
  data[data.length - 1].price = currentPrice;

  return data;
}
