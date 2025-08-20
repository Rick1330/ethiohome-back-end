import { api } from '@/lib/api';

export interface Payment {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  subscriptionPlan?: {
    id: string;
    interval: string;
    amount: number;
    currency: string;
  };
  property?: {
    id: string;
    title: string;
    location: string;
    price: number;
  };
  amount: number;
  currency: 'ETB' | 'USD';
  paymentMethod: 'chapa' | 'bank_transfer' | 'cash';
  txRef: string;
  chapaRef?: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  paymentType: 'subscription' | 'property_listing' | 'premium_feature';
  description?: string;
  chapaResponse?: any;
  webhookData?: any;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  overallStats: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  monthlyStats: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
    totalAmount: number;
    successfulPayments: number;
  }>;
}

export const paymentService = {
  // Initialize payment
  initializePayment: async (data: {
    amount: number;
    currency?: 'ETB' | 'USD';
    paymentType: 'subscription' | 'property_listing' | 'premium_feature';
    subscriptionPlanId?: string;
    propertyId?: string;
    description?: string;
  }): Promise<{
    payment: Payment;
    checkoutUrl: string;
  }> => {
    const response = await api.post('/payments/initialize', data);
    return response.data.data;
  },

  // Verify payment status
  verifyPayment: async (txRef: string): Promise<Payment> => {
    const response = await api.get(`/payments/verify/${txRef}`);
    return response.data.data.payment;
  },

  // Get my payments
  getMyPayments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentType?: string;
  }): Promise<{
    payments: Payment[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/payments/my-payments?${searchParams.toString()}`);
    return response.data.data;
  },

  // Get payment statistics (admin only)
  getPaymentStats: async (): Promise<PaymentStats> => {
    const response = await api.get('/payments/stats');
    return response.data.data;
  },

  // Refund payment (admin only)
  refundPayment: async (paymentId: string, reason: string): Promise<Payment> => {
    const response = await api.patch(`/payments/${paymentId}/refund`, { reason });
    return response.data.data.payment;
  },
};

