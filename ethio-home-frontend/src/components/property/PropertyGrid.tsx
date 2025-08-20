import React from 'react';
import { Property } from '@/types';
import { PropertyCard } from './PropertyCard';
import { LoadingCard } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  className?: string;
  showActions?: boolean;
  onFavorite?: (propertyId: string) => void;
  onShare?: (property: Property) => void;
  favoriteIds?: string[];
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  isLoading = false,
  error = null,
  onRetry,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  className,
  showActions = true,
  onFavorite,
  onShare,
  favoriteIds = [],
}) => {
  // Loading state
  if (isLoading && properties.length === 0) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Properties
          </h3>
          <p className="text-gray-600 mb-6">
            {error || 'Something went wrong while loading properties. Please try again.'}
          </p>
          {onRetry && (
            <Button onClick={onRetry} className="inline-flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (!isLoading && properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Properties Found
          </h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
          </p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
        </p>
      </div>

      {/* Property Grid */}
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            showActions={showActions}
            onFavorite={onFavorite}
            onShare={onShare}
            isFavorited={favoriteIds.includes(property._id)}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            size="lg"
          >
            {isLoadingMore ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading More...
              </>
            ) : (
              'Load More Properties'
            )}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingCard key={`loading-${index}`} />
          ))}
        </div>
      )}

      {/* Error during load more */}
      {error && properties.length > 0 && (
        <div className="flex justify-center pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">
                Failed to load more properties. 
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="ml-2 underline hover:no-underline"
                  >
                    Try again
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

