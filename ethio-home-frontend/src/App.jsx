import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/contexts/AuthContext';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute, PublicRoute } from '@/components/common/ProtectedRoute';
import { RoleDashboard } from '@/components/common/RoleDashboard';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { PropertiesPage } from '@/pages/PropertiesPage';
import { PropertyDetailPage } from '@/pages/PropertyDetailPage';
import { InterestFormPage } from '@/pages/InterestFormPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { SellerDashboardPage } from '@/pages/SellerDashboardPage';
import { AgentDashboardPage } from '@/pages/AgentDashboardPage';
import { EmployeeDashboardPage } from '@/pages/EmployeeDashboardPage';
import { Toaster } from '@/components/ui/sonner';
import './App.css';
import './lib/i18n';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                
                {/* Auth routes - redirect if already logged in */}
                <Route 
                  path="login" 
                  element={
                    <PublicRoute redirectTo="/dashboard">
                      <LoginPage />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="signup" 
                  element={
                    <PublicRoute redirectTo="/dashboard">
                      <SignupPage />
                    </PublicRoute>
                  } 
                />

                {/* Protected routes - Role-based dashboards */}
                <Route 
                  path="dashboard" 
                  element={
                    <ProtectedRoute>
                      <RoleDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Seller routes */}
                <Route 
                  path="seller/*" 
                  element={
                    <ProtectedRoute allowedRoles={['seller']}>
                      <SellerDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Agent routes */}
                <Route 
                  path="agent/*" 
                  element={
                    <ProtectedRoute allowedRoles={['agent']}>
                      <AgentDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Employee routes */}
                <Route 
                  path="employee/*" 
                  element={
                    <ProtectedRoute allowedRoles={['employee']}>
                      <EmployeeDashboardPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Properties routes */}
                <Route 
                  path="properties" 
                  element={
                    <PropertiesPage />
                  } 
                />
                
                <Route 
                  path="properties/:id" 
                  element={
                    <PropertyDetailPage />
                  } 
                />
                
                <Route 
                  path="properties/:id/interest" 
                  element={
                    <InterestFormPage />
                  } 
                />

                {/* Admin routes */}
                <Route 
                  path="admin/*" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'employee']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Employee routes */}
                <Route 
                  path="employee/*" 
                  element={
                    <ProtectedRoute requiredRoles={['employee', 'admin']}>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
                        <p>Employee features will be implemented here.</p>
                      </div>
                    </ProtectedRoute>
                  } 
                />

                {/* Seller routes */}
                <Route 
                  path="seller/*" 
                  element={
                    <ProtectedRoute requiredRoles={['seller', 'admin']}>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                        <p>Seller features will be implemented here.</p>
                      </div>
                    </ProtectedRoute>
                  } 
                />

                {/* Agent routes */}
                <Route 
                  path="agent/*" 
                  element={
                    <ProtectedRoute requiredRoles={['agent', 'admin']}>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold">Agent Dashboard</h1>
                        <p>Agent features will be implemented here.</p>
                      </div>
                    </ProtectedRoute>
                  } 
                />

                {/* Profile routes */}
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute>
                      <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p>Profile management will be implemented here.</p>
                      </div>
                    </ProtectedRoute>
                  } 
                />

                {/* 404 route */}
                <Route 
                  path="*" 
                  element={
                    <div className="container mx-auto px-4 py-8 text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Page not found</p>
                      <a href="/" className="text-primary hover:underline">
                        Go back home
                      </a>
                    </div>
                  } 
                />
              </Route>
            </Routes>
          </div>
          <Toaster />
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;

