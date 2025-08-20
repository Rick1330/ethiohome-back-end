import { api } from '@/lib/api';
import { AuthResponse, LoginCredentials, SignupData, User, ApiResponse } from '@/types';
import Cookies from 'js-cookie';

export const authService = {
  // User signup
  signup: async (data: SignupData): Promise<ApiResponse<null>> => {
    const response = await api.post('/users/signup', data);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (userId: string): Promise<ApiResponse<null>> => {
    const response = await api.patch(`/users/send/${userId}`);
    return response.data;
  },

  // Verify email
  verifyEmail: async (userId: string): Promise<AuthResponse> => {
    const response = await api.patch(`/users/verifyEmail/${userId}`);
    
    // Store auth data
    if (response.data.token) {
      Cookies.set('jwt', response.data.token, { expires: 7 }); // 7 days
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // User login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/users/login', credentials);
    
    // Store auth data
    if (response.data.token) {
      Cookies.set('jwt', response.data.token, { expires: 7 }); // 7 days
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // User logout
  logout: async (): Promise<void> => {
    try {
      await api.get('/users/logout');
    } finally {
      // Clear stored auth data regardless of API response
      Cookies.remove('jwt');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update current user profile
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.patch('/users/updateMe', data);
    
    // Update stored user data
    if (response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user || response.data.data));
    }
    
    return response.data;
  },

  // Update password
  updatePassword: async (data: {
    password: string;
    currentPassword: string;
    passwordConfirm: string;
  }): Promise<AuthResponse> => {
    const response = await api.patch('/users/updateMyPassword', data);
    
    // Update token if provided
    if (response.data.token) {
      Cookies.set('jwt', response.data.token, { expires: 7 });
    }
    
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await api.post('/users/forgotPassword', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, data: {
    password: string;
    passwordConfirm: string;
  }): Promise<AuthResponse> => {
    const response = await api.patch(`/users/resetPassword/${token}`, data);
    
    // Store auth data
    if (response.data.token) {
      Cookies.set('jwt', response.data.token, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Deactivate account
  deactivateAccount: async (): Promise<void> => {
    await api.delete('/users/deleteMe');
    
    // Clear stored auth data
    Cookies.remove('jwt');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = Cookies.get('jwt') || localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: (): User | null => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
};

