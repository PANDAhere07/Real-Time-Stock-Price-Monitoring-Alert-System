import { LayoutDashboard, Star, Bell, BarChart3, User, LogOut, X } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: 'overview' | 'watchlist' | 'alerts' | 'analytics' | 'profile') => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'watchlist', label: 'Watchlist', icon: Star },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleMenuClick = (view: 'overview' | 'watchlist' | 'alerts' | 'analytics' | 'profile') => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-[#1a1f36] border-r border-gray-800 transition-transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="lg:hidden p-4 border-b border-gray-800">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-800">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl p-4 mb-3 border border-blue-500/20">
              <p className="text-white mb-1">Market Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Markets Open</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
