import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiMenu,
  FiX,
} from "react-icons/fi";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Orders", path: "/orders", icon: <FiShoppingBag /> },
    { name: "Menu", path: "/menu", icon: <FiBarChart2 /> },
    { name: "Customers", path: "/customers", icon: <FiUsers /> },
    { name: "Reports", path: "/reports", icon: <FiBarChart2 /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3">
        <h1 className="text-xl font-semibold tracking-wide">Bakra Admin</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div
        // className={`bg-slate-900 text-white min-h-screen fixed md:static top-0 left-0 z-50 transition-all duration-300 ${
        //   isOpen ? "w-64" : "w-0 md:w-20"
        // } overflow-hidden md:block`}
             className="bg-slate-900 text-white min-h-screen fixed md:static top-0 left-0 z-50 transition-all duration-300 md:block w-64" 
      >
    

        <div className="relative w-[64px] h-[64px] overflow-hidden shadow-2xl transition-transform duration-300  active:scale-95 m-24 mt-4 mb-0 ">
                <img
                  src="/logo.png"
                  alt="Bakra Kitchen Logo"
                  fill
                  sizes="(max-width: 768px) 96px, 112px"
                  priority
                  className="object-cover"
                />
              </div>

        <div className="p-5 flex items-center justify-between md:justify-center border-b border-slate-700">
          <h2
            className={`text-xl font-bold tracking-wide transition-opacity duration-300 text-gray-100 } ${
              isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
            }`}
            // className="text-xl font-bold tracking-wide transition-opacity duration-300 text-gray-100 "
          >
            Kitchen Admin
          </h2>
        </div>

        <nav className="mt-6">
          {menus.map((menu, idx) => (
            <NavLink
              key={idx}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-slate-800 ${
                  isActive ? "bg-slate-800 border-l-4 border-yellow-400" : ""
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">{menu.icon}</span>
              <span
                className={`whitespace-nowrap transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0 md:opacity-100"
                }`}
              >
                {menu.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
