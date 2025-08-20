import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PropertyForm } from '@/components/property/PropertyForm';
import { useAuth } from '@/contexts/AuthContext';
import { propertyService } from '@/services/property';
import { Property } from '@/types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const PropertyEditPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        toast.error('Property ID is required');
        navigate('/dashboard');
        return;
      }

      try {
        const propertyData = await propertyService.getPropertyById(id);
        
        // Check if user has permission to edit this property
        if (!user || (
          propertyData.owner !== user.id && 
          propertyData.agent !== user.id && 
          propertyData.seller !== user.id &&
          user.role !== 'admin'
        )) {
          toast.error('You do not have permission to edit this property');
          navigate('/dashboard');
          return;
        }

        setProperty(propertyData);
      } catch (error: any) {
        console.error('Error fetching property:', error);
        toast.error('Failed to load property details');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, navigate]);

  const handleSubmit = async (data: any) => {
    if (!property || !id) return;

    setIsSubmitting(true);
    try {
      const updatedData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      await propertyService.updateProperty(id, updatedData);
      toast.success('Property updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast.error(error.message || 'Failed to update property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-4">
            The property you're looking for doesn't exist or you don't have permission to edit it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="mt-2 text-gray-600">
            Update your property details to keep your listing current and attractive.
          </p>
        </div>

        <PropertyForm
          property={property}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

