export interface Stock {
  symbol: string;
  name: string;
  price: number;
  openPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'above' | 'below';
  threshold: number;
  triggered: boolean;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
