import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyManagement } from '@/components/property/PropertyManagement';
import { InterestManagement } from '@/components/interest/InterestManagement';
import { ReviewManagement } from '@/components/review/ReviewManagement';
import { 
  Home, 
  Plus, 
  Eye, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  Briefcase,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/property';
import { interestService } from '@/services/interest';
import { reviewService } from '@/services/review';
import { toast } from 'sonner';

export const AgentDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch agent's properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['agent-properties', user?.id],
    queryFn: () => propertyService.getMyProperties(),
    enabled: !!user
  });

  // Fetch interests for agent's properties
  const { data: interests = [], isLoading: interestsLoading } = useQuery({
    queryKey: ['agent-interests', user?.id],
    queryFn: () => interestService.getMyInterests(),
    enabled: !!user
  });

  // Fetch reviews for agent's properties
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['agent-reviews', user?.id],
    queryFn: () => reviewService.getMyReviews(),
    enabled: !!user
  });

  // Calculate dashboard stats
  const dashboardStats = {
    totalProperties: properties.length,
    activeListings: properties.filter(p => p.status === 'active').length,
    pendingApproval: properties.filter(p => p.status === 'pending_approval').length,
    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
    totalInterests: interests.length,
    newInterests: interests.filter(i => i.status === 'new').length,
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0',
    monthlyCommission: 0, // This would come from payment/commission data
    clientsServed: interests.filter(i => i.status === 'closed').length
  };

  const recentActivities = [
    ...interests.slice(0, 3).map(interest => ({
      id: interest.id,
      type: 'interest',
      message: `New client inquiry for "${interest.property?.title}"`,
      time: new Date(interest.createdAt).toLocaleDateString(),
      status: 'new'
    })),
    ...reviews.slice(0, 2).map(review => ({
      id: review.id,
      type: 'review',
      message: `Client left ${review.rating}-star review for "${review.property?.title}"`,
      time: new Date(review.createdAt).toLocaleDateString(),
      status: review.rating >= 4 ? 'positive' : 'neutral'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const handlePropertyEdit = (property: any) => {
    navigate(`/properties/${property.id}/edit`);
  };

  const handlePropertyDelete = async (propertyId: string) => {
    try {
      await propertyService.deleteProperty(propertyId);
      toast.success('Property deleted successfully');
      // Refetch properties
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handlePropertyView = (property: any) => {
    navigate(`/properties/${property.id}`);
  };

  const handleInterestReply = async (interestId: string, message: string) => {
    try {
      await interestService.replyToInterest(interestId, message);
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const handleInterestMarkAsRead = async (interestId: string) => {
    try {
      await interestService.markAsRead(interestId);
    } catch (error) {
      console.error('Failed to mark interest as read');
    }
  };

  const handleInterestArchive = async (interestId: string) => {
    try {
      await interestService.archiveInterest(interestId);
      toast.success('Interest archived');
    } catch (error) {
      toast.error('Failed to archive interest');
    }
  };

  const handleReviewReply = async (reviewId: string, response: string) => {
    try {
      await reviewService.replyToReview(reviewId, response);
      toast.success('Response sent successfully');
    } catch (error) {
      toast.error('Failed to send response');
    }
  };

  const handleReviewFlag = async (reviewId: string, reason: string) => {
    try {
      await reviewService.flagReview(reviewId, reason);
      toast.success('Review flagged for moderation');
    } catch (error) {
      toast.error('Failed to flag review');
    }
  };

  const handleReviewMarkHelpful = async (reviewId: string, helpful: boolean) => {
    try {
      await reviewService.markHelpful(reviewId, helpful);
    } catch (error) {
      console.error('Failed to mark review as helpful');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage client properties, track leads, and grow your real estate business.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="interests">Leads</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Listings</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeListings}</p>
                    </div>
                    <Home className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-600 font-medium">{dashboardStats.totalProperties} total</span>
                    <span className="text-gray-500 ml-2">• {dashboardStats.pendingApproval} pending</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">New Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.newInterests}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-blue-600 font-medium">{dashboardStats.totalInterests} total leads</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Clients Served</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.clientsServed}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+8%</span>
                    <span className="text-gray-500 ml-1">this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.averageRating}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-600">{dashboardStats.totalReviews} reviews</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for real estate agents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => navigate('/properties/create')}
                    className="flex items-center gap-2 h-auto p-4"
                  >
                    <Plus className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">List New Property</div>
                      <div className="text-sm opacity-90">Add a client's property to the market</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('interests')}
                    className="flex items-center gap-2 h-auto p-4"
                  >
                    <Target className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Manage Leads</div>
                      <div className="text-sm opacity-70">Follow up with potential clients</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                    className="flex items-center gap-2 h-auto p-4"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">View Performance</div>
                      <div className="text-sm opacity-70">Track your sales metrics</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your listings and clients</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'interest' ? 'bg-blue-100 text-blue-600' :
                          activity.status === 'positive' ? 'bg-green-100 text-green-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {activity.type === 'interest' ? <Target className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        {activity.status === 'new' && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <PropertyManagement
              properties={properties}
              onEdit={handlePropertyEdit}
              onDelete={handlePropertyDelete}
              onView={handlePropertyView}
              isLoading={propertiesLoading}
            />
          </TabsContent>

          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <CardTitle>Client Management</CardTitle>
                <CardDescription>Manage your client relationships and communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Management Coming Soon</h3>
                  <p className="text-gray-600">
                    Advanced client management features will be available here to help you track and nurture your client relationships.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interests">
            <InterestManagement
              interests={interests}
              onReply={handleInterestReply}
              onMarkAsRead={handleInterestMarkAsRead}
              onArchive={handleInterestArchive}
              isLoading={interestsLoading}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewManagement
              reviews={reviews}
              onReply={handleReviewReply}
              onFlag={handleReviewFlag}
              onMarkHelpful={handleReviewMarkHelpful}
              isLoading={reviewsLoading}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track your real estate business performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-600">
                      Detailed analytics including commission tracking, lead conversion rates, and market insights will be available here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

