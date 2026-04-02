import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Islam from './pages/Islam';
import Multimedia from './pages/Multimedia';
import About from './pages/About';
import Donation from './pages/Donation';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-islamic-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/islam" element={<Layout><Islam /></Layout>} />
          <Route path="/multimedia" element={<Layout><Multimedia /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/donation" element={<Layout><Donation /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
