import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Property } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  X, 
  MapPin, 
  Home, 
  DollarSign, 
  Image as ImageIcon,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const propertyFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description cannot exceed 2000 characters'),
  type: z.enum(['apartment', 'house', 'villa', 'condo', 'townhouse', 'studio', 'commercial', 'land']),
  status: z.enum(['for_sale', 'for_rent', 'sold', 'rented']),
  price: z.number().min(1, 'Price must be greater than 0'),
  currency: z.enum(['ETB', 'USD']).default('ETB'),
  location: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State/Region is required'),
    country: z.string().default('Ethiopia'),
    zipCode: z.string().optional(),
    coordinates: z.object({
      lat: z.number().optional(),
      lng: z.number().optional()
    }).optional()
  }),
  details: z.object({
    bedrooms: z.number().min(0, 'Bedrooms cannot be negative'),
    bathrooms: z.number().min(0, 'Bathrooms cannot be negative'),
    area: z.number().min(1, 'Area must be greater than 0'),
    areaUnit: z.enum(['sqm', 'sqft']).default('sqm'),
    yearBuilt: z.number().min(1900, 'Year built must be after 1900').max(new Date().getFullYear(), 'Year built cannot be in the future').optional(),
    parking: z.number().min(0, 'Parking spaces cannot be negative').default(0),
    floors: z.number().min(1, 'Floors must be at least 1').optional()
  }),
  features: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  virtualTour: z.string().url().optional().or(z.literal('')),
  contactInfo: z.object({
    phone: z.string().min(10, 'Phone number is required'),
    email: z.string().email('Valid email is required'),
    whatsapp: z.string().optional()
  }),
  availability: z.object({
    availableFrom: z.string().optional(),
    minimumStay: z.number().min(1, 'Minimum stay must be at least 1 day').optional(),
    maximumStay: z.number().optional()
  }).optional()
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio', label: 'Studio' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' }
];

const PROPERTY_STATUS = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'for_rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' }
];

const COMMON_FEATURES = [
  'Air Conditioning', 'Heating', 'Furnished', 'Unfurnished', 'Pet Friendly',
  'Balcony', 'Terrace', 'Garden', 'Fireplace', 'Storage Room',
  'Laundry Room', 'Maid Room', 'Study Room', 'Walk-in Closet'
];

const COMMON_AMENITIES = [
  'Swimming Pool', 'Gym', 'Playground', 'Security', '24/7 Security',
  'CCTV', 'Elevator', 'Generator', 'Water Tank', 'Parking',
  'Covered Parking', 'Visitor Parking', 'Shopping Center', 'School Nearby',
  'Hospital Nearby', 'Public Transport', 'Internet/WiFi'
];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(property?.features || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(property?.amenities || []);
  const [customFeature, setCustomFeature] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property ? {
      title: property.title,
      description: property.description,
      type: property.type,
      status: property.status,
      price: property.price,
      currency: property.currency,
      location: property.location,
      details: property.details,
      features: property.features,
      amenities: property.amenities,
      images: property.images,
      virtualTour: property.virtualTour || '',
      contactInfo: property.contactInfo,
      availability: property.availability
    } : {
      currency: 'ETB',
      location: {
        country: 'Ethiopia'
      },
      details: {
        areaUnit: 'sqm',
        parking: 0
      },
      features: [],
      amenities: [],
      images: []
    }
  });

  const propertyType = watch('type');

  useEffect(() => {
    setValue('features', selectedFeatures);
  }, [selectedFeatures, setValue]);

  useEffect(() => {
    setValue('amenities', selectedAmenities);
  }, [selectedAmenities, setValue]);

  useEffect(() => {
    setValue('images', imageUrls);
  }, [imageUrls, setValue]);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures(prev => [...prev, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities(prev => [...prev, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data: PropertyFormData) => {
    try {
      await onSubmit(data);
      toast.success(property ? 'Property updated successfully!' : 'Property created successfully!');
    } catch (error) {
      toast.error('Failed to save property. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {property ? 'Edit Property' : 'Create New Property'}
          </CardTitle>
          <CardDescription>
            {property ? 'Update your property details' : 'Fill in the details to list your property'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="e.g., Modern 3BR Apartment in Bole"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Property Type *</Label>
                    <Select onValueChange={(value) => setValue('type', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500">{errors.type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select onValueChange={(value) => setValue('status', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-500">{errors.status.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="price"
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        placeholder="0"
                        className="flex-1"
                      />
                      <Select onValueChange={(value) => setValue('currency', value as any)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETB">ETB</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe your property in detail..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        {...register('location.address')}
                        placeholder="Street address"
                      />
                      {errors.location?.address && (
                        <p className="text-sm text-red-500">{errors.location.address.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register('location.city')}
                        placeholder="e.g., Addis Ababa"
                      />
                      {errors.location?.city && (
                        <p className="text-sm text-red-500">{errors.location.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Region *</Label>
                      <Input
                        id="state"
                        {...register('location.state')}
                        placeholder="e.g., Addis Ababa"
                      />
                      {errors.location?.state && (
                        <p className="text-sm text-red-500">{errors.location.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        {...register('location.zipCode')}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      {...register('details.bedrooms', { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {errors.details?.bedrooms && (
                      <p className="text-sm text-red-500">{errors.details.bedrooms.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      {...register('details.bathrooms', { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {errors.details?.bathrooms && (
                      <p className="text-sm text-red-500">{errors.details.bathrooms.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area *</Label>
                    <Input
                      id="area"
                      type="number"
                      {...register('details.area', { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {errors.details?.area && (
                      <p className="text-sm text-red-500">{errors.details.area.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaUnit">Area Unit</Label>
                    <Select onValueChange={(value) => setValue('details.areaUnit', value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqm">sq m</SelectItem>
                        <SelectItem value="sqft">sq ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      {...register('details.yearBuilt', { valueAsNumber: true })}
                      placeholder="e.g., 2020"
                    />
                    {errors.details?.yearBuilt && (
                      <p className="text-sm text-red-500">{errors.details.yearBuilt.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parking">Parking Spaces</Label>
                    <Input
                      id="parking"
                      type="number"
                      {...register('details.parking', { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {errors.details?.parking && (
                      <p className="text-sm text-red-500">{errors.details.parking.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floors">Floors</Label>
                    <Input
                      id="floors"
                      type="number"
                      {...register('details.floors', { valueAsNumber: true })}
                      placeholder="1"
                    />
                    {errors.details?.floors && (
                      <p className="text-sm text-red-500">{errors.details.floors.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        {...register('contactInfo.phone')}
                        placeholder="+251911234567"
                      />
                      {errors.contactInfo?.phone && (
                        <p className="text-sm text-red-500">{errors.contactInfo.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('contactInfo.email')}
                        placeholder="contact@example.com"
                      />
                      {errors.contactInfo?.email && (
                        <p className="text-sm text-red-500">{errors.contactInfo.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        {...register('contactInfo.whatsapp')}
                        placeholder="+251911234567"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Property Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {COMMON_FEATURES.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature}`}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label htmlFor={`feature-${feature}`} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={customFeature}
                      onChange={(e) => setCustomFeature(e.target.value)}
                      placeholder="Add custom feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
                    />
                    <Button type="button" onClick={addCustomFeature} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedFeatures.map((feature) => (
                        <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                          {feature}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleFeatureToggle(feature)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {COMMON_AMENITIES.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      placeholder="Add custom amenity"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                    />
                    <Button type="button" onClick={addCustomAmenity} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                          {amenity}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleAmenityToggle(amenity)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Property Images *
                  </h3>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    />
                    <Button type="button" onClick={addImageUrl} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <p className="text-sm text-red-500">{errors.images.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="virtualTour">Virtual Tour URL</Label>
                  <Input
                    id="virtualTour"
                    {...register('virtualTour')}
                    placeholder="https://example.com/virtual-tour"
                  />
                  {errors.virtualTour && (
                    <p className="text-sm text-red-500">{errors.virtualTour.message}</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

