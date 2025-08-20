import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Calendar,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { formatCurrency, formatDate, getPropertyTypeDisplayName, getStatusDisplayName, getInitials } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface PropertyDetailsProps {
  property: Property;
  onFavorite?: (propertyId: string) => void;
  onShare?: (property: Property) => void;
  onContact?: (property: Property) => void;
  isFavorited?: boolean;
  className?: string;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  property,
  onFavorite,
  onShare,
  onContact,
  isFavorited = false,
  className,
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const images = property.images || ['/placeholder-property.jpg'];
  const hasDiscount = property.priceDiscount && property.priceDiscount > 0;
  const discountedPrice = hasDiscount ? property.price - property.priceDiscount : property.price;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavorite = () => {
    onFavorite?.(property._id);
  };

  const handleShare = () => {
    onShare?.(property);
  };

  const handleContact = () => {
    onContact?.(property);
  };

  const features = [
    { icon: Bed, label: 'Bedrooms', value: property.features?.bedrooms },
    { icon: Bath, label: 'Bathrooms', value: property.features?.bathrooms },
    { icon: Square, label: 'Area', value: property.features?.area ? `${property.features.area}m²` : null },
    { icon: Car, label: 'Parking', value: property.features?.parking ? 'Available' : null },
  ].filter(feature => feature.value);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Image Gallery */}
      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9] bg-gray-100">
          <img
            src={images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
            }}
          />
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}

          {/* Expand Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white"
            onClick={() => setIsImageModalOpen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge 
              variant={property.status === 'for-sale' ? 'default' : 'secondary'}
            >
              {getStatusDisplayName(property.status)}
            </Badge>
            
            {property.isVerified ? (
              <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                {t('verified')}
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                {t('unverified')}
              </Badge>
            )}

            {hasDiscount && (
              <Badge variant="destructive">
                -{Math.round((property.priceDiscount / property.price) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
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
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="p-4 border-t">
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                    index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                  )}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <Badge variant="outline">
                  {getPropertyTypeDisplayName(property.type)}
                </Badge>
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(discountedPrice, property.currency)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(property.price, property.currency)}
                  </span>
                )}
                {property.status === 'for-rent' && (
                  <span className="text-gray-600">/month</span>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Features */}
              {features.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <feature.icon className="w-5 h-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm font-medium">{feature.value}</p>
                        <p className="text-xs text-gray-600">{feature.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-6" />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('description')}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {property.description}
                </p>
              </div>

              {/* Additional Features */}
              {(property.features?.furnished || property.features?.yearBuilt) && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Additional Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {property.features.furnished && (
                        <Badge variant="secondary">Furnished</Badge>
                      )}
                      {property.features.yearBuilt && (
                        <Badge variant="secondary">Built in {property.features.yearBuilt}</Badge>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Property Info */}
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Property ID:</span>
                  <span className="ml-2 text-gray-600">{property._id}</span>
                </div>
                <div>
                  <span className="font-medium">Listed:</span>
                  <span className="ml-2 text-gray-600">{formatDate(property.createdAt)}</span>
                </div>
                {property.verificationDate && (
                  <div>
                    <span className="font-medium">Verified:</span>
                    <span className="ml-2 text-gray-600">{formatDate(property.verificationDate)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={property.owner.photo} alt={property.owner.name} />
                  <AvatarFallback>{getInitials(property.owner.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{property.owner.name}</p>
                  <p className="text-sm text-gray-600">Property Owner</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" onClick={handleContact}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t('expressInterest')}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" onClick={handleFavorite}>
                <Heart className={cn(
                  'w-4 h-4 mr-2',
                  isFavorited ? 'fill-red-500 text-red-500' : ''
                )} />
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button variant="outline" className="w-full" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Property
              </Button>
            </CardContent>
          </Card>

          {/* Property Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Property Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Views</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Inquiries</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days Listed</span>
                <span className="font-medium">
                  {Math.floor((Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

