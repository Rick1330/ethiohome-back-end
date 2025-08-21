import { api } from '@/lib/api';
import { Property, PropertyFilters, ApiResponse, PropertyStatsResponse } from '@/types';

export const propertyService = {
  // Get all properties with filters
  getProperties: async (filters?: PropertyFilters): Promise<ApiResponse<Property[]>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get single property by ID
  getProperty: async (id: string): Promise<ApiResponse<Property>> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  // Create new property with FormData for image uploads
  createProperty: async (data: FormData): Promise<ApiResponse<Property>> => {
    const response = await api.post('/properties', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property with FormData for image uploads
  updateProperty: async (id: string, data: FormData): Promise<ApiResponse<Property>> => {
    const response = await api.patch(`/properties/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },

  // Verify property (Admin/Employee only)
  verifyProperty: async (id: string, action: 'approve' | 'reject', notes?: string): Promise<ApiResponse<Property>> => {
    const response = await api.patch(`/properties/${id}/verify`, { action, notes });
    return response.data;
  },

  // Get property statistics (Admin/Employee only)
  getPropertyStats: async (): Promise<PropertyStatsResponse> => {
    const response = await api.get('/properties/property-stats');
    return response.data;
  },
};
