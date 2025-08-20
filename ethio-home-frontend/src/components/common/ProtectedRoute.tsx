import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  redirectTo = '/login',
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage message="Checking authentication..." />;
  }

  if (!isAuthenticated || !user) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    // Redirect to unauthorized page or dashboard based on role
    const dashboardRoutes: Record<string, string> = {
      admin: '/admin',
      employee: '/employee',
      seller: '/seller',
      agent: '/agent',
      buyer: '/dashboard',
    };

    const userDashboard = dashboardRoutes[user.role] || '/dashboard';
    return <Navigate to={userDashboard} replace />;
  }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  if (isAuthenticated && user && redirectTo) {
    // Redirect authenticated users away from public routes like login/signup
    const dashboardRoutes: Record<string, string> = {
      admin: '/admin',
      employee: '/employee',
      seller: '/seller',
      agent: '/agent',
      buyer: '/dashboard',
    };

    const userDashboard = dashboardRoutes[user.role] || redirectTo;
    return <Navigate to={userDashboard} replace />;
  }

  return <>{children}</>;
};

