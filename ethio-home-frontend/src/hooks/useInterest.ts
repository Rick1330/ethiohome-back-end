import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interestService } from '@/services/interest';
import { InterestForm, ApiResponse } from '@/types';

// Query keys
export const interestKeys = {
  all: ['interests'] as const,
  lists: () => [...interestKeys.all, 'list'] as const,
  list: (filters: any) => [...interestKeys.lists(), filters] as const,
  details: () => [...interestKeys.all, 'detail'] as const,
  detail: (id: string) => [...interestKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...interestKeys.all, 'property', propertyId] as const,
  byUser: (userId: string) => [...interestKeys.all, 'user', userId] as const,
};

// Hook for fetching interests (admin/employee use)
export const useInterests = (filters: any = {}) => {
  return useQuery({
    queryKey: interestKeys.list(filters),
    queryFn: () => interestService.getInterests(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ApiResponse<InterestForm[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          interests: data.data,
          total: data.results || data.data.length,
        };
      }
      const interests = (data.data as any)?.data || data.data || [];
      return {
        interests: Array.isArray(interests) ? interests : [],
        total: data.results || interests.length,
      };
    },
  });
};

// Hook for single interest
export const useInterest = (id: string) => {
  return useQuery({
    queryKey: interestKeys.detail(id),
    queryFn: () => interestService.getInterest(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: ApiResponse<InterestForm>) => {
      return (data.data as any)?.data || data.data;
    },
  });
};

// Hook for interests by property (property owner use)
export const useInterestsByProperty = (propertyId: string) => {
  return useQuery({
    queryKey: interestKeys.byProperty(propertyId),
    queryFn: () => interestService.getInterestsByProperty(propertyId),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
    select: (data: ApiResponse<InterestForm[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          interests: data.data,
          total: data.results || data.data.length,
        };
      }
      const interests = (data.data as any)?.data || data.data || [];
      return {
        interests: Array.isArray(interests) ? interests : [],
        total: data.results || interests.length,
      };
    },
  });
};

// Hook for interests by user
export const useInterestsByUser = (userId: string) => {
  return useQuery({
    queryKey: interestKeys.byUser(userId),
    queryFn: () => interestService.getInterestsByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    select: (data: ApiResponse<InterestForm[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          interests: data.data,
          total: data.results || data.data.length,
        };
      }
      const interests = (data.data as any)?.data || data.data || [];
      return {
        interests: Array.isArray(interests) ? interests : [],
        total: data.results || interests.length,
      };
    },
  });
};

// Mutation hooks
export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: interestService.createInterest,
    onSuccess: (data, variables) => {
      // Invalidate interests lists
      queryClient.invalidateQueries({ queryKey: interestKeys.lists() });
      
      // Invalidate property-specific interests
      if (variables.propertyId) {
        queryClient.invalidateQueries({ 
          queryKey: interestKeys.byProperty(variables.propertyId) 
        });
      }
    },
  });
};

export const useUpdateInterest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      interestService.updateInterest(id, data),
    onSuccess: (data, variables) => {
      // Update the specific interest in cache
      queryClient.setQueryData(
        interestKeys.detail(variables.id),
        (oldData: any) => ({
          ...oldData,
          data: data.data,
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: interestKeys.lists() });
    },
  });
};

export const useDeleteInterest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: interestService.deleteInterest,
    onSuccess: (_, interestId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: interestKeys.detail(interestId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: interestKeys.lists() });
    },
  });
};

export const useRespondToInterest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, response }: { id: string; response: string }) => 
      interestService.respondToInterest(id, response),
    onSuccess: (data, variables) => {
      // Update the specific interest in cache
      queryClient.setQueryData(
        interestKeys.detail(variables.id),
        (oldData: any) => ({
          ...oldData,
          data: { ...oldData?.data, response: variables.response, status: 'responded' },
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: interestKeys.lists() });
    },
  });
};

