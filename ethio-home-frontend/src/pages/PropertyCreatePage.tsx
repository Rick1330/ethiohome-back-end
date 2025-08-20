import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PropertyForm } from '@/components/property/PropertyForm';
import { useAuth } from '@/contexts/AuthContext';
import { propertyService } from '@/services/property';
import { toast } from 'sonner';

export const PropertyCreatePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (data: any) => {
    if (!user) {
      toast.error('You must be logged in to create a property');
      return;
    }

    setIsLoading(true);
    try {
      const propertyData = {
        ...data,
        owner: user.id,
        agent: user.role === 'agent' ? user.id : undefined,
        seller: user.role === 'seller' ? user.id : undefined,
        status: 'pending_approval', // Properties need admin approval
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await propertyService.createProperty(propertyData);
      toast.success('Property created successfully! It will be reviewed by our team.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast.error(error.message || 'Failed to create property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Check if user has permission to create properties
  if (!user || !['seller', 'agent', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need to be a seller or agent to create properties.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Property</h1>
          <p className="mt-2 text-gray-600">
            List your property on Ethio-Home and reach thousands of potential buyers and renters.
          </p>
        </div>

        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

