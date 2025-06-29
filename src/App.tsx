import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { StockProvider } from './contexts/StockContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <StockProvider>
          <div className="min-h-screen bg-[#0a0e27]">
            <Toaster 
              position="top-right" 
              theme="dark"
              toastOptions={{
                style: {
                  background: '#1a1f36',
                  border: '1px solid #2d3548',
                  color: '#fff',
                },
              }}
            />
            {!isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Dashboard onLogout={handleLogout} />
            )}
          </div>
        </StockProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
