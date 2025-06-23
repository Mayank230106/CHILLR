import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const getSafeUserFromStorage = () => {
  try {
    const userString = localStorage.getItem('user');
    return userString && userString !== 'undefined' ? JSON.parse(userString) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSafeUserFromStorage);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:3000/clients',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      if (!email || !password) throw new Error('Email and password are required');

      const res = await api.post('/login', { email, password });
      const { user, token } = res.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, password, role }) => {
    setLoading(true);
    setError(null);
    try {
      if (!name || !email || !password || !role) throw new Error('All fields are required');

      const res = await api.post('/signup', { name, email, password, role });
      const { user, token } = res.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/logout'); // 👈 Hits the backend logout route (optional but good practice)
    } catch (err) {
      console.error('Logout error:', err); // Don't block logout on API error
    } finally {
      setUser(null);
      setToken('');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
