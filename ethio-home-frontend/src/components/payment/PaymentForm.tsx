import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  DollarSign,
  Calendar,
  User,
  Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/helpers';

interface PaymentFormProps {
  amount: number;
  currency: 'ETB' | 'USD';
  paymentType: 'subscription' | 'property_listing' | 'premium_feature';
  description?: string;
  subscriptionPlanId?: string;
  propertyId?: string;
  onPaymentInitiate: (data: PaymentFormData) => Promise<void>;
  isLoading?: boolean;
}

interface PaymentFormData {
  amount: number;
  currency: 'ETB' | 'USD';
  paymentType: 'subscription' | 'property_listing' | 'premium_feature';
  subscriptionPlanId?: string;
  propertyId?: string;
  description?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  paymentType,
  description,
  subscriptionPlanId,
  propertyId,
  onPaymentInitiate,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<'chapa' | 'bank_transfer'>('chapa');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      return;
    }

    const paymentData: PaymentFormData = {
      amount,
      currency,
      paymentType,
      subscriptionPlanId,
      propertyId,
      description
    };

    await onPaymentInitiate(paymentData);
  };

  const getPaymentTypeLabel = () => {
    switch (paymentType) {
      case 'subscription':
        return 'Subscription Payment';
      case 'property_listing':
        return 'Property Listing Fee';
      case 'premium_feature':
        return 'Premium Feature';
      default:
        return 'Payment';
    }
  };

  const getPaymentDescription = () => {
    if (description) return description;
    
    switch (paymentType) {
      case 'subscription':
        return 'Monthly subscription to access premium features';
      case 'property_listing':
        return 'Fee for listing your property on EthioHome';
      case 'premium_feature':
        return 'Access to premium features and enhanced visibility';
      default:
        return 'Payment for EthioHome services';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Summary
          </CardTitle>
          <CardDescription>Review your payment details before proceeding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Service</span>
            <span className="font-medium">{getPaymentTypeLabel()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Description</span>
            <span className="text-sm text-gray-900 text-right max-w-xs">{getPaymentDescription()}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(amount, currency)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'chapa' | 'bank_transfer')}>
            <div className="space-y-4">
              {/* Chapa Payment */}
              <div className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                paymentMethod === 'chapa' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
              )}>
                <RadioGroupItem value="chapa" id="chapa" />
                <div className="flex-1">
                  <Label htmlFor="chapa" className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Chapa Payment</h3>
                        <p className="text-sm text-gray-600">Pay securely with Chapa - supports all major Ethiopian banks</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Recommended</Badge>
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </Label>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                paymentMethod === 'bank_transfer' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
              )}>
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <div className="flex-1">
                  <Label htmlFor="bank_transfer" className="cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Bank Transfer</h3>
                        <p className="text-sm text-gray-600">Direct bank transfer - manual verification required</p>
                      </div>
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>

          {/* Payment Method Details */}
          {paymentMethod === 'chapa' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure Chapa Payment</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>• Instant payment processing</li>
                    <li>• Supports all major Ethiopian banks</li>
                    <li>• Mobile money and card payments</li>
                    <li>• 256-bit SSL encryption</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'bank_transfer' && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Bank Transfer Instructions</h4>
                  <div className="text-sm text-yellow-800 mt-2 space-y-2">
                    <p>Transfer the exact amount to our bank account:</p>
                    <div className="bg-white p-3 rounded border">
                      <p><strong>Bank:</strong> Commercial Bank of Ethiopia</p>
                      <p><strong>Account Name:</strong> EthioHome Real Estate</p>
                      <p><strong>Account Number:</strong> 1000123456789</p>
                      <p><strong>Reference:</strong> Your user ID and payment type</p>
                    </div>
                    <p className="text-xs">Note: Manual verification may take 1-2 business days</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to the{' '}
              <a href="/terms" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              . I understand that this payment is for {getPaymentTypeLabel().toLowerCase()} and is non-refundable unless otherwise specified.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Payment Button */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!agreedToTerms || isLoading}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Pay {formatCurrency(amount, currency)} Securely
              </>
            )}
          </Button>
          
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>Verified Payment</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

