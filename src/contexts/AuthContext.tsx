import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check localStorage for existing user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call with JWT authentication
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const mockUser = {
            id: '1',
            email,
            name: email.split('@')[0],
          };
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call for user registration
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6 && name) {
          const mockUser = {
            id: '1',
            email,
            name,
          };
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          setUser(mockUser);
          resolve();
        } else {
          reject(new Error('Invalid input'));
        }
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
