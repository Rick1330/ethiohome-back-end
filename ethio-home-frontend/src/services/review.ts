import { api } from '@/lib/api';
import { Review, ReviewFormData, ApiResponse } from '@/types';

export const reviewService = {
  // Submit review (Buyer only)
  submitReview: async (data: ReviewFormData): Promise<ApiResponse<Review>> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Get all reviews
  getReviews: async (params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Review[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/reviews${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get single review by ID
  getReview: async (id: string): Promise<ApiResponse<Review>> => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // Update review (if allowed)
  updateReview: async (id: string, data: Partial<ReviewFormData>): Promise<ApiResponse<Review>> => {
    const response = await api.patch(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review (if allowed)
  deleteReview: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },

  // Get reviews for a specific property
  getPropertyReviews: async (propertyId: string, params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Review[]>> => {
    const searchParams = new URLSearchParams();
    searchParams.append('property', propertyId);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'property') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/reviews${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get reviews by a specific buyer
  getBuyerReviews: async (buyerId: string, params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Review[]>> => {
    const searchParams = new URLSearchParams();
    searchParams.append('buyer', buyerId);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'buyer') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/reviews${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },
};

