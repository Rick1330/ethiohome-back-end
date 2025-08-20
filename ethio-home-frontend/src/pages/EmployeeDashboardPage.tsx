import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  Users, 
  Eye, 
  MessageSquare, 
  Star, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmployeeDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const dashboardStats = {
    pendingVerifications: 15,
    completedToday: 8,
    totalProcessed: 142,
    averageProcessingTime: '2.5 hours',
    userReports: 3,
    systemAlerts: 2
  };

  const recentTasks = [
    {
      id: 1,
      type: 'verification',
      title: 'Property Verification - Villa in Bole',
      description: 'Review documents and approve listing',
      priority: 'high',
      dueDate: '2 hours',
      status: 'pending'
    },
    {
      id: 2,
      type: 'report',
      title: 'User Report - Suspicious Activity',
      description: 'Investigate reported user behavior',
      priority: 'medium',
      dueDate: '4 hours',
      status: 'in-progress'
    },
    {
      id: 3,
      type: 'verification',
      title: 'Property Verification - Apartment in CMC',
      description: 'Document review completed',
      priority: 'low',
      dueDate: 'Completed',
      status: 'completed'
    },
    {
      id: 4,
      type: 'support',
      title: 'User Support - Payment Issue',
      description: 'Help user resolve payment problem',
      priority: 'high',
      dueDate: '1 hour',
      status: 'urgent'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'destructive';
      case 'pending': return 'default';
      case 'in-progress': return 'secondary';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {t('employeeDashboard.subtitle')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('employeeDashboard.pendingVerifications')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">
              {t('employeeDashboard.requiresAttention')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('employeeDashboard.completedToday')}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.completedToday}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalProcessed} {t('employeeDashboard.totalProcessed')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('employeeDashboard.avgProcessingTime')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.averageProcessingTime}</div>
            <p className="text-xs text-muted-foreground">
              -15% {t('employeeDashboard.fromLastWeek')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('employeeDashboard.activeAlerts')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats.userReports + dashboardStats.systemAlerts}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.userReports} {t('employeeDashboard.userReports')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">{t('employeeDashboard.tasks')}</TabsTrigger>
          <TabsTrigger value="verifications">{t('employeeDashboard.verifications')}</TabsTrigger>
          <TabsTrigger value="reports">{t('employeeDashboard.reports')}</TabsTrigger>
          <TabsTrigger value="support">{t('employeeDashboard.support')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Queue */}
            <Card>
              <CardHeader>
                <CardTitle>{t('employeeDashboard.taskQueue')}</CardTitle>
                <CardDescription>
                  {t('employeeDashboard.taskQueueDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {task.type === 'verification' && (
                            <Shield className="h-4 w-4 text-blue-500" />
                          )}
                          {task.type === 'report' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {task.type === 'support' && (
                            <MessageSquare className="h-4 w-4 text-green-500" />
                          )}
                          <h4 className="font-medium text-sm">{task.title}</h4>
                        </div>
                        <Badge variant={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">
                          Due: {task.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('employeeDashboard.quickActions')}</CardTitle>
                <CardDescription>
                  {t('employeeDashboard.quickActionsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link to="/employee/verifications">
                    <Shield className="mr-2 h-4 w-4" />
                    {t('employeeDashboard.propertyVerifications')}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/employee/reports">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {t('employeeDashboard.userReports')}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/employee/support">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('employeeDashboard.userSupport')}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/employee/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {t('employeeDashboard.viewAnalytics')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="verifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('employeeDashboard.propertyVerifications')}</CardTitle>
              <CardDescription>
                {t('employeeDashboard.propertyVerificationsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('employeeDashboard.noVerifications')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('employeeDashboard.noVerificationsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>{t('employeeDashboard.userReports')}</CardTitle>
              <CardDescription>
                {t('employeeDashboard.userReportsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('employeeDashboard.noReports')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('employeeDashboard.noReportsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>{t('employeeDashboard.userSupport')}</CardTitle>
              <CardDescription>
                {t('employeeDashboard.userSupportDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('employeeDashboard.noSupportTickets')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('employeeDashboard.noSupportTicketsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

