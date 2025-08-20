import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Mail, 
  Phone, 
  MessageCircle, 
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import { cn } from '@/lib/utils';

const interestFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  interestedIn: z.enum(['buying', 'renting', 'viewing', 'information']),
  budget: z.number().min(0, 'Budget must be a positive number').optional(),
  preferredContactTime: z.enum(['morning', 'afternoon', 'evening', 'anytime']),
  preferredContactMethod: z.enum(['phone', 'email', 'whatsapp']),
  message: z.string().min(10, 'Please provide more details about your interest'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  subscribeToUpdates: z.boolean().optional(),
});

type InterestFormData = z.infer<typeof interestFormSchema>;

interface InterestFormProps {
  property: Property;
  onSubmit: (data: InterestFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const InterestForm: React.FC<InterestFormProps> = ({
  property,
  onSubmit,
  isLoading = false,
  className,
}) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<InterestFormData>({
    resolver: zodResolver(interestFormSchema),
    defaultValues: {
      interestedIn: property.status === 'for-sale' ? 'buying' : 'renting',
      preferredContactTime: 'anytime',
      preferredContactMethod: 'phone',
      agreeToTerms: false,
      subscribeToUpdates: true,
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: InterestFormData) => {
    try {
      await onSubmit(data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit interest form:', error);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={cn('max-w-2xl mx-auto', className)}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Interest Submitted Successfully!
            </h2>
            <p className="text-gray-600">
              Thank you for your interest in this property. The owner will contact you soon.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• The property owner will receive your inquiry</li>
              <li>• You'll be contacted within 24 hours</li>
              <li>• A viewing can be scheduled if interested</li>
              <li>• You'll receive updates about this property</li>
            </ul>
          </div>

          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Submit Another Inquiry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Property Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <img
                    src={property.images?.[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                    }}
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={property.status === 'for-sale' ? 'default' : 'secondary'}>
                      {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                    </Badge>
                    {property.isVerified && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(property.price, property.currency)}
                    {property.status === 'for-rent' && (
                      <span className="text-sm text-gray-600 font-normal">/month</span>
                    )}
                  </div>
                </div>

                {property.features && (
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {property.features.bedrooms && (
                        <div>
                          <span className="text-gray-600">Bedrooms:</span>
                          <span className="ml-1 font-medium">{property.features.bedrooms}</span>
                        </div>
                      )}
                      {property.features.bathrooms && (
                        <div>
                          <span className="text-gray-600">Bathrooms:</span>
                          <span className="ml-1 font-medium">{property.features.bathrooms}</span>
                        </div>
                      )}
                      {property.features.area && (
                        <div>
                          <span className="text-gray-600">Area:</span>
                          <span className="ml-1 font-medium">{property.features.area}m²</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interest Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Express Your Interest</CardTitle>
              <p className="text-gray-600">
                Fill out this form to get in touch with the property owner
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        {...register('fullName')}
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="+2519XXXXXXXX"
                        {...register('phone')}
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>I'm interested in *</Label>
                      <Select
                        value={watchedValues.interestedIn}
                        onValueChange={(value) => setValue('interestedIn', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buying">Buying this property</SelectItem>
                          <SelectItem value="renting">Renting this property</SelectItem>
                          <SelectItem value="viewing">Scheduling a viewing</SelectItem>
                          <SelectItem value="information">Getting more information</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(watchedValues.interestedIn === 'buying' || watchedValues.interestedIn === 'renting') && (
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Budget (Optional)
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="Enter your budget"
                        {...register('budget', { valueAsNumber: true })}
                      />
                      {errors.budget && (
                        <p className="text-sm text-red-500">{errors.budget.message}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Phone className="w-5 h-5 mr-2" />
                    Contact Preferences
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Contact Time</Label>
                      <Select
                        value={watchedValues.preferredContactTime}
                        onValueChange={(value) => setValue('preferredContactTime', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                          <SelectItem value="evening">Evening (6PM - 9PM)</SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Contact Method</Label>
                      <Select
                        value={watchedValues.preferredContactMethod}
                        onValueChange={(value) => setValue('preferredContactMethod', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide more details about your interest, questions, or specific requirements..."
                    rows={4}
                    {...register('message')}
                    className={errors.message ? 'border-red-500' : ''}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={watchedValues.agreeToTerms}
                      onCheckedChange={(checked) => setValue('agreeToTerms', checked as boolean)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-5">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                      *
                    </Label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-sm text-red-500 ml-6">{errors.agreeToTerms.message}</p>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="subscribeToUpdates"
                      checked={watchedValues.subscribeToUpdates}
                      onCheckedChange={(checked) => setValue('subscribeToUpdates', checked as boolean)}
                    />
                    <Label htmlFor="subscribeToUpdates" className="text-sm leading-5">
                      Subscribe to updates about similar properties and market insights
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Interest'
                    )}
                  </Button>
                </div>

                {/* Disclaimer */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Important Information:</p>
                      <ul className="space-y-1">
                        <li>• Your information will only be shared with the property owner</li>
                        <li>• You'll receive a confirmation email after submission</li>
                        <li>• The owner typically responds within 24 hours</li>
                        <li>• No fees are charged for expressing interest</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

