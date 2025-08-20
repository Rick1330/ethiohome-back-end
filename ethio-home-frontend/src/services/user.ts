import { api } from '@/lib/api';
import { User, ApiResponse } from '@/types';

export const userService = {
  // Get all users (Admin/Employee only)
  getAllUsers: async (params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<User[]>> => {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Create user (Admin only)
  createUser: async (data: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phone: string;
    role?: 'admin' | 'buyer' | 'seller' | 'agent' | 'employee';
  }): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  // Get user by ID (Admin/Employee only)
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user by ID (Admin/Employee only)
  updateUserById: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },

  // Delete user by ID (Admin only)
  deleteUserById: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  // Upload user photo
  uploadUserPhoto: async (photo: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('photo', photo);
    
    const response = await api.patch('/users/updateMe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role: string, params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<User[]>> => {
    const searchParams = new URLSearchParams();
    searchParams.append('role', role);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'role') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Search users
  searchUsers: async (query: string, params?: {
    sort?: string;
    fields?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<User[]>> => {
    const searchParams = new URLSearchParams();
    searchParams.append('search', query);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && key !== 'search') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = searchParams.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },
};

