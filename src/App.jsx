// import React from 'react'
// import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
// import Login from './pages/Login.jsx';
// import Dashboard from './pages/Dashboard.jsx';
// import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
// import AdminLayout from './components/AdminLayout.jsx';
// import Orders from './pages/Orders/Orders.jsx';
// import AddOrder from './pages/Orders/AddOrder.jsx';
// import Customers from './pages/Customers.jsx';
// import Report from './pages/Reports.jsx';
// import Associates from './pages/Associates/Associates.jsx';
// import AddAssociate from './pages/Associates/addAssociate.jsx';
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { SearchProvider } from './context/SearchContext.jsx';
// import Settings from './pages/Settings.jsx';


// function App() {
//   return (
//     <>
//      <SearchProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* Redirect root to login immediately */}
//           <Route path='/' element={<Navigate to="/login" replace />} />
          
//           <Route path='/login' element={<Login />} />

//           {/* Protected routes */}
//           <Route element={<ProtectedRoutes><AdminLayout /></ProtectedRoutes>}>
//             <Route path='/dashboard' element={<Dashboard />} />
//             <Route path='/orders' element={<Orders />} />
//             <Route path='/orders/add' element={<AddOrder />} />
//             <Route path="/orders/edit/:id" element={<AddOrder />} />
//             <Route path='/customers' element={<Customers />} />
//             <Route path='/reports' element={<Report />} />
//             <Route path='/associates' element={<Associates />} />
//             <Route path='/associates/add' element={<AddAssociate />} />
//             <Route path='/settings' element={<Settings />} />
//           </Route>

//           {/* Catch-all: redirect unknown routes to login */}
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </BrowserRouter>

//       <ToastContainer
//         position="top-right"
//         autoClose={2500}
//         hideProgressBar
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="light"
//         style={{
//           fontSize: "14px",
//           fontWeight: 500,
//         }}
//       />
//     </SearchProvider>
//     </>
//   )
// }

// export default App

import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from './context/SearchContext.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Loader from './components/Loader.jsx';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Login.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Orders = lazy(() => import('./pages/Orders/Orders.jsx'));
const AddOrder = lazy(() => import('./pages/Orders/AddOrder.jsx'));
const Customers = lazy(() => import('./pages/Customers.jsx'));
const Report = lazy(() => import('./pages/Reports.jsx'));
const Associates = lazy(() => import('./pages/Associates/Associates.jsx'));
const AddAssociate = lazy(() => import('./pages/Associates/addAssociate.jsx'));
const Settings = lazy(() => import('./pages/Settings.jsx'));


function App() {
  return (
    <>
     <SearchProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader text="Loading..." />}>
          <Routes>
            {/* Redirect root to login immediately */}
            <Route path='/' element={<Navigate to="/login" replace />} />
            
            <Route path='/login' element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoutes><AdminLayout /></ProtectedRoutes>}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/orders' element={<Orders />} />
              <Route path='/orders/add' element={<AddOrder />} />
              <Route path="/orders/edit/:id" element={<AddOrder />} />
              <Route path='/customers' element={<Customers />} />
              <Route path='/reports' element={<Report />} />
              <Route path='/associates' element={<Associates />} />
              <Route path='/associates/add' element={<AddAssociate />} />
              <Route path='/settings' element={<Settings />} />
            </Route>

            {/* Catch-all: redirect unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        style={{
          fontSize: "14px",
          fontWeight: 500,
        }}
      />
    </SearchProvider>
    </>
  )
}

export default App

