import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
// in App.jsx or routes config
import AdminFieldsPage from './pages/AdminFieldsPage'
import AdminAddQuestion from './pages/AdminAddQuestion'
import FieldQuestionsPage from './pages/FieldQuestionsPage'


// student dashboard stays at /dashboard (your existing)

import './styles.css'

// Custom component to log route changes
function RouteLogger() {
  const location = useLocation();

  React.useEffect(() => {
    console.log('Current route:', location.pathname); // Log the current route
  }, [location]);

  return null; // This component doesn’t render anything
}

function App() {
  return (
    <BrowserRouter>
      <RouteLogger /> {/* Log route changes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/field/que" element={<FieldQuestionsPage />} />
        <Route path="/field/que/:fieldId" element={<FieldQuestionsPage />} />
        <Route path="/admin/add-question" element={<AdminAddQuestion />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)
