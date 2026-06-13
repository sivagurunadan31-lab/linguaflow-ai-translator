import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('linguaflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('linguaflow_token');
    if (!token) return;

    setLoading(true);
    api.get('/auth/profile')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('linguaflow_user', JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem('linguaflow_token');
        localStorage.removeItem('linguaflow_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem('linguaflow_token', data.token);
    localStorage.setItem('linguaflow_user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    persistSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('linguaflow_token');
    localStorage.removeItem('linguaflow_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
