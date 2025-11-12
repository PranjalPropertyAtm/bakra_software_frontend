// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/authContext";
// import Loader from "../components/Loader";

// const ProtectedRoutes = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <Loader text="Loading dashboard..." />;

//   return user ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoutes;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoutes = ({ children }) => {
  const { user } = useAuth();

  // If no user, redirect to login (no loader shown)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;

