import { api } from '@/lib/api';
import { Property, PropertyFormData, PropertyFilters, ApiResponse, PropertyStatsResponse } from '@/types';

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

  // Get single property by ID (alternative method name for consistency)
  getPropertyById: async (id: string): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data.data;
  },

  // Create new property
  createProperty: async (data: any): Promise<ApiResponse<Property>> => {
    const response = await api.post('/properties', data);
    return response.data;
  },

  // Update property
  updateProperty: async (id: string, data: any): Promise<ApiResponse<Property>> => {
    const response = await api.patch(`/properties/${id}`, data);
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

  // Get properties by owner (for sellers/agents)
  getPropertiesByOwner: async (ownerId: string, filters?: PropertyFilters): Promise<ApiResponse<Property[]>> => {
    const params = new URLSearchParams();
    params.append('owner', ownerId);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'owner') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/properties?${params.toString()}`);
    return response.data;
  },

  // Get my properties (for current user)
  getMyProperties: async (filters?: PropertyFilters): Promise<Property[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await api.get(`/properties/my-properties?${params.toString()}`);
    return response.data.data;
  },

  // Get pending properties for approval (Admin/Employee only)
  getPendingProperties: async (): Promise<Property[]> => {
    const response = await api.get('/properties?status=pending_approval');
    return response.data.data;
  },
};

