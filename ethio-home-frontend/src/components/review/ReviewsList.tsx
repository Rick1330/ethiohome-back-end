import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Review } from '@/types';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Filter,
  SortAsc,
  MessageCircle,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onReport?: (reviewId: string) => void;
  onHelpful?: (reviewId: string, helpful: boolean) => void;
  className?: string;
  showFilters?: boolean;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  isLoading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  onReport,
  onHelpful,
  className,
  showFilters = true,
}) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterBy, setFilterBy] = useState<string>('all');

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 
      ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 
      : 0,
  }));

  const recommendationCount = reviews.filter(review => review.wouldRecommend).length;
  const recommendationPercentage = totalReviews > 0 
    ? (recommendationCount / totalReviews) * 100 
    : 0;

  // Filter and sort reviews
  const filteredAndSortedReviews = React.useMemo(() => {
    let filtered = [...reviews];

    // Apply filters
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'verified':
          filtered = filtered.filter(review => review.isVerified);
          break;
        case 'recommended':
          filtered = filtered.filter(review => review.wouldRecommend);
          break;
        case 'visited':
          filtered = filtered.filter(review => review.visitedProperty);
          break;
        case '5-star':
          filtered = filtered.filter(review => review.rating === 5);
          break;
        case '4-star':
          filtered = filtered.filter(review => review.rating === 4);
          break;
        case '3-star':
          filtered = filtered.filter(review => review.rating === 3);
          break;
        case '2-star':
          filtered = filtered.filter(review => review.rating === 2);
          break;
        case '1-star':
          filtered = filtered.filter(review => review.rating === 1);
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'highest-rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest-rating':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'most-helpful':
        filtered.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
        break;
    }

    return filtered;
  }, [reviews, sortBy, filterBy]);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to Load Reviews
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          {error || 'Something went wrong while loading reviews. Please try again.'}
        </p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          Be the first to review this property and help other users make informed decisions.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Review Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2" />
            Review Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), 'lg')}
              <p className="text-sm text-gray-600 mt-2">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-6">{rating}</span>
                  {renderStars(rating, 'sm')}
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation Rate */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {recommendationPercentage.toFixed(0)}%
                </div>
                <p className="text-sm text-gray-600">Would Recommend</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="visited">Visited Property</SelectItem>
                  <SelectItem value="5-star">5 Star</SelectItem>
                  <SelectItem value="4-star">4 Star</SelectItem>
                  <SelectItem value="3-star">3 Star</SelectItem>
                  <SelectItem value="2-star">2 Star</SelectItem>
                  <SelectItem value="1-star">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="highest-rating">Highest Rating</SelectItem>
                  <SelectItem value="lowest-rating">Lowest Rating</SelectItem>
                  <SelectItem value="most-helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredAndSortedReviews.length} of {totalReviews} reviews
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            onReport={onReport}
            onHelpful={onHelpful}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            size="lg"
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
                Loading More...
              </>
            ) : (
              'Load More Reviews'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

