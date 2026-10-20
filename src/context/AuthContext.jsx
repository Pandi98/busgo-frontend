import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('bus_token');
    const savedUser  = localStorage.getItem('bus_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    const { token, ...userData } = authData;
    setToken(token);
    setUser(userData);
    localStorage.setItem('bus_token', token);
    localStorage.setItem('bus_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bus_token');
    localStorage.removeItem('bus_user');
  };
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(
        "bus_user",
        JSON.stringify(updatedUser)
    );
};

  const isAdmin = () => user?.role === 'ADMIN';
  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin,  updateUser, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
