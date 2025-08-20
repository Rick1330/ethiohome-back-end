import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Property } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2
} from 'lucide-react';
import { formatCurrency, formatDate, getPropertyTypeDisplayName, getStatusDisplayName } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
  showActions?: boolean;
  onFavorite?: (propertyId: string) => void;
  onShare?: (property: Property) => void;
  isFavorited?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  className,
  showActions = true,
  onFavorite,
  onShare,
  isFavorited = false,
}) => {
  const { t } = useTranslation();

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(property._id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(property);
  };

  const primaryImage = property.images?.[0] || '/placeholder-property.jpg';
  const hasDiscount = property.priceDiscount && property.priceDiscount > 0;
  const discountedPrice = hasDiscount ? property.price - property.priceDiscount : property.price;

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300 overflow-hidden', className)}>
      <Link to={`/properties/${property._id}`} className="block">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
            }}
          />
          
          {/* Overlay Actions */}
          {showActions && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleFavorite}
              >
                <Heart 
                  className={cn(
                    'h-4 w-4',
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  )} 
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge 
              variant={property.status === 'for-sale' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {getStatusDisplayName(property.status)}
            </Badge>
            
            {property.isVerified ? (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('verified')}
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {t('unverified')}
              </Badge>
            )}

            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{Math.round((property.priceDiscount / property.price) * 100)}%
              </Badge>
            )}
          </div>

          {/* Property Type */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-white/90 text-xs">
              {getPropertyTypeDisplayName(property.type)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Price */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(discountedPrice, property.currency)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(property.price, property.currency)}
                </span>
              )}
            </div>
            {property.status === 'for-rent' && (
              <span className="text-sm text-gray-600">/month</span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.location}</span>
          </div>

          {/* Features */}
          {property.features && (
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              {property.features.bedrooms && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{property.features.bedrooms}</span>
                </div>
              )}
              {property.features.bathrooms && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{property.features.bathrooms}</span>
                </div>
              )}
              {property.features.area && (
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span>{property.features.area}m²</span>
                </div>
              )}
              {property.features.parking && (
                <div className="flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  <span>Parking</span>
                </div>
              )}
            </div>
          )}

          {/* Owner */}
          <div className="text-sm text-gray-600">
            <span>Listed by: </span>
            <span className="font-medium">{property.owner.name}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Listed {formatDate(property.createdAt)}
          </div>
          
          <Button size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
            View Details
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

