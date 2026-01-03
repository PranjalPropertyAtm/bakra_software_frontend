// import React from "react";
// import { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance from "../lib/axios.js";

// const authContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Verify token on app load
//   useEffect(() => {
//     verifyUser();
//   }, []);

//   const verifyUser = async () => {
//     try {
//       const res = await axiosInstance.get("auth/verify"); // backend verify route
//       if (res.data.success) setUser(res.data.user);
//     } catch (err) {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const res = await axiosInstance.post("auth/login", { email, password });
//     setUser(res.data);
//   };

//   const logout = async () => {
//     await axiosInstance.post("auth/logout"); // optional if you have logout API
//     setUser(null);
//   };

//   return (
//     <authContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </authContext.Provider>
//   );
// };

// export const useAuth = () => useContext(authContext);
// import React from "react";
// import { createContext, useContext, useState, useEffect } from "react";
// import axiosInstance from "../lib/axios.js";

// const authContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Verify token on app load (non-blocking)
//   useEffect(() => {
//     verifyUser();
//   }, []);

//   const verifyUser = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setUser(null);
//         return;
//       }
      
//       const res = await axiosInstance.get("auth/verify");
//       if (res.data.success) setUser(res.data.user);
//     } catch (err) {
//       setUser(null);
//       localStorage.removeItem('token');
//     }
//   };

//   const login = async (email, password) => {
//     const res = await axiosInstance.post("auth/login", { email, password });
//     setUser(res.data);
//   };

//   const logout = async () => {
//     await axiosInstance.post("auth/logout"); // optional if you have logout API
//     setUser(null);
//   };

//   return (
//     <authContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </authContext.Provider>
//   );
// };

// export const useAuth = () => useContext(authContext);

import React, { useMemo, useCallback } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios.js";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Verify token on app load (non-blocking)
  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      
      const res = await axiosInstance.get("auth/verify");
      if (res.data.success) setUser(res.data.user);
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token');
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await axiosInstance.post("auth/login", { email, password });
    setUser(res.data);
  }, []);

  const logout = useCallback(async () => {
    await axiosInstance.post("auth/logout"); // optional if you have logout API
    setUser(null);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
  }), [user, loading, login, logout]);

  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);

