import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  User, 
  MessageCircle, 
  CheckCircle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5, 'Rating cannot exceed 5 stars'),
  title: z.string().min(5, 'Review title must be at least 5 characters'),
  comment: z.string().min(20, 'Review comment must be at least 20 characters'),
  reviewerName: z.string().min(2, 'Name must be at least 2 characters'),
  wouldRecommend: z.boolean(),
  visitedProperty: z.boolean(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  property: Property;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  property,
  onSubmit,
  isLoading = false,
  className,
}) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      wouldRecommend: true,
      visitedProperty: false,
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: ReviewFormData) => {
    try {
      await onSubmit(data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleStarClick = (rating: number) => {
    setValue('rating', rating, { shouldValidate: true });
  };

  if (isSubmitted) {
    return (
      <Card className={cn('max-w-2xl mx-auto', className)}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Review Submitted Successfully!
            </h2>
            <p className="text-gray-600">
              Thank you for your review. It will help other users make informed decisions.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your review will be moderated within 24 hours</li>
              <li>• Once approved, it will be visible to other users</li>
              <li>• You'll receive an email confirmation</li>
              <li>• The property owner may respond to your review</li>
            </ul>
          </div>

          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Write Another Review
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Property Being Reviewed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <img
                    src={property.images?.[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                    }}
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={property.status === 'for-sale' ? 'default' : 'secondary'}>
                      {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                    </Badge>
                    {property.isVerified && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(property.price, property.currency)}
                    {property.status === 'for-rent' && (
                      <span className="text-sm text-gray-600 font-normal">/month</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <strong>Owner:</strong> {property.owner.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Write a Review</CardTitle>
              <p className="text-gray-600">
                Share your experience with this property to help other users
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Overall Rating *</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="focus:outline-none"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => handleStarClick(star)}
                      >
                        <Star
                          className={cn(
                            'h-8 w-8 transition-colors',
                            (hoveredRating >= star || watchedValues.rating >= star)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {watchedValues.rating > 0 && (
                        <>
                          {watchedValues.rating} star{watchedValues.rating !== 1 ? 's' : ''}
                          {watchedValues.rating === 5 && ' - Excellent!'}
                          {watchedValues.rating === 4 && ' - Very Good'}
                          {watchedValues.rating === 3 && ' - Good'}
                          {watchedValues.rating === 2 && ' - Fair'}
                          {watchedValues.rating === 1 && ' - Poor'}
                        </>
                      )}
                    </span>
                  </div>
                  {errors.rating && (
                    <p className="text-sm text-red-500">{errors.rating.message}</p>
                  )}
                </div>

                {/* Review Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Review Title *</Label>
                  <Input
                    id="title"
                    placeholder="Summarize your experience in a few words"
                    {...register('title')}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                {/* Reviewer Name */}
                <div className="space-y-2">
                  <Label htmlFor="reviewerName" className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Your Name *
                  </Label>
                  <Input
                    id="reviewerName"
                    placeholder="Enter your name"
                    {...register('reviewerName')}
                    className={errors.reviewerName ? 'border-red-500' : ''}
                  />
                  {errors.reviewerName && (
                    <p className="text-sm text-red-500">{errors.reviewerName.message}</p>
                  )}
                </div>

                {/* Review Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment" className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Your Review *
                  </Label>
                  <Textarea
                    id="comment"
                    placeholder="Share your detailed experience with this property. What did you like or dislike? How was the location, condition, and overall value?"
                    rows={6}
                    {...register('comment')}
                    className={errors.comment ? 'border-red-500' : ''}
                  />
                  {errors.comment && (
                    <p className="text-sm text-red-500">{errors.comment.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Minimum 20 characters. Current: {watchedValues.comment?.length || 0}
                  </p>
                </div>

                {/* Additional Questions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Would you recommend this property?</p>
                        <p className="text-sm text-gray-600">Help others by sharing your recommendation</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={watchedValues.wouldRecommend ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setValue('wouldRecommend', true)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={!watchedValues.wouldRecommend ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => setValue('wouldRecommend', false)}
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          No
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Did you visit this property in person?</p>
                        <p className="text-sm text-gray-600">This helps others understand your review context</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={watchedValues.visitedProperty ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setValue('visitedProperty', true)}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant={!watchedValues.visitedProperty ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => setValue('visitedProperty', false)}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting Review...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Review Guidelines:</p>
                      <ul className="space-y-1">
                        <li>• Be honest and constructive in your feedback</li>
                        <li>• Focus on your actual experience with the property</li>
                        <li>• Avoid personal attacks or inappropriate language</li>
                        <li>• Reviews are moderated and may take 24 hours to appear</li>
                        <li>• You can only review properties you've inquired about</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

