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
         <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium shadow-md transition transform hover:scale-105"
            >
              <LogOut size={18} />
              Logout
            </button>
    </div>
  );
};

export default Dashboard;
