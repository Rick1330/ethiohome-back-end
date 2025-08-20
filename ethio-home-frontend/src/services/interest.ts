import { api } from '@/lib/api';
import { InterestForm, InterestFormData, ApiResponse } from '@/types';

export const interestService = {
  // Submit interest form (Buyer)
  submitInterest: async (data: InterestFormData): Promise<ApiResponse<InterestForm>> => {
    const response = await api.post('/interests', data);
    return response.data;
  },

  // Get all interest forms for current buyer
  getBuyerInterests: async (): Promise<ApiResponse<InterestForm[]>> => {
    const response = await api.get('/interest/buyer');
    return response.data;
  },

  // Get single interest form for buyer
  getBuyerInterest: async (id: string): Promise<ApiResponse<InterestForm>> => {
    const response = await api.get(`/interest/buyer/${id}`);
    return response.data;
  },

  // Update interest form (Buyer)
  updateBuyerInterest: async (id: string, data: Partial<InterestFormData>): Promise<ApiResponse<InterestForm>> => {
    const response = await api.patch(`/interest/buyer/${id}`, data);
    return response.data;
  },

  // Delete interest form (Buyer)
  deleteBuyerInterest: async (id: string): Promise<void> => {
    await api.delete(`/interest/buyer/${id}`);
  },

  // Get all interest forms for a specific property (Admin/Employee/Seller/Agent)
  getPropertyInterests: async (propertyId: string, params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<InterestForm[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/properties/${propertyId}/interest${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get all interest forms for properties owned by a seller
  getSellerInterests: async (ownerId: string, params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<InterestForm[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/interest/${ownerId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Update interest form status (Admin/Employee/Seller/Agent)
  updateInterestStatus: async (id: string, data: {
    status?: 'pending' | 'contacted' | 'schedule' | 'visited' | 'rejected';
    visitScheduled?: boolean;
    visitDate?: string;
  }): Promise<ApiResponse<InterestForm>> => {
    // Note: The API documentation shows /interest/buyer/:id for buyer updates
    // For admin/employee/seller/agent updates, we might need a different endpoint
    // Assuming there's a general update endpoint for authorized roles
    const response = await api.patch(`/interests/${id}`, data);
    return response.data;
  },
};

