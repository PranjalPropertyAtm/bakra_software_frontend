// import React, { useState } from "react";
// import { FiBell, FiChevronDown, FiSearch, FiLogOut, FiUser } from "react-icons/fi";

// const Navbar = ({ onLogout }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const [notifications] = useState([
//     { id: 1, text: "New order received" },
//     { id: 2, text: "Inventory stock low" },
//   ]);

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-40">
//       <div className="flex items-center justify-between px-4 md:px-8 py-3">
//         {/* ✅ Left - Page Title or Brand */}
//         <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-wide">
//           Bakra Cloud Kitchen
//         </h1>

//         {/* ✅ Middle - Search Bar */}
//         <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full w-1/3">
//           <FiSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search orders, customers..."
//             className="bg-transparent outline-none w-full text-sm text-gray-700"
//           />
//         </div>

//         {/* ✅ Right - Notification + Profile */}
//         <div className="flex items-center gap-4 relative">
//           {/* 🔔 Notification */}
//           <div className="relative">
//             <FiBell
//               className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition"
//               onClick={() => alert("Coming soon: Notifications center")}
//             />
//             {notifications.length > 0 && (
//               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
//             )}
//           </div>

//           {/* 👤 Profile */}
//           <div className="relative">
//             <button
//               onClick={() => setShowMenu(!showMenu)}
//               className="flex items-center gap-2"
//             >
//               <img
//                 src="https://api.dicebear.com/8.x/avataaars/svg?seed=bakra"
//                 alt="Admin Avatar"
//                 className="w-8 h-8 rounded-full border border-gray-300"
//               />
//               <span className="hidden md:inline text-gray-700 font-medium">
//                 Admin
//               </span>
//               <FiChevronDown className="text-gray-500" />
//             </button>

//             {/* Profile Dropdown */}
//             {showMenu && (
//               <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg w-48 border border-gray-100">
//                 <ul className="text-gray-700 text-sm">
//                   <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                     <FiUser /> Profile
//                   </li>
//                   <li
//                     onClick={onLogout}
//                     className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500"
//                   >
//                     <FiLogOut /> Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 🔍 Mobile Search */}
//       <div className="px-4 pb-3 md:hidden">
//         <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
//           <FiSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="bg-transparent outline-none w-full text-sm text-gray-700"
//           />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// import React, { useState } from "react";
// import { FiBell, FiChevronDown, FiSearch, FiLogOut, FiUser } from "react-icons/fi";
// import { useSearch } from "../context/SearchContext";

// const Navbar = ({ onLogout }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const { searchTerm, setSearchTerm } = useSearch();

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-40">
//       <div className="flex items-center justify-between px-4 md:px-8 py-3">
//         <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-wide">
//           Bakra Cloud Kitchen
//         </h1>

//         <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full w-1/3">
//           <FiSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search orders, customers..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="bg-transparent outline-none w-full text-sm text-gray-700"
//           />
//         </div>

//         <div className="flex items-center gap-4 relative">
//           <div className="relative">
//             <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />
//           </div>

//           <div className="relative">
//             <button
//               onClick={() => setShowMenu(!showMenu)}
//               className="flex items-center gap-2"
//             >
//               <img
//                 src="https://api.dicebear.com/8.x/avataaars/svg?seed=bakra"
//                 alt="Admin Avatar"
//                 className="w-8 h-8 rounded-full border border-gray-300"
//               />
//               <span className="hidden md:inline text-gray-700 font-medium">
//                 Admin
//               </span>
//               <FiChevronDown className="text-gray-500" />
//             </button>

//             {showMenu && (
//               <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg w-48 border border-gray-100">
//                 <ul className="text-gray-700 text-sm">
//                   <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                     <FiUser /> Profile
//                   </li>
//                   <li
//                     onClick={onLogout}
//                     className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500"
//                   >
//                     <FiLogOut /> Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState } from "react";
// import { FiBell, FiChevronDown, FiSearch, FiLogOut, FiUser } from "react-icons/fi";
// import { useSearch } from "../context/SearchContext";

// const Navbar = ({ onLogout }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const { searchTerm, setSearchTerm } = useSearch();

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-40">
//       <div className="flex items-center justify-between px-4 md:px-8 py-3">
//         {/* ✅ Left - Logo / Brand */}
//         <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-wide">
//           Bakra Cloud Kitchen
//         </h1>

//         {/* ✅ Middle - Search (visible on desktop) */}
//         <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full w-1/3">
//           <FiSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search orders, customers..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="bg-transparent outline-none w-full text-sm text-gray-700"
//           />
//         </div>

//         {/* ✅ Right - Notification + Profile */}
//         <div className="flex items-center gap-4 relative">
//           {/* Notification */}
//           <div className="relative">
//             <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />
//           </div>

//           {/* Profile Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setShowMenu(!showMenu)}
//               className="flex items-center gap-2"
//             >
//               <img
//                 src="https://api.dicebear.com/8.x/avataaars/svg?seed=bakra"
//                 alt="Admin Avatar"
//                 className="w-8 h-8 rounded-full border border-gray-300"
//               />
//               <span className="hidden md:inline text-gray-700 font-medium">
//                 Admin
//               </span>
//               <FiChevronDown className="text-gray-500" />
//             </button>

//             {showMenu && (
//               <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg w-48 border border-gray-100">
//                 <ul className="text-gray-700 text-sm">
//                   <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                     <FiUser /> Profile
//                   </li>
//                   <li
//                     onClick={onLogout}
//                     className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500"
//                   >
//                     <FiLogOut /> Logout
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ✅ Mobile Search Bar (visible only on mobile) */}
//       <div className="px-4 pb-3 md:hidden">
//         <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
//           <FiSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="bg-transparent outline-none w-full text-sm text-gray-700"
//           />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiSearch,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { useSearch } from "../context/SearchContext";

const Navbar = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      {/* ✅ Top Row */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Left - Logo */}
        <h1 className="text-lg md:text-xl font-semibold text-gray-800 tracking-wide">
          Bakra Cloud Kitchen
        </h1>

        {/* Middle - Search (desktop) */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full w-1/3">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-transparent outline-none w-full text-sm text-gray-700"
          />
        </div>

        {/* Right - Notification + Profile */}
        <div className="flex items-center gap-4 relative">
          {/* Notification */}
          <FiBell className="text-gray-600 text-xl cursor-pointer hover:text-gray-800 transition" />

          {/* Profile Menu (Desktop only) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2"
            >
              <img
                src="https://api.dicebear.com/8.x/avataaars/svg?seed=bakra"
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full border border-gray-300"
              />
              <span className="hidden md:inline text-gray-700 font-medium">
                Admin
              </span>
              <FiChevronDown className="text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-lg w-48 border border-gray-100">
                <ul className="text-gray-700 text-sm">
                  {/* <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <FiUser /> Profile
                  </li> */}
                  <li
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500"
                  >
                    <FiLogOut /> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Mobile Section (Search + Admin Options) */}
    {/* ✅ Mobile Section - Search + Admin in same line */}
<div className="px-4 pb-3 md:hidden flex items-center justify-between gap-3">
  {/* 🔍 Search */}
  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full flex-1">
    <FiSearch className="text-gray-500 mr-2" />
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="bg-transparent outline-none w-full text-sm text-gray-700"
    />
  </div>

  {/* 👤 Admin + Logout */}
  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 shrink-0">
    <img
      src="https://api.dicebear.com/8.x/avataaars/svg?seed=bakra"
      alt="Admin Avatar"
      className="w-7 h-7 rounded-full border border-gray-300"
    />
    <p className="text-sm font-medium text-gray-700">Admin</p>
    <button
      onClick={onLogout}
      className="text-red-500 text-sm flex items-center gap-1 hover:text-red-600 transition"
    >
      <FiLogOut />
    </button>
  </div>
</div>
    </nav>
  );
};

export default Navbar;
