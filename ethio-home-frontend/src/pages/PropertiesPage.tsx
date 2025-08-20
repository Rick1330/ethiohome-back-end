import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyFilters as PropertyFiltersType } from '@/types';
import { useInfiniteProperties, useFavorites } from '@/hooks/useProperties';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  MapPin, 
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

export const PropertiesPage: React.FC = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { favorites, toggleFavorite } = useFavorites();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteProperties(filters);

  const properties = data?.properties || [];
  const total = data?.total || 0;

  const handleFiltersChange = useCallback((newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
  }, []);

  const handleFavorite = useCallback((propertyId: string) => {
    toggleFavorite(propertyId);
    const isFavorited = favorites.includes(propertyId);
    toast.success(
      isFavorited 
        ? 'Removed from favorites' 
        : 'Added to favorites'
    );
  }, [toggleFavorite, favorites]);

  const handleShare = useCallback((property: any) => {
    const url = `${window.location.origin}/properties/${property._id}`;
    const text = `Check out this property: ${property.title}`;
    
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: text,
        url: url,
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        toast.success('Property link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('properties')}
              </h1>
              <p className="text-gray-600">
                Discover verified properties across Ethiopia
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{total.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MapPin className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <p className="text-2xl font-bold">50+</p>
                    <p className="text-sm text-gray-600">Cities Covered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <SlidersHorizontal className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <p className="text-2xl font-bold">99%</p>
                    <p className="text-sm text-gray-600">Verified Properties</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <PropertyFilters
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <PropertyGrid
              properties={properties}
              isLoading={isLoading}
              error={error?.message || null}
              onRetry={handleRetry}
              onLoadMore={handleLoadMore}
              hasMore={hasNextPage}
              isLoadingMore={isFetchingNextPage}
              showActions={true}
              onFavorite={handleFavorite}
              onShare={handleShare}
              favoriteIds={favorites}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

