import { useState } from 'react';
import { Menu, Search, Bell, TrendingUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useStocks } from '../contexts/StockContext';

interface NavbarProps {
  userName: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function Navbar({ userName, onToggleSidebar }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { alerts } = useStocks();
  const [showNotifications, setShowNotifications] = useState(false);
  
  const triggeredAlerts = alerts.filter((alert) => alert.triggered);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f36] border-b border-gray-800 backdrop-blur-lg bg-opacity-95">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <Menu className="w-6 h-6 text-gray-300" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-white">StockWatch Pro</h2>
                <p className="text-gray-400">Real-time Monitoring</p>
              </div>
            </div>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search stocks..."
                className="w-full pl-11 pr-4 py-2 bg-[#0a0e27] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-white placeholder-gray-500"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-800 rounded-lg transition relative"
              >
                <Bell className="w-5 h-5 text-gray-300" />
                {triggeredAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-[#1a1f36] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-800">
                      <h3 className="text-white">Notifications</h3>
                      <p className="text-gray-400">
                        {triggeredAlerts.length} active alert{triggeredAlerts.length !== 1 && 's'}
                      </p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {triggeredAlerts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          No notifications
                        </div>
                      ) : (
                        triggeredAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                              <div>
                                <p className="text-white">{alert.symbol}</p>
                                <p className="text-gray-400">
                                  Price went {alert.type} ${alert.threshold}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-700">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="hidden sm:block text-white">{userName}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
