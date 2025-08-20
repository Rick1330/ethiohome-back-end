import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProperty, useFavorites } from '@/hooks/useProperties';
import { PropertyDetails } from '@/components/property/PropertyDetails';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();

  const {
    data: property,
    isLoading,
    error,
    refetch,
  } = useProperty(id!);

  const handleBack = () => {
    navigate(-1);
  };

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

  const handleContact = useCallback((property: any) => {
    // Navigate to interest form or contact modal
    navigate(`/properties/${property._id}/interest`);
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Property Not Found
            </h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              {error?.message || 'The property you are looking for does not exist or has been removed.'}
            </p>
            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline">
                Go Back
              </Button>
              <Button onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
          
          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-primary"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/properties')}
              className="hover:text-primary"
            >
              Properties
            </button>
            <span>/</span>
            <span className="text-gray-900 truncate max-w-[200px]">
              {property.title}
            </span>
          </nav>
        </div>

        {/* Property Details */}
        <PropertyDetails
          property={property}
          onFavorite={handleFavorite}
          onShare={handleShare}
          onContact={handleContact}
          isFavorited={favorites.includes(property._id)}
        />
      </div>
    </div>
  );
};

