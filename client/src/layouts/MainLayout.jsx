import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { MobileNav } from '../components/MobileNav';
import { useAuth } from '../context/AuthContext';

export const MainLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(16, 185, 129, 0.2)',
          borderTopColor: '#10b981',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading Pulse Fitness...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
};
