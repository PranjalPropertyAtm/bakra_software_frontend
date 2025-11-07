import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loader from "../components/Loader";

const LandingRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Loading..." />;

  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default LandingRedirect;
