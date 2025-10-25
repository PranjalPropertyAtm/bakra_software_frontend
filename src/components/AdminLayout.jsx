import React from "react";
import Sidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import { Outlet, useNavigate} from "react-router-dom";


const AdminLayout = () => {
    const navigate = useNavigate();
      const { logout } = useAuth();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <Navbar onLogout={logout} />
      <main className="flex-1 p-6 md:ml-64">
        <Outlet />
      </main>
    </div>
    </div>
  );
};

export default AdminLayout;
