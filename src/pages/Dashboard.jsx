import React from "react";
import { useAuth } from "../context/authContext";
import { LogOut } from "lucide-react";

const Dashboard = () => {
    const { logout } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">
        Welcome to Bakra Cloud Kitchen Admin 🐐
      </h1>
    </div>
  );
};

export default Dashboard;
