import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/property';
import { Property, PropertyFilters, ApiResponse } from '@/types';

// Query keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: PropertyFilters) => [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  stats: () => [...propertyKeys.all, 'stats'] as const,
  byOwner: (ownerId: string) => [...propertyKeys.all, 'owner', ownerId] as const,
};

// Hook for fetching properties with filters
export const useProperties = (filters: PropertyFilters = {}) => {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertyService.getProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: ApiResponse<Property[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          properties: data.data,
          total: data.results || data.data.length,
        };
      }
      // Handle case where data is nested
      const properties = (data.data as any)?.data || data.data || [];
      return {
        properties: Array.isArray(properties) ? properties : [],
        total: data.results || properties.length,
      };
    },
  });
};

// Hook for infinite scroll properties
export const useInfiniteProperties = (filters: PropertyFilters = {}) => {
  return useInfiniteQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => 
      propertyService.getProperties({ ...filters, page: pageParam, limit: 12 }),
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalResults = lastPage.results || 0;
      const hasMore = currentPage * 12 < totalResults;
      return hasMore ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      const pages = data.pages.map(page => {
        if (page.data && Array.isArray(page.data)) {
          return page.data;
        }
        return (page.data as any)?.data || page.data || [];
      });
      
      const properties = pages.flat();
      const total = data.pages[0]?.results || 0;
      
      return {
        properties,
        total,
        hasNextPage: data.hasNextPage,
        isFetchingNextPage: data.isFetchingNextPage,
      };
    },
  });
};

// Hook for single property
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertyService.getProperty(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: ApiResponse<Property>) => {
      return (data.data as any)?.data || data.data;
    },
  });
};

// Hook for property statistics
export const usePropertyStats = () => {
  return useQuery({
    queryKey: propertyKeys.stats(),
    queryFn: () => propertyService.getPropertyStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook for properties by owner
export const usePropertiesByOwner = (ownerId: string, filters: PropertyFilters = {}) => {
  return useQuery({
    queryKey: propertyKeys.byOwner(ownerId),
    queryFn: () => propertyService.getPropertiesByOwner(ownerId, filters),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000,
    select: (data: ApiResponse<Property[]>) => {
      if (data.data && Array.isArray(data.data)) {
        return {
          properties: data.data,
          total: data.results || data.data.length,
        };
      }
      const properties = (data.data as any)?.data || data.data || [];
      return {
        properties: Array.isArray(properties) ? properties : [],
        total: data.results || properties.length,
      };
    },
  });
};

// Mutation hooks
export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: () => {
      // Invalidate and refetch properties
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      propertyService.updateProperty(id, data),
    onSuccess: (data, variables) => {
      // Update the specific property in cache
      queryClient.setQueryData(
        propertyKeys.detail(variables.id),
        (oldData: any) => ({
          ...oldData,
          data: data.data,
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: (_, propertyId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(propertyId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};

export const useVerifyProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: propertyService.verifyProperty,
    onSuccess: (data, propertyId) => {
      // Update the specific property in cache
      queryClient.setQueryData(
        propertyKeys.detail(propertyId),
        (oldData: any) => ({
          ...oldData,
          data: { ...oldData?.data, isVerified: true },
        })
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
    },
  });
};

// Utility hook for managing favorites (client-side only)
export const useFavorites = () => {
  const getFavorites = (): string[] => {
    try {
      const favorites = localStorage.getItem('property_favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  };

  const addToFavorites = (propertyId: string) => {
    const favorites = getFavorites();
    if (!favorites.includes(propertyId)) {
      const newFavorites = [...favorites, propertyId];
      localStorage.setItem('property_favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (propertyId: string) => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(id => id !== propertyId);
    localStorage.setItem('property_favorites', JSON.stringify(newFavorites));
  };

  const toggleFavorite = (propertyId: string) => {
    const favorites = getFavorites();
    if (favorites.includes(propertyId)) {
      removeFromFavorites(propertyId);
    } else {
      addToFavorites(propertyId);
    }
  };

  const isFavorite = (propertyId: string): boolean => {
    return getFavorites().includes(propertyId);
  };

  return {
    favorites: getFavorites(),
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};

