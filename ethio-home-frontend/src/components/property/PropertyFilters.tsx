import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { PropertyFilters as PropertyFiltersType } from '@/types';
import { propertyFiltersSchema } from '@/utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  MapPin,
  DollarSign,
  Home,
  Bed,
  Bath,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyFiltersProps {
  onFiltersChange: (filters: PropertyFiltersType) => void;
  initialFilters?: PropertyFiltersType;
  className?: string;
  isLoading?: boolean;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  className,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PropertyFiltersType>({
    resolver: zodResolver(propertyFiltersSchema),
    defaultValues: initialFilters,
  });

  const watchedValues = watch();

  const propertyTypes = [
    { value: 'house', label: t('house') },
    { value: 'apartment', label: t('apartment') },
    { value: 'villa', label: t('villa') },
    { value: 'land', label: t('land') },
    { value: 'commercial', label: t('commercial') },
  ];

  const bedroomOptions = [1, 2, 3, 4, 5, 6];
  const bathroomOptions = [1, 2, 3, 4, 5];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: '-createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'title', label: 'Name: A to Z' },
    { value: '-title', label: 'Name: Z to A' },
  ];

  const onSubmit = (data: PropertyFiltersType) => {
    // Remove empty values
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key as keyof PropertyFiltersType] = value;
      }
      return acc;
    }, {} as PropertyFiltersType);

    onFiltersChange(cleanedData);
    updateActiveFilters(cleanedData);
  };

  const updateActiveFilters = (filters: PropertyFiltersType) => {
    const active: string[] = [];
    
    if (filters.city) active.push(`Location: ${filters.city}`);
    if (filters.propertyType) active.push(`Type: ${propertyTypes.find(t => t.value === filters.propertyType)?.label}`);
    if (filters.minPrice || filters.maxPrice) {
      const priceRange = `Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}`;
      active.push(priceRange);
    }
    if (filters.bedrooms) active.push(`${filters.bedrooms} Bedrooms`);
    if (filters.bathrooms) active.push(`${filters.bathrooms} Bathrooms`);
    if (filters.minArea || filters.maxArea) {
      const areaRange = `Area: ${filters.minArea || 0} - ${filters.maxArea || '∞'} m²`;
      active.push(areaRange);
    }
    if (filters.furnished) active.push('Furnished');
    if (filters.isVerified) active.push('Verified Only');

    setActiveFilters(active);
  };

  const clearFilters = () => {
    reset();
    setActiveFilters([]);
    onFiltersChange({});
  };

  const removeFilter = (filterText: string) => {
    const newFilters = { ...watchedValues };
    
    if (filterText.startsWith('Location:')) {
      newFilters.city = undefined;
    } else if (filterText.startsWith('Type:')) {
      newFilters.propertyType = undefined;
    } else if (filterText.startsWith('Price:')) {
      newFilters.minPrice = undefined;
      newFilters.maxPrice = undefined;
    } else if (filterText.includes('Bedrooms')) {
      newFilters.bedrooms = undefined;
    } else if (filterText.includes('Bathrooms')) {
      newFilters.bathrooms = undefined;
    } else if (filterText.startsWith('Area:')) {
      newFilters.minArea = undefined;
      newFilters.maxArea = undefined;
    } else if (filterText === 'Furnished') {
      newFilters.furnished = undefined;
    } else if (filterText === 'Verified Only') {
      newFilters.isVerified = undefined;
    }

    // Update form values
    Object.entries(newFilters).forEach(([key, value]) => {
      setValue(key as keyof PropertyFiltersType, value);
    });

    onFiltersChange(newFilters);
    updateActiveFilters(newFilters);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by location, title, or description..."
          className="pl-10 pr-4"
          {...register('city')}
        />
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-gray-200"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </div>
            <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Filter Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Property Type */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      {t('propertyType')}
                    </Label>
                    <Select
                      value={watchedValues.propertyType || ''}
                      onValueChange={(value) => setValue('propertyType', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {propertyTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Min Price
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register('minPrice', { valueAsNumber: true })}
                    />
                    {errors.minPrice && (
                      <p className="text-sm text-red-500">{errors.minPrice.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Max Price
                    </Label>
                    <Input
                      type="number"
                      placeholder="No limit"
                      {...register('maxPrice', { valueAsNumber: true })}
                    />
                    {errors.maxPrice && (
                      <p className="text-sm text-red-500">{errors.maxPrice.message}</p>
                    )}
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Bed className="mr-2 h-4 w-4" />
                      {t('bedrooms')}
                    </Label>
                    <Select
                      value={watchedValues.bedrooms?.toString() || ''}
                      onValueChange={(value) => setValue('bedrooms', value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        {bedroomOptions.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}+ Bedrooms
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bathrooms */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Bath className="mr-2 h-4 w-4" />
                      {t('bathrooms')}
                    </Label>
                    <Select
                      value={watchedValues.bathrooms?.toString() || ''}
                      onValueChange={(value) => setValue('bathrooms', value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        {bathroomOptions.map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}+ Bathrooms
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area Range */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Square className="mr-2 h-4 w-4" />
                      Min Area (m²)
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      {...register('minArea', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Square className="mr-2 h-4 w-4" />
                      Max Area (m²)
                    </Label>
                    <Input
                      type="number"
                      placeholder="No limit"
                      {...register('maxArea', { valueAsNumber: true })}
                    />
                  </div>

                  {/* Sort */}
                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <Select
                      value={watchedValues.sort || ''}
                      onValueChange={(value) => setValue('sort', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Default" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="furnished"
                      checked={watchedValues.furnished || false}
                      onCheckedChange={(checked) => setValue('furnished', checked as boolean)}
                    />
                    <Label htmlFor="furnished">Furnished</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={watchedValues.isVerified || false}
                      onCheckedChange={(checked) => setValue('isVerified', checked as boolean)}
                    />
                    <Label htmlFor="verified">Verified Properties Only</Label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Searching...' : 'Apply Filters'}
                  </Button>
                  <Button type="button" variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

