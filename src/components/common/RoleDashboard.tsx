import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { SellerDashboardPage } from '@/pages/SellerDashboardPage';
import { AgentDashboardPage } from '@/pages/AgentDashboardPage';
import { EmployeeDashboardPage } from '@/pages/EmployeeDashboardPage';
import { HomePage } from '@/pages/HomePage';

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route users to their role-specific dashboard
  switch (user.role) {
    case 'admin':
      return <AdminDashboardPage />;
    case 'seller':
      return <SellerDashboardPage />;
    case 'agent':
      return <AgentDashboardPage />;
    case 'employee':
      return <EmployeeDashboardPage />;
    case 'buyer':
    default:
      // Buyers get the general home page as their dashboard
      return <HomePage />;
  }
};

