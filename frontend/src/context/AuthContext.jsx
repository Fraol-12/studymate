import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ai-study-auth");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const accessToken = res.data.access_token;
      setToken(accessToken);
      setUser({ email });
      localStorage.setItem(
        "ai-study-auth",
        JSON.stringify({ user: { email }, token: accessToken })
      );
    } catch (error) {
      const message = error.response?.data?.detail || error.message || "Login failed";
      throw new Error(message);
    }
  };

  const signup = async (email, password) => {
    try {
      await api.post("/auth/signup", { email, password });
      await login(email, password);
    } catch (error) {
      const message = error.response?.data?.detail || error.message || "Signup failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ai-study-auth");
  };

  const value = { user, token, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthHeader() {
  const { token } = useAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


