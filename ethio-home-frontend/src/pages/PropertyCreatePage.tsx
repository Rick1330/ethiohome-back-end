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

  // Updated handleSubmit to accept FormData
  const handleSubmit = async (formData: FormData) => {
    if (!user) {
      toast.error('You must be logged in to create a property');
      return;
    }

    setIsLoading(true);
    try {
      // The FormData is already constructed in PropertyForm.
      // We can append any additional fields here if necessary.
      // For example, the backend might expect the owner ID, which we can get from the auth context.
      // Note: The PropertyForm is already designed to get owner from the context in a real app,
      // but for this flow, we ensure it's here.
      // The backend's createOne factory will set this from req.user, so we don't need to append it here.

      await propertyService.createProperty(formData);
      toast.success('Property created successfully! It will be reviewed by our team.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating property:', error);
      toast.error(error.response?.data?.message || 'Failed to create property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  // Permission check
  if (!user || !['seller', 'agent', 'admin', 'employee'].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You do not have permission to create properties.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
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
        <PropertyForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
