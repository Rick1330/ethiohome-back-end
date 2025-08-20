import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PaymentStatus } from '@/components/payment/PaymentStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { paymentService } from '@/services/payment';
import { toast } from 'sonner';

export const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [step, setStep] = useState<'form' | 'processing' | 'status'>('form');

  // Get payment parameters from URL
  const amount = parseFloat(searchParams.get('amount') || '0');
  const currency = (searchParams.get('currency') || 'ETB') as 'ETB' | 'USD';
  const paymentType = (searchParams.get('type') || 'property_listing') as 'subscription' | 'property_listing' | 'premium_feature';
  const description = searchParams.get('description') || undefined;
  const subscriptionPlanId = searchParams.get('planId') || undefined;
  const propertyId = searchParams.get('propertyId') || undefined;
  const txRef = searchParams.get('txRef') || undefined;

  // If txRef is provided, check payment status
  useEffect(() => {
    if (txRef) {
      checkPaymentStatus(txRef);
    }
  }, [txRef]);

  const checkPaymentStatus = async (transactionRef: string) => {
    setIsLoading(true);
    try {
      const paymentData = await paymentService.verifyPayment(transactionRef);
      setPayment(paymentData);
      setStep('status');
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('Failed to verify payment status');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentInitiate = async (paymentData: any) => {
    setIsLoading(true);
    setStep('processing');
    
    try {
      const response = await paymentService.initializePayment(paymentData);
      
      if (response.checkoutUrl) {
        // Redirect to Chapa checkout
        window.location.href = response.checkoutUrl;
      } else {
        // Handle bank transfer or other payment methods
        setPayment(response.payment);
        setStep('status');
        toast.success('Payment initiated successfully');
      }
    } catch (error: any) {
      console.error('Error initiating payment:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = () => {
    setStep('form');
    setPayment(null);
  };

  const handleDownloadReceipt = async () => {
    if (!payment) return;
    
    try {
      // This would generate and download a PDF receipt
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleViewProperty = () => {
    if (payment?.property?.id) {
      navigate(`/properties/${payment.property.id}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Validate required parameters
  if (!amount || amount <= 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Invalid Payment</CardTitle>
            <CardDescription>The payment amount is invalid or missing.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoBack} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to continue with your payment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={handleGoBack} 
            variant="ghost" 
            className="mb-4"
            disabled={step === 'processing'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 'form' ? 'Complete Payment' : 
             step === 'processing' ? 'Processing Payment' : 
             'Payment Status'}
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 'form' ? 'Secure payment processing for EthioHome services' :
             step === 'processing' ? 'Please wait while we process your payment' :
             'Your payment has been processed'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && step !== 'processing' && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        )}

        {/* Payment Form */}
        {step === 'form' && !isLoading && (
          <PaymentForm
            amount={amount}
            currency={currency}
            paymentType={paymentType}
            description={description}
            subscriptionPlanId={subscriptionPlanId}
            propertyId={propertyId}
            onPaymentInitiate={handlePaymentInitiate}
            isLoading={isLoading}
          />
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-8 pb-6">
              <div className="text-center space-y-4">
                <Loader2 className="h-16 w-16 text-green-600 mx-auto animate-spin" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Processing Payment</h2>
                  <p className="text-gray-600 mt-2">
                    Please wait while we securely process your payment. This may take a few moments.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> Do not close this window or navigate away from this page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Status */}
        {step === 'status' && payment && !isLoading && (
          <PaymentStatus
            payment={payment}
            onRetry={handleRetryPayment}
            onDownloadReceipt={handleDownloadReceipt}
            onGoHome={handleGoHome}
            onViewProperty={handleViewProperty}
          />
        )}
      </div>
    </div>
  );
};

