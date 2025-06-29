import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockStocks, generateHistoricalData } from '../services/mockData';
import { Stock, Alert, HistoricalDataPoint } from '../types';
import { toast } from 'sonner@2.0.3';

interface StockContextType {
  stocks: Stock[];
  watchlist: string[];
  alerts: Alert[];
  historicalData: { [key: string]: HistoricalDataPoint[] };
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'triggered'>) => void;
  updateAlert: (id: string, alert: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  getStockBySymbol: (symbol: string) => Stock | undefined;
  isLoading: boolean;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'GOOGL', 'MSFT']);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      symbol: 'AAPL',
      type: 'above',
      threshold: 180,
      triggered: false,
    },
    {
      id: '2',
      symbol: 'GOOGL',
      type: 'below',
      threshold: 140,
      triggered: false,
    },
  ]);
  const [historicalData, setHistoricalData] = useState<{ [key: string]: HistoricalDataPoint[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Simulate real-time price updates (WebSocket/Kafka simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Random price change between -2% and +2%
          const changePercent = (Math.random() - 0.5) * 4;
          const priceChange = stock.price * (changePercent / 100);
          const newPrice = Math.max(0.01, stock.price + priceChange);
          const newChange = newPrice - stock.openPrice;
          const newChangePercent = (newChange / stock.openPrice) * 100;

          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(newChange.toFixed(2)),
            changePercent: parseFloat(newChangePercent.toFixed(2)),
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Check alerts when prices change
  useEffect(() => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => {
        const stock = stocks.find((s) => s.symbol === alert.symbol);
        if (!stock) return alert;

        const shouldTrigger =
          (alert.type === 'above' && stock.price >= alert.threshold) ||
          (alert.type === 'below' && stock.price <= alert.threshold);

        if (shouldTrigger && !alert.triggered) {
          // Show toast notification
          toast.success(`Alert Triggered: ${alert.symbol}`, {
            description: `Price ${alert.type} $${alert.threshold}. Current: $${stock.price}`,
            duration: 5000,
          });
          
          // Browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Alert: ${alert.symbol}`, {
              body: `Price ${alert.type} $${alert.threshold}. Current: $${stock.price}`,
              icon: '/favicon.ico',
            });
          }
          return { ...alert, triggered: true };
        }

        return alert;
      })
    );
  }, [stocks]);

  // Generate historical data for stocks
  useEffect(() => {
    const data: { [key: string]: HistoricalDataPoint[] } = {};
    stocks.forEach((stock) => {
      data[stock.symbol] = generateHistoricalData(stock.symbol, stock.price);
    });
    setHistoricalData(data);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      toast.success('Added to Watchlist', {
        description: `${symbol} has been added to your watchlist`,
      });
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
    toast.info('Removed from Watchlist', {
      description: `${symbol} has been removed from your watchlist`,
    });
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'triggered'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      triggered: false,
    };
    setAlerts([...alerts, newAlert]);
    toast.success('Alert Created', {
      description: `You'll be notified when ${alert.symbol} goes ${alert.type} $${alert.threshold}`,
    });
  };

  const updateAlert = (id: string, updatedAlert: Partial<Alert>) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, ...updatedAlert } : alert)));
    toast.success('Alert Updated', {
      description: 'Your alert has been updated successfully',
    });
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
    toast.info('Alert Deleted', {
      description: 'Your alert has been removed',
    });
  };

  const getStockBySymbol = (symbol: string) => {
    return stocks.find((s) => s.symbol === symbol);
  };

  return (
    <StockContext.Provider
      value={{
        stocks,
        watchlist,
        alerts,
        historicalData,
        addToWatchlist,
        removeFromWatchlist,
        addAlert,
        updateAlert,
        deleteAlert,
        getStockBySymbol,
        isLoading,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStocks() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStocks must be used within a StockProvider');
  }
  return context;
}
