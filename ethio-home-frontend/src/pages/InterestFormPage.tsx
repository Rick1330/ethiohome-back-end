import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProperty } from '@/hooks/useProperties';
import { useCreateInterest } from '@/hooks/useInterest';
import { InterestForm } from '@/components/interest/InterestForm';
import { LoadingSpinner } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const InterestFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: property,
    isLoading: isLoadingProperty,
    error: propertyError,
  } = useProperty(id!);

  const createInterestMutation = useCreateInterest();

  const handleBack = () => {
    navigate(`/properties/${id}`);
  };

  const handleSubmit = useCallback(async (data: any) => {
    try {
      await createInterestMutation.mutateAsync({
        propertyId: id!,
        ...data,
      });
      
      toast.success('Interest submitted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit interest');
      throw error;
    }
  }, [id, createInterestMutation]);

  // Loading state
  if (isLoadingProperty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (propertyError || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Property Not Found
            </h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              {propertyError?.message || 'The property you are looking for does not exist or has been removed.'}
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate('/properties')} variant="outline">
                Browse Properties
              </Button>
              <Button onClick={handleBack}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Property
          </Button>
          
          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-primary"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/properties')}
              className="hover:text-primary"
            >
              Properties
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate(`/properties/${id}`)}
              className="hover:text-primary truncate max-w-[150px]"
            >
              {property.title}
            </button>
            <span>/</span>
            <span className="text-gray-900">Express Interest</span>
          </nav>
        </div>

        {/* Interest Form */}
        <InterestForm
          property={property}
          onSubmit={handleSubmit}
          isLoading={createInterestMutation.isPending}
        />
      </div>
    </div>
  );
};

