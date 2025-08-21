import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Property } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, MapPin, Home, DollarSign, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Updated schema to handle FileList for uploads
const propertyFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description is required'),
  price: z.number().min(1, 'Price must be a positive number'),
  propertyType: z.enum(['apartment', 'house', 'villa', 'condo', 'townhouse', 'studio', 'commercial', 'land']),
  location: z.object({
    city: z.string().min(2, 'City is required'),
    subCity: z.string().min(2, 'Sub-city is required'),
  }),
  // ... other fields from your original schema ...
  images: z.instanceof(FileList).refine(files => files.length > 0, 'At least one image is required.'),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: FormData) => Promise<void>; // Changed to accept FormData
  onCancel: () => void;
  isLoading?: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>(property?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    // defaultValues would need to be adjusted for a real edit form
  });

  const images = watch('images');

  useEffect(() => {
    if (images && images.length > 0) {
      const newPreviews = Array.from(images).map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);

      // Clean up object URLs
      return () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
        setImagePreviews(property?.images || []);
    }
  }, [images, property]);

  const onFormSubmit = (data: PropertyFormData) => {
    const formData = new FormData();
    // Append all the text fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('propertyType', data.propertyType);
    formData.append('location[city]', data.location.city);
    formData.append('location[subCity]', data.location.subCity);
    // ... append other fields ...

    // Append images
    if (data.images) {
      Array.from(data.images).forEach(file => {
        formData.append('images', file);
      });
    }

    onSubmit(formData).catch(err => {
        toast.error('Submission failed. Please try again.');
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{property ? 'Edit Property' : 'Create New Property'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* --- Basic Info Fields --- */}
            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" {...register('description')} />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>
            {/* ... other form fields for location, details etc ... */}

            {/* --- Media Tab Content --- */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold"><ImageIcon className="inline-block mr-2 h-5 w-5" />Property Images *</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...register('images')}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              {errors.images && <p className="text-sm text-red-500">{errors.images.message as string}</p>}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                        // This remove logic would need to be more complex, updating the form state
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
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
