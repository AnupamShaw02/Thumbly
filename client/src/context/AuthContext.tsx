import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { authApi, setToken, clearToken } from '../services/api';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    if (res.data.token) setToken(res.data.token);
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name}!`);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await authApi.signup(name, email, password);
    if (res.data.token) setToken(res.data.token);
    setUser(res.data.user);
    toast.success(`Account created! Welcome, ${res.data.user.name}!`);
  };

  const logout = async () => {
    await authApi.logout();
    clearToken();
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
