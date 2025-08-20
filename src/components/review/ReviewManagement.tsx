import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Star,
  MessageSquare,
  Calendar,
  User,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Eye,
  Filter
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ReviewManagementProps {
  reviews: Review[];
  onReply: (reviewId: string, response: string) => void;
  onFlag: (reviewId: string, reason: string) => void;
  onMarkHelpful: (reviewId: string, helpful: boolean) => void;
  isLoading?: boolean;
}

export const ReviewManagement: React.FC<ReviewManagementProps> = ({
  reviews,
  onReply,
  onFlag,
  onMarkHelpful,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    const matchesVerified = verifiedFilter === 'all' || 
      (verifiedFilter === 'verified' && review.verified) ||
      (verifiedFilter === 'unverified' && !review.verified);
    
    return matchesSearch && matchesRating && matchesVerified;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAverageRating = () => {
    if (filteredReviews.length === 0) return 0;
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / filteredReviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    filteredReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const handleReply = async () => {
    if (!selectedReview || !replyText.trim()) return;

    setIsReplying(true);
    try {
      await onReply(selectedReview.id, replyText);
      setReplyText('');
      setSelectedReview(null);
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredReviews.length}</div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{getAverageRating()}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
            <div className="mt-1">{renderStars(parseFloat(getAverageRating()))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredReviews.filter(r => r.verified).length}
            </div>
            <div className="text-sm text-gray-600">Verified Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {filteredReviews.filter(r => r.wouldRecommend).length}
            </div>
            <div className="text-sm text-gray-600">Recommendations</div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm font-medium w-8">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${filteredReviews.length > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / filteredReviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {ratingDistribution[rating as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Star className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
            <p className="text-gray-600">
              {searchTerm || ratingFilter !== 'all' || verifiedFilter !== 'all'
                ? 'No reviews match your current filters.'
                : 'You haven\'t received any reviews yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.reviewer.avatar} />
                          <AvatarFallback>
                            {review.reviewer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{review.reviewer.name}</h3>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.wouldRecommend && (
                          <Badge variant="outline" className="text-xs">
                            Recommends
                          </Badge>
                        )}
                      </div>
                    </div>

                    {review.property && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="font-medium">{review.property.title}</span>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                    </div>

                    {review.ownerResponse && (
                      <div className="bg-blue-50 border-l-4 border-blue-200 p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Reply className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Owner Response</span>
                        </div>
                        <p className="text-sm text-blue-800">{review.ownerResponse}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{review.helpfulCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReview(review)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {!review.ownerResponse && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReview(review)}
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onFlag(review.id, 'inappropriate')}
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          Flag
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Details Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Review Details
            </DialogTitle>
            <DialogDescription>
              View and respond to this review
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* Reviewer Information */}
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedReview.reviewer.avatar} />
                  <AvatarFallback>
                    {selectedReview.reviewer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{selectedReview.reviewer.name}</h3>
                    {selectedReview.verified && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(selectedReview.rating, 'md')}
                    <span className="text-sm text-gray-600">
                      {formatDate(selectedReview.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Information */}
              {selectedReview.property && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedReview.property.title}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{selectedReview.property.location?.address}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Content */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Review</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedReview.title}</h4>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedReview.comment}</p>
                  </div>
                  {selectedReview.wouldRecommend && (
                    <div className="flex items-center gap-2 text-green-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm font-medium">Recommends this property</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Owner Response */}
              {selectedReview.ownerResponse && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Response</h3>
                  <div className="bg-blue-50 border-l-4 border-blue-200 p-4">
                    <p className="text-blue-800">{selectedReview.ownerResponse}</p>
                  </div>
                </div>
              )}

              {/* Reply Section */}
              {!selectedReview.ownerResponse && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Respond to Review</h3>
                  <Textarea
                    placeholder="Write your response to this review..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your response will be visible to all users viewing this review.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => selectedReview && onFlag(selectedReview.id, 'inappropriate')}
            >
              <Flag className="h-4 w-4 mr-1" />
              Flag Review
            </Button>
            {selectedReview && !selectedReview.ownerResponse && (
              <Button
                onClick={handleReply}
                disabled={!replyText.trim() || isReplying}
              >
                <Reply className="h-4 w-4 mr-1" />
                {isReplying ? 'Sending...' : 'Send Response'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

