import React from 'react'     
import {BrowserRouter, Navigate, Routes,Route} from "react-router-dom";
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoutes from './utils/ProtectedRoutes.jsx';


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/dashboard" replace />} />
        <Route path='/login' element={<Login/>} />
         <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
