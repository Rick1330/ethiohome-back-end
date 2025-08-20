import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Home,
  RefreshCw,
  CreditCard,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/utils/helpers';

interface PaymentStatusProps {
  payment: {
    id: string;
    txRef: string;
    chapaRef?: string;
    amount: number;
    currency: 'ETB' | 'USD';
    status: 'pending' | 'success' | 'failed' | 'cancelled';
    paymentType: 'subscription' | 'property_listing' | 'premium_feature';
    paymentMethod: 'chapa' | 'bank_transfer' | 'cash';
    description?: string;
    paidAt?: string;
    createdAt: string;
    property?: {
      id: string;
      title: string;
      location: string;
    };
    subscriptionPlan?: {
      id: string;
      interval: string;
      amount: number;
      currency: string;
    };
  };
  onRetry?: () => void;
  onDownloadReceipt?: () => void;
  onGoHome?: () => void;
  onViewProperty?: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  payment,
  onRetry,
  onDownloadReceipt,
  onGoHome,
  onViewProperty
}) => {
  const { t } = useTranslation();

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-600" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-600" />;
      case 'cancelled':
        return <AlertTriangle className="h-16 w-16 text-gray-600" />;
      default:
        return <Clock className="h-16 w-16 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = () => {
    switch (payment.status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusTitle = () => {
    switch (payment.status) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      case 'cancelled':
        return 'Payment Cancelled';
      default:
        return 'Payment Status';
    }
  };

  const getStatusMessage = () => {
    switch (payment.status) {
      case 'success':
        return 'Your payment has been processed successfully. You can now access your purchased services.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support if the issue persists.';
      case 'pending':
        return 'Your payment is being processed. This may take a few minutes. Please do not refresh this page.';
      case 'cancelled':
        return 'Your payment was cancelled. No charges have been made to your account.';
      default:
        return 'Processing your payment...';
    }
  };

  const getPaymentTypeLabel = () => {
    switch (payment.paymentType) {
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

  const getPaymentMethodLabel = () => {
    switch (payment.paymentMethod) {
      case 'chapa':
        return 'Chapa Payment';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash Payment';
      default:
        return payment.paymentMethod;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status Header */}
      <Card>
        <CardContent className="pt-8 pb-6">
          <div className="text-center space-y-4">
            {getStatusIcon()}
            <div>
              <h1 className={cn("text-2xl font-bold", getStatusColor())}>
                {getStatusTitle()}
              </h1>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                {getStatusMessage()}
              </p>
            </div>
            <Badge className={cn('text-sm px-3 py-1', getStatusBadgeColor())}>
              {payment.status.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>Transaction information and receipt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Transaction ID</label>
              <p className="font-mono text-sm text-gray-900">{payment.txRef}</p>
            </div>
            {payment.chapaRef && (
              <div>
                <label className="text-sm font-medium text-gray-600">Chapa Reference</label>
                <p className="font-mono text-sm text-gray-900">{payment.chapaRef}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-600">Payment Type</label>
              <p className="text-gray-900">{getPaymentTypeLabel()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Payment Method</label>
              <p className="text-gray-900">{getPaymentMethodLabel()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Amount</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(payment.amount, payment.currency)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date</label>
              <p className="text-gray-900">
                {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
              </p>
            </div>
          </div>

          {payment.description && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{payment.description}</p>
              </div>
            </>
          )}

          {/* Property Information */}
          {payment.property && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-600">Property</label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">{payment.property.title}</h4>
                  <p className="text-sm text-gray-600">{payment.property.location}</p>
                </div>
              </div>
            </>
          )}

          {/* Subscription Information */}
          {payment.subscriptionPlan && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-gray-600">Subscription Plan</label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900">
                    {payment.subscriptionPlan.interval} Plan
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(payment.subscriptionPlan.amount, payment.subscriptionPlan.currency)} per {payment.subscriptionPlan.interval}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {payment.status === 'success' && (
              <>
                {onDownloadReceipt && (
                  <Button onClick={onDownloadReceipt} variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                )}
                {payment.property && onViewProperty && (
                  <Button onClick={onViewProperty} variant="outline" className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    View Property
                  </Button>
                )}
                {onGoHome && (
                  <Button onClick={onGoHome} className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                )}
              </>
            )}

            {payment.status === 'failed' && onRetry && (
              <Button onClick={onRetry} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}

            {payment.status === 'pending' && (
              <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            )}

            {payment.status === 'cancelled' && onGoHome && (
              <Button onClick={onGoHome} variant="outline" className="flex-1">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@ethiohome.com" className="text-green-600 hover:underline">
                support@ethiohome.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      {payment.status === 'success' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">Payment Secured</h4>
                <p className="text-sm text-green-800 mt-1">
                  Your payment has been processed securely. A confirmation email has been sent to your registered email address.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

