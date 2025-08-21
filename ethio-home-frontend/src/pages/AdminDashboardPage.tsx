import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { PropertyVerification } from '@/components/admin/PropertyVerification';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'; // Import the new component
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  Star,
  MessageCircle,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminTab = 'dashboard' | 'users' | 'properties' | 'reviews' | 'interests' | 'analytics' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'properties', label: 'Property Verification', icon: Building },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    // ... other items
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'properties':
        return <PropertyVerification />;
      case 'analytics':
        return <AnalyticsDashboard />; // Render the new component
      // ... other cases
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
          </div>
          <nav className="px-4 pb-4">
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as AdminTab)}
                    className={cn(
                      'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      activeTab === item.id
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
