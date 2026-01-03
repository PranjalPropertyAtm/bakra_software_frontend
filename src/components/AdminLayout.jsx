// import React from "react";
// import Sidebar from "../components/AdminSidebar";
// import Navbar from "../components/Navbar";
// import { useAuth } from "../context/authContext";
// import { Outlet, useNavigate} from "react-router-dom";


// const AdminLayout = () => {
//     const navigate = useNavigate();
//       const { logout } = useAuth();

//   return (
//     <div className="flex bg-gray-50 min-h-screen">
//       <Sidebar />
//     <div className="flex-1 flex flex-col md:ml-64 min-w-0">
//         <Navbar onLogout={logout} />
//         <main className="flex-1 p-6 transition-all duration-300">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;


import React, { memo, useCallback } from "react";
import Sidebar from "../components/AdminSidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/authContext";
import { Outlet } from "react-router-dom";

const AdminLayout = memo(() => {
  const { logout } = useAuth();
  
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

        <div className="flex-1 flex flex-col md:ml-64 min-w-0">

        {/* FIXED HEIGHT NAVBAR */}
        <Navbar onLogout={handleLogout} />

        {/* CONTENT SCROLLS, NAVBAR DOES NOT */}
        <main className="flex-1 p-6 overflow-auto h-[calc(100vh-70px)]">
          <Outlet />
        </main>

      </div>
    </div>
  );
});

AdminLayout.displayName = 'AdminLayout';

export default AdminLayout;
