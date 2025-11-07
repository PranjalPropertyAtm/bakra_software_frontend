import React from 'react'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Orders from './pages/Orders.jsx';
import Customers from './pages/Customers.jsx';
import Report from './pages/Reports.jsx';
import Associates from './pages/Associates.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from './context/SearchContext.jsx';
import Settings from './pages/Settings.jsx';


function App() {
  return (
    <>
     <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route path='/' element={<ProtectedRoutes><AdminLayout /></ProtectedRoutes>} >
            <Route index element={<Navigate to="/login" />} replace />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
             <Route path="/reports" element={<Report />} />
            <Route path="/associates" element={<Associates />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all: redirect unknown routes to login */}
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
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
