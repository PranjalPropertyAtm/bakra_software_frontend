
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
  const [isOpen, setIsOpen] = useState(false); // default closed on mobile

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
    { name: "Orders", path: "/orders", icon: <FiShoppingBag /> },
    { name: "Associates", path: "/associates", icon: <FiBarChart2 /> },
    { name: "Customers", path: "/customers", icon: <FiUsers /> },
    { name: "Reports", path: "/reports", icon: <FiBarChart2 /> },
    { name: "Settings", path: "/settings", icon: <FiSettings /> },
  ];

  return (
    <>
      {/* 📱 Mobile Top Bar */}


      {/* <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 fixed top-0 left-0 w-full z-50">
        <h1 className="text-xl font-semibold tracking-wide">Kitchen Admin</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div> */}

      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 fixed top-0 left-0 w-full z-50">
        {/* 👇 Left Section: Logo + Name */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Bakra Kitchen Logo"
            className="w-8 h-8  object-cover"
          />
          <h1 className="text-lg font-semibold tracking-wide">Bakra Cloud Kitchen</h1>
        </div>

        {/* 👇 Right Section: Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="p-1">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* 🧭 Sidebar Container */}
      <div
        className={`bg-slate-900 text-white h-screen overflow-y-auto fixed md:fixed top-0 left-0 z-50 transition-all duration-300 ease-in-out
        ${isOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-64"}`}
      >
        {/* Logo Section (⚠️ Unchanged) */}
        <div className="relative w-[64px] h-[64px] overflow-hidden shadow-2xl transition-transform duration-300 active:scale-95 m-24 mt-4 mb-0">
          <img
            src="/logo.png"
            alt="Bakra Kitchen Logo"
            fill
            sizes="(max-width: 768px) 96px, 112px"
            priority
            className="object-cover"
          />
        </div>

        {/* Sidebar Title */}
        {/* <div className="p-5 flex items-center justify-between md:justify-center border-b border-slate-700">
          <h2 className="text-xl font-bold tracking-wide text-gray-100">
            Kitchen Admin
          </h2>
        </div> */}
        <div className="p-5 flex items-center justify-center border-b border-slate-700">
  <h2 className="text-xl font-bold tracking-wide text-gray-100">
    Kitchen Admin
  </h2>
</div>

        {/* Menu List */}
        <nav className="mt-6">
          {menus.map((menu, idx) => (
            <NavLink
              key={idx}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors duration-200 hover:bg-slate-800 ${isActive ? "bg-slate-800 border-l-4 border-yellow-400" : ""
                }`
              }
              onClick={() => setIsOpen(false)} // close after clicking in mobile
            >
              <span className="text-lg">{menu.icon}</span>
              <span className="whitespace-nowrap">{menu.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 🖤 Background Overlay on Mobile */}
      {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )} */}
    </>
  );
};

export default AdminSidebar;
