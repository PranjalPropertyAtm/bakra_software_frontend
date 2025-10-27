import React from 'react'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Orders from './pages/Orders.jsx';
import Customers from './pages/Customers.jsx';
import Report from './pages/Reports.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route path='/' element={<ProtectedRoutes><AdminLayout /></ProtectedRoutes>} >
            <Route index element={<Navigate to="/dashboard" />} replace />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
             <Route path="/reports" element={<Report />} />
          </Route>

          {/* Catch-all: redirect unknown routes to login */}
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
