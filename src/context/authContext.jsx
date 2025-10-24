import React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios.js";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token on app load
  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    try {
      const res = await axiosInstance.get("auth/verify"); // backend verify route
      if (res.data.success) setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axiosInstance.post("auth/login", { email, password });
    setUser(res.data);
  };

  const logout = async () => {
    await axiosInstance.post("auth/logout"); // optional if you have logout API
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
