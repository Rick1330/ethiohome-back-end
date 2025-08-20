import { api } from '@/lib/api';

export interface Notification {
  id: string;
  recipient: string;
  sender?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  type: 'interest' | 'review' | 'property_approved' | 'property_rejected' | 'payment_success' | 'payment_failed' | 'message' | 'system';
  title: string;
  message: string;
  relatedProperty?: {
    id: string;
    title: string;
    location: string;
    price: number;
  };
  relatedInterest?: string;
  relatedReview?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationStats {
  totalNotifications: number;
  totalUnread: number;
  byType: Array<{
    _id: string;
    count: number;
    unreadCount: number;
  }>;
}

export const notificationService = {
  // Get notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    read?: boolean;
    type?: string;
  }): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
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
    
    const response = await api.get(`/notifications/my-notifications?${searchParams.toString()}`);
    return response.data.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data.data.notification;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/mark-all-read');
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Create notification (admin/system use)
  createNotification: async (data: {
    recipient: string;
    type: string;
    title: string;
    message: string;
    relatedProperty?: string;
    relatedInterest?: string;
    relatedReview?: string;
    priority?: 'low' | 'medium' | 'high';
  }): Promise<Notification> => {
    const response = await api.post('/notifications/send', data);
    return response.data.data.notification;
  },

  // Get notification preferences
  getPreferences: async (): Promise<any> => {
    const response = await api.get('/notifications/preferences');
    return response.data.data;
  },

  // Update notification preferences
  updatePreferences: async (preferences: any): Promise<any> => {
    const response = await api.patch('/notifications/preferences', preferences);
    return response.data.data;
  },

  // Get notification statistics
  getNotificationStats: async (): Promise<NotificationStats> => {
    const response = await api.get('/notifications/stats');
    return response.data.data;
  },
};

