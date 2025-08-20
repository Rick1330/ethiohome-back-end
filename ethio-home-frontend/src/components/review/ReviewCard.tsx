import React from 'react';
import { useTranslation } from 'react-i18next';
import { Review } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle,
  AlertCircle,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { formatDate, getInitials } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
  className?: string;
  showActions?: boolean;
  onReport?: (reviewId: string) => void;
  onHelpful?: (reviewId: string, helpful: boolean) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  className,
  showActions = true,
  onReport,
  onHelpful,
}) => {
  const { t } = useTranslation();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-4 w-4',
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating}.0</span>
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return 'Excellent';
      case 4: return 'Very Good';
      case 3: return 'Good';
      case 2: return 'Fair';
      case 1: return 'Poor';
      default: return '';
    }
  };

  const handleReport = () => {
    onReport?.(review._id);
  };

  const handleHelpful = (helpful: boolean) => {
    onHelpful?.(review._id, helpful);
  };

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.reviewer?.photo} alt={review.reviewer.name} />
                <AvatarFallback>{getInitials(review.reviewer.name)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{review.reviewer.name}</p>
                  {review.reviewer.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{formatDate(review.createdAt)}</span>
                  {review.visitedProperty && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Visited Property
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {renderStars(review.rating)}
              {showActions && (
                <Button variant="ghost" size="sm" onClick={handleReport}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <h3 className="font-semibold text-lg mb-1">{review.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {getRatingText(review.rating)}
              </Badge>
              {review.wouldRecommend ? (
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Recommends
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  Doesn't Recommend
                </Badge>
              )}
            </div>
          </div>

          {/* Review Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {review.comment}
            </p>
          </div>

          {/* Owner Response */}
          {review.ownerResponse && (
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary">
              <div className="flex items-center mb-2">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={review.property?.owner?.photo} alt="Owner" />
                  <AvatarFallback className="text-xs">
                    {getInitials(review.property?.owner?.name || 'Owner')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Property Owner Response</span>
                <span className="text-xs text-gray-500 ml-2">
                  {formatDate(review.ownerResponseDate!)}
                </span>
              </div>
              <p className="text-sm text-gray-700">{review.ownerResponse}</p>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpful(true)}
                    className="text-gray-600 hover:text-green-600"
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpfulCount || 0})
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpful(false)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                className="text-gray-600 hover:text-red-600"
              >
                <Flag className="h-4 w-4 mr-1" />
                Report
              </Button>
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            {review.isVerified ? (
              <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Review
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                Pending Verification
              </Badge>
            )}
            
            {review.status === 'flagged' && (
              <Badge variant="destructive" className="text-xs">
                <Flag className="w-3 h-3 mr-1" />
                Flagged
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

