import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review';
import { Review, ApiResponse } from '@/types';

// Query keys
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: any) => [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...reviewKeys.all, 'property', propertyId] as const,
  byUser: (userId: string) => [...reviewKeys.all, 'user', userId] as const,
  stats: (propertyId: string) => [...reviewKeys.all, 'stats', propertyId] as const,
};

// Hook for fetching reviews
export const useReviews = (filters: any = {}) => {
  return useQuery({
    queryKey: reviewKeys.list(filters),
    queryFn: () => reviewService.getReviews(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ApiResponse<Review[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          reviews: data.data,
          total: data.results || data.data.length,
        };
      }
      const reviews = (data.data as any)?.data || data.data || [];
      return {
        reviews: Array.isArray(reviews) ? reviews : [],
        total: data.results || reviews.length,
      };
    },
  });
};

// Hook for single review
export const useReview = (id: string) => {
  return useQuery({
    queryKey: reviewKeys.detail(id),
    queryFn: () => reviewService.getReview(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: ApiResponse<Review>) => {
      return (data.data as any)?.data || data.data;
    },
  });
};

// Hook for reviews by property
export const useReviewsByProperty = (propertyId: string) => {
  return useQuery({
    queryKey: reviewKeys.byProperty(propertyId),
    queryFn: () => reviewService.getReviewsByProperty(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
    select: (data: ApiResponse<Review[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          reviews: data.data,
          total: data.results || data.data.length,
        };
      }
      const reviews = (data.data as any)?.data || data.data || [];
      return {
        reviews: Array.isArray(reviews) ? reviews : [],
        total: data.results || reviews.length,
      };
    },
  });
};

// Hook for reviews by user
export const useReviewsByUser = (userId: string) => {
  return useQuery({
    queryKey: reviewKeys.byUser(userId),
    queryFn: () => reviewService.getReviewsByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    select: (data: ApiResponse<Review[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          reviews: data.data,
          total: data.results || data.data.length,
        };
      }
      const reviews = (data.data as any)?.data || data.data || [];
      return {
        reviews: Array.isArray(reviews) ? reviews : [],
        total: data.results || reviews.length,
      };
    },
  });
};

// Hook for review statistics
export const useReviewStats = (propertyId: string) => {
  return useQuery({
    queryKey: reviewKeys.stats(propertyId),
    queryFn: () => reviewService.getReviewStats(propertyId),
    enabled: !!propertyId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: any) => {
      return data.data || data;
    },
  });
};

// Mutation hooks
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: (data, variables) => {
      // Invalidate reviews lists
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      
      // Invalidate property-specific reviews
      if (variables.propertyId) {
        queryClient.invalidateQueries({ 
          queryKey: reviewKeys.byProperty(variables.propertyId) 
        });
        queryClient.invalidateQueries({ 
          queryKey: reviewKeys.stats(variables.propertyId) 
        });
      }
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      reviewService.updateReview(id, data),
    onSuccess: (data, variables) => {
      // Update the specific review in cache
      queryClient.setQueryData(
        reviewKeys.detail(variables.id),
        (oldData: any) => ({
          ...oldData,
          data: data.data,
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: (_, reviewId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: reviewKeys.detail(reviewId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

export const useReportReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      reviewService.reportReview(id, reason),
    onSuccess: (data, variables) => {
      // Update the specific review in cache
      queryClient.setQueryData(
        reviewKeys.detail(variables.id),
        (oldData: any) => ({
          ...oldData,
          data: { ...oldData?.data, status: 'flagged' },
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, helpful }: { id: string; helpful: boolean }) => 
      reviewService.markReviewHelpful(id, helpful),
    onSuccess: (data, variables) => {
      // Update the specific review in cache
      queryClient.setQueryData(
        reviewKeys.detail(variables.id),
        (oldData: any) => ({
          ...oldData,
          data: { 
            ...oldData?.data, 
            helpfulCount: variables.helpful 
              ? (oldData?.data?.helpfulCount || 0) + 1
              : Math.max((oldData?.data?.helpfulCount || 0) - 1, 0)
          },
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

export const useRespondToReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) => 
      reviewService.respondToReview(id, response),
    onSuccess: (data, variables) => {
      // Update the specific review in cache
      queryClient.setQueryData(
        reviewKeys.detail(variables.id),
        (oldData: any) => ({
          ...oldData,
          data: { 
            ...oldData?.data, 
            ownerResponse: variables.response,
            ownerResponseDate: new Date().toISOString()
          },
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
    },
  });
};

