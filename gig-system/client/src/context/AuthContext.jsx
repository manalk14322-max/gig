import { createContext, useContext, useEffect, useState } from 'react';
import { fetchMe, login as apiLogin, signup as apiSignup, fetchProfile } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(async (data) => {
        if (data.user) {
          const profile = await fetchProfile().catch(() => null);
          setUser(profile || data.user);
        } else {
          setUser(null);
        }
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  const login = async (payload) => {
    const data = await apiLogin(payload);
    localStorage.setItem('gig.token', data.token);
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const data = await apiSignup(payload);
    localStorage.setItem('gig.token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('gig.token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, ready, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
