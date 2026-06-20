import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Fields from './pages/Fields';
import Schedules from './pages/Schedules';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import Login from './pages/Login';
import Register from './pages/Register';
import Reports from './pages/Reports.tsx';
import type { ReactNode } from 'react';

// Komponen untuk memproteksi rute agar user harus login
function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/fields" element={<ProtectedRoute><Fields /></ProtectedRoute>} />
        <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
}