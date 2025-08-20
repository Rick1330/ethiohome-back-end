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
  Settings
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/property';
import { interestService } from '@/services/interest';
import { reviewService } from '@/services/review';
import { toast } from 'sonner';

export const SellerDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch seller's properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['seller-properties', user?.id],
    queryFn: () => propertyService.getMyProperties(),
    enabled: !!user
  });

  // Fetch interests for seller's properties
  const { data: interests = [], isLoading: interestsLoading } = useQuery({
    queryKey: ['seller-interests', user?.id],
    queryFn: () => interestService.getMyInterests(),
    enabled: !!user
  });

  // Fetch reviews for seller's properties
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['seller-reviews', user?.id],
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
    monthlyRevenue: 0 // This would come from payment data
  };

  const recentActivities = [
    ...interests.slice(0, 3).map(interest => ({
      id: interest.id,
      type: 'interest',
      message: `New interest received for "${interest.property?.title}"`,
      time: new Date(interest.createdAt).toLocaleDateString(),
      status: 'new'
    })),
    ...reviews.slice(0, 2).map(review => ({
      id: review.id,
      type: 'review',
      message: `New ${review.rating}-star review for "${review.property?.title}"`,
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
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your properties, track interests, and grow your business.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
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
                      <p className="text-sm font-medium text-gray-600">Total Properties</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProperties}</p>
                    </div>
                    <Home className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-600 font-medium">{dashboardStats.activeListings} active</span>
                    <span className="text-gray-500 ml-2">• {dashboardStats.pendingApproval} pending</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalViews}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">+12%</span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Interests</p>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalInterests}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-purple-600 font-medium">{dashboardStats.newInterests} new</span>
                    <span className="text-gray-500 ml-2">this week</span>
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
                <CardDescription>Common tasks to manage your properties</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => navigate('/properties/create')}
                    className="flex items-center gap-2 h-auto p-4"
                  >
                    <Plus className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Add New Property</div>
                      <div className="text-sm opacity-90">List a new property for sale or rent</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('interests')}
                    className="flex items-center gap-2 h-auto p-4"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">View Interests</div>
                      <div className="text-sm opacity-70">Check new inquiries from buyers</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('analytics')}
                    className="flex items-center gap-2 h-auto p-4"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">View Analytics</div>
                      <div className="text-sm opacity-70">Track your performance metrics</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your properties</CardDescription>
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
                          {activity.type === 'interest' ? <Users className="h-4 w-4" /> : <Star className="h-4 w-4" />}
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
                  <CardDescription>Track your property performance and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-600">
                      Detailed analytics and insights will be available here to help you optimize your property listings.
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
    },
    {
      id: 3,
      type: 'property',
      message: 'Property "Family House in Kazanchis" approved',
      time: '1 day ago',
      status: 'approved'
    },
    {
      id: 4,
      type: 'view',
      message: '15 new views on "Commercial Space in Merkato"',
      time: '2 days ago',
      status: 'info'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {t('sellerDashboard.subtitle')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sellerDashboard.totalProperties')}
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.activeListings} {t('sellerDashboard.active')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sellerDashboard.totalViews')}
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% {t('sellerDashboard.fromLastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sellerDashboard.totalInterests')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalInterests}</div>
            <p className="text-xs text-muted-foreground">
              5 {t('sellerDashboard.thisWeek')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('sellerDashboard.averageRating')}
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.averageRating}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalReviews} {t('sellerDashboard.reviews')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('sellerDashboard.overview')}</TabsTrigger>
          <TabsTrigger value="properties">{t('sellerDashboard.properties')}</TabsTrigger>
          <TabsTrigger value="interests">{t('sellerDashboard.interests')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('sellerDashboard.reviews')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('sellerDashboard.quickActions')}</CardTitle>
                <CardDescription>
                  {t('sellerDashboard.quickActionsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link to="/seller/properties/new">
                    <Plus className="mr-2 h-4 w-4" />
                    {t('sellerDashboard.addNewProperty')}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/seller/properties">
                    <Home className="mr-2 h-4 w-4" />
                    {t('sellerDashboard.manageProperties')}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/seller/interests">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t('sellerDashboard.viewInterests')}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{t('sellerDashboard.recentActivity')}</CardTitle>
                <CardDescription>
                  {t('sellerDashboard.recentActivityDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.type === 'interest' && (
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                        )}
                        {activity.type === 'review' && (
                          <Star className="h-5 w-5 text-yellow-500" />
                        )}
                        {activity.type === 'property' && (
                          <Home className="h-5 w-5 text-green-500" />
                        )}
                        {activity.type === 'view' && (
                          <Eye className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <Badge 
                        variant={
                          activity.status === 'new' ? 'default' :
                          activity.status === 'positive' ? 'secondary' :
                          activity.status === 'approved' ? 'secondary' : 'outline'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>{t('sellerDashboard.myProperties')}</CardTitle>
              <CardDescription>
                {t('sellerDashboard.myPropertiesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Home className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('sellerDashboard.noProperties')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('sellerDashboard.noPropertiesDesc')}
                </p>
                <div className="mt-6">
                  <Button asChild>
                    <Link to="/seller/properties/new">
                      <Plus className="mr-2 h-4 w-4" />
                      {t('sellerDashboard.addFirstProperty')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests">
          <Card>
            <CardHeader>
              <CardTitle>{t('sellerDashboard.interestSubmissions')}</CardTitle>
              <CardDescription>
                {t('sellerDashboard.interestSubmissionsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('sellerDashboard.noInterests')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('sellerDashboard.noInterestsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>{t('sellerDashboard.propertyReviews')}</CardTitle>
              <CardDescription>
                {t('sellerDashboard.propertyReviewsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {t('sellerDashboard.noReviews')}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t('sellerDashboard.noReviewsDesc')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

