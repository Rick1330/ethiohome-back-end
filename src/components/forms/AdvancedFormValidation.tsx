import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// Advanced validation schema with conditional validation
const createPropertySchema = (t: any) => z.object({
  title: z.string()
    .min(5, t('validation.minLength', { min: 5 }))
    .max(100, t('validation.maxLength', { max: 100 })),
  
  description: z.string()
    .min(20, t('validation.minLength', { min: 20 }))
    .max(2000, t('validation.maxLength', { max: 2000 })),
  
  price: z.number()
    .min(1000, t('validation.min', { min: 1000 }))
    .max(100000000, t('validation.max', { max: 100000000 })),
  
  location: z.object({
    city: z.string().min(1, t('validation.required')),
    subcity: z.string().min(1, t('validation.required')),
    woreda: z.string().optional(),
    specificLocation: z.string().min(1, t('validation.required')),
  }),
  
  propertyType: z.enum(['apartment', 'house', 'villa', 'commercial', 'land']),
  
  status: z.enum(['for-sale', 'for-rent']),
  
  features: z.object({
    bedrooms: z.number().min(0).max(20),
    bathrooms: z.number().min(0).max(20),
    area: z.number().min(1, t('validation.min', { min: 1 })),
    parking: z.boolean(),
    garden: z.boolean(),
    balcony: z.boolean(),
    furnished: z.boolean(),
    petFriendly: z.boolean(),
  }),
  
  contact: z.object({
    name: z.string().min(2, t('validation.minLength', { min: 2 })),
    phone: z.string()
      .regex(/^\+251[0-9]{9}$/, t('validation.phone')),
    email: z.string().email(t('validation.email')),
    preferredContactTime: z.enum(['morning', 'afternoon', 'evening', 'anytime']),
  }),
  
  images: z.array(z.string()).min(1, 'At least one image is required').max(10, 'Maximum 10 images allowed'),
  
  documents: z.array(z.string()).optional(),
  
  amenities: z.array(z.string()).optional(),
  
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  
  marketingConsent: z.boolean().optional(),
}).refine((data) => {
  // Conditional validation: commercial properties don't need bedrooms/bathrooms
  if (data.propertyType === 'commercial') {
    return true;
  }
  return data.features.bedrooms > 0;
}, {
  message: 'Residential properties must have at least 1 bedroom',
  path: ['features', 'bedrooms'],
});

type PropertyFormData = z.infer<ReturnType<typeof createPropertySchema>>;

interface AdvancedFormValidationProps {
  onSubmit: (data: PropertyFormData) => void;
  initialData?: Partial<PropertyFormData>;
  isLoading?: boolean;
}

export const AdvancedFormValidation: React.FC<AdvancedFormValidationProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  
  const schema = createPropertySchema(t);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty, touchedFields },
    setValue,
    trigger,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: {
        city: '',
        subcity: '',
        woreda: '',
        specificLocation: '',
      },
      propertyType: 'apartment',
      status: 'for-sale',
      features: {
        bedrooms: 1,
        bathrooms: 1,
        area: 50,
        parking: false,
        garden: false,
        balcony: false,
        furnished: false,
        petFriendly: false,
      },
      contact: {
        name: '',
        phone: '',
        email: '',
        preferredContactTime: 'anytime',
      },
      images: [],
      documents: [],
      amenities: [],
      agreeToTerms: false,
      marketingConsent: false,
      ...initialData,
    },
    mode: 'onChange',
  });

  const watchedPropertyType = watch('propertyType');
  const watchedStatus = watch('status');

  // Field validation status component
  const FieldStatus: React.FC<{ fieldName: string; error?: any; touched?: boolean }> = ({ 
    fieldName, 
    error, 
    touched 
  }) => {
    if (error) {
      return (
        <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error.message}</span>
        </div>
      );
    }
    
    if (touched && !error) {
      return (
        <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
          <CheckCircle className="h-3 w-3" />
          <span>Valid</span>
        </div>
      );
    }
    
    return null;
  };

  // Progress indicator
  const getFormProgress = () => {
    const totalFields = Object.keys(touchedFields).length;
    const validFields = Object.keys(touchedFields).filter(field => !errors[field as keyof typeof errors]).length;
    return totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0;
  };

  const progress = getFormProgress();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Property Listing Form</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={progress === 100 ? 'default' : 'secondary'}>
                {progress}% Complete
              </Badge>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div>
                    <Input
                      {...field}
                      id="title"
                      placeholder="Enter property title..."
                      className={cn(
                        errors.title && 'border-red-500',
                        touchedFields.title && !errors.title && 'border-green-500'
                      )}
                    />
                    <FieldStatus 
                      fieldName="title" 
                      error={errors.title} 
                      touched={touchedFields.title} 
                    />
                  </div>
                )}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Describe your property in detail..."
                      rows={4}
                      className={cn(
                        errors.description && 'border-red-500',
                        touchedFields.description && !errors.description && 'border-green-500'
                      )}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <FieldStatus 
                        fieldName="description" 
                        error={errors.description} 
                        touched={touchedFields.description} 
                      />
                      <span className="text-xs text-gray-500">
                        {field.value?.length || 0}/2000 characters
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Controller
                  name="propertyType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for-sale">For Sale</SelectItem>
                        <SelectItem value="for-rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="price">
                  Price * ({watchedStatus === 'for-rent' ? 'per month' : 'total'})
                </Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="price"
                        type="number"
                        placeholder="Enter price..."
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className={cn(
                          errors.price && 'border-red-500',
                          touchedFields.price && !errors.price && 'border-green-500'
                        )}
                      />
                      <FieldStatus 
                        fieldName="price" 
                        error={errors.price} 
                        touched={touchedFields.price} 
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Controller
                  name="location.city"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="city"
                        placeholder="e.g., Addis Ababa"
                        className={cn(
                          errors.location?.city && 'border-red-500',
                          touchedFields.location?.city && !errors.location?.city && 'border-green-500'
                        )}
                      />
                      <FieldStatus 
                        fieldName="city" 
                        error={errors.location?.city} 
                        touched={touchedFields.location?.city} 
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="subcity">Subcity *</Label>
                <Controller
                  name="location.subcity"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="subcity"
                        placeholder="e.g., Bole"
                        className={cn(
                          errors.location?.subcity && 'border-red-500',
                          touchedFields.location?.subcity && !errors.location?.subcity && 'border-green-500'
                        )}
                      />
                      <FieldStatus 
                        fieldName="subcity" 
                        error={errors.location?.subcity} 
                        touched={touchedFields.location?.subcity} 
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="woreda">Woreda</Label>
                <Controller
                  name="location.woreda"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="woreda"
                      placeholder="e.g., Woreda 03"
                    />
                  )}
                />
              </div>

              <div>
                <Label htmlFor="specificLocation">Specific Location *</Label>
                <Controller
                  name="location.specificLocation"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="specificLocation"
                        placeholder="e.g., Near Bole Airport"
                        className={cn(
                          errors.location?.specificLocation && 'border-red-500',
                          touchedFields.location?.specificLocation && !errors.location?.specificLocation && 'border-green-500'
                        )}
                      />
                      <FieldStatus 
                        fieldName="specificLocation" 
                        error={errors.location?.specificLocation} 
                        touched={touchedFields.location?.specificLocation} 
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Features - Conditional based on property type */}
        {watchedPropertyType !== 'land' && (
          <Card>
            <CardHeader>
              <CardTitle>Property Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {watchedPropertyType !== 'commercial' && (
                  <>
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Controller
                        name="features.bedrooms"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <Input
                              {...field}
                              id="bedrooms"
                              type="number"
                              min="0"
                              max="20"
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className={cn(
                                errors.features?.bedrooms && 'border-red-500'
                              )}
                            />
                            <FieldStatus 
                              fieldName="bedrooms" 
                              error={errors.features?.bedrooms} 
                              touched={touchedFields.features?.bedrooms} 
                            />
                          </div>
                        )}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Controller
                        name="features.bathrooms"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="bathrooms"
                            type="number"
                            min="0"
                            max="20"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        )}
                      />
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="area">Area (m²) *</Label>
                  <Controller
                    name="features.area"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Input
                          {...field}
                          id="area"
                          type="number"
                          min="1"
                          placeholder="e.g., 120"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className={cn(
                            errors.features?.area && 'border-red-500',
                            touchedFields.features?.area && !errors.features?.area && 'border-green-500'
                          )}
                        />
                        <FieldStatus 
                          fieldName="area" 
                          error={errors.features?.area} 
                          touched={touchedFields.features?.area} 
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Feature checkboxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'parking', label: 'Parking' },
                  { key: 'garden', label: 'Garden' },
                  { key: 'balcony', label: 'Balcony' },
                  { key: 'furnished', label: 'Furnished' },
                  { key: 'petFriendly', label: 'Pet Friendly' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Controller
                      name={`features.${key}` as any}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={key}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Controller
                  name="contact.name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="contactName"
                        placeholder="Your full name"
                        className={cn(
                          errors.contact?.name && 'border-red-500',
                          touchedFields.contact?.name && !errors.contact?.name && 'border-green-500'
                        )}
                      />
                      <FieldStatus 
                        fieldName="contactName" 
                        error={errors.contact?.name} 
                        touched={touchedFields.contact?.name} 
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Controller
                  name="contact.phone"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="contactPhone"
                        placeholder="+251911234567"
                        className={cn(
                          errors.contact?.phone && 'border-red-500',
                          touchedFields.contact?.phone && !errors.contact?.phone && 'border-green-500'
                        )}
                      />
                      <FieldStatus 
                        fieldName="contactPhone" 
                        error={errors.contact?.phone} 
                        touched={touchedFields.contact?.phone} 
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Controller
                  name="contact.email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input
                        {...field}
                        id="contactEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        className={cn(
                          errors.contact?.email && 'border-red-500',
                          touchedFields.contact?.email && !errors.contact?.email && 'border-green-500'
                        )}
                      />
                      <FieldStatus 
                        fieldName="contactEmail" 
                        error={errors.contact?.email} 
                        touched={touchedFields.contact?.email} 
                      />
                    </div>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="preferredContactTime">Preferred Contact Time</Label>
                <Controller
                  name="contact.preferredContactTime"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                        <SelectItem value="evening">Evening (6PM - 9PM)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Controller
                  name="agreeToTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="agreeToTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className={cn(
                        errors.agreeToTerms && 'border-red-500'
                      )}
                    />
                  )}
                />
                <div className="flex-1">
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the Terms of Service and Privacy Policy *
                  </Label>
                  <FieldStatus 
                    fieldName="agreeToTerms" 
                    error={errors.agreeToTerms} 
                    touched={touchedFields.agreeToTerms} 
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Controller
                  name="marketingConsent"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="marketingConsent"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="marketingConsent" className="text-sm">
                  I consent to receive marketing communications and property updates
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'Submitting...' : 'Submit Property'}
          </Button>
        </div>
      </form>
    </div>
  );
};

