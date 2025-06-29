import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StockTable from '../components/StockTable';
import StockChart from '../components/StockChart';
import WatchlistManager from '../components/WatchlistManager';
import AlertsManager from '../components/AlertsManager';
import UserProfile from '../components/UserProfile';
import Analytics from '../components/Analytics';
import MarketOverview from '../components/MarketOverview';

interface DashboardProps {
  onLogout: () => void;
}

type View = 'overview' | 'watchlist' | 'alerts' | 'analytics' | 'profile';

export default function Dashboard({ onLogout }: DashboardProps) {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<View>('overview');
  const [selectedStock, setSelectedStock] = useState<string | null>('AAPL');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Navbar */}
      <Navbar
        userName={user?.name || 'User'}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main content */}
        <div className="flex-1 lg:ml-64 mt-16">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {activeView === 'overview' && (
              <div className="space-y-6">
                {/* Market Overview Stats */}
                <MarketOverview />

                {/* Stock Chart */}
                {selectedStock && (
                  <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 p-6">
                    <StockChart symbol={selectedStock} />
                  </div>
                )}

                {/* Stock Table */}
                <div className="bg-[#1a1f36] rounded-2xl border border-gray-800 overflow-hidden">
                  <StockTable
                    selectedStock={selectedStock}
                    onSelectStock={setSelectedStock}
                  />
                </div>
              </div>
            )}

            {activeView === 'watchlist' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-white mb-2">My Watchlist</h1>
                  <p className="text-gray-400">Track your favorite stocks in one place</p>
                </div>
                <WatchlistManager onSelectStock={setSelectedStock} />
              </div>
            )}

            {activeView === 'alerts' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-white mb-2">Price Alerts</h1>
                  <p className="text-gray-400">Never miss important price movements</p>
                </div>
                <AlertsManager />
              </div>
            )}

            {activeView === 'analytics' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-white mb-2">Analytics & Insights</h1>
                  <p className="text-gray-400">Deep dive into market trends and performance</p>
                </div>
                <Analytics />
              </div>
            )}

            {activeView === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-white mb-2">Profile & Settings</h1>
                  <p className="text-gray-400">Manage your account and preferences</p>
                </div>
                <UserProfile />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
