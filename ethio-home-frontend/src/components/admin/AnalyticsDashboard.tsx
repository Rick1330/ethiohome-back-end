import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/property';
import { LoadingSpinner } from '@/components/ui/loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, BarChart3 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const AnalyticsDashboard: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['propertyStats'],
    queryFn: () => propertyService.getPropertyStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load analytics data: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  const { statsOfVerified, statsOfUnverified } = data?.data || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Property Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
            <CardHeader><CardTitle>Total Verified Properties</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{statsOfVerified?.reduce((sum, s) => sum + s.numProperty, 0)}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Total Unverified Properties</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{statsOfUnverified?.reduce((sum, s) => sum + s.numProperty, 0)}</p></CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Average Price (Verified)</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">ETB {statsOfVerified?.[0]?.avgPrice.toLocaleString() || 0}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Properties by Location (Verified)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsOfVerified}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="numProperty" fill="#8884d8" name="Number of Properties" />
                <Bar dataKey="avgPrice" fill="#82ca9d" name="Average Price" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Properties by Location (Unverified)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statsOfUnverified} dataKey="numProperty" nameKey="_id" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {statsOfUnverified?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
