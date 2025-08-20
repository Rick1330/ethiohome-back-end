import { api } from '@/lib/api';
import { Transaction, PaymentData, ApiResponse } from '@/types';

export const sellingService = {
  // Initiate payment
  initiatePayment: async (data: PaymentData): Promise<ApiResponse<{ checkout_url: string }>> => {
    const response = await api.post('/selling/process-payment', data);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get(`/selling/${id}`);
    return response.data;
  },

  // Get all transactions (Admin only)
  getAllTransactions: async (params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Transaction[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/selling${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get single transaction
  getTransaction: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get(`/selling/${id}`);
    return response.data;
  },

  // Get transactions for current user (buyer)
  getUserTransactions: async (params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Transaction[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/selling/my-transactions${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Handle payment webhook (this would typically be server-side only)
  // Including for completeness but frontend shouldn't call this directly
  handlePaymentWebhook: async (webhookData: any): Promise<ApiResponse<Transaction>> => {
    const response = await api.post('/selling/verify-payment/webhook', webhookData);
    return response.data;
  },
};

