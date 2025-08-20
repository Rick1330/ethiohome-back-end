import { api } from '@/lib/api';

export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  subject: string;
  content: string;
  relatedProperty?: {
    id: string;
    title: string;
    location: string;
    price: number;
  };
  relatedInterest?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  messageType: 'inquiry' | 'response' | 'general';
}

export interface MessageStats {
  sentCount: number;
  receivedCount: number;
  unreadCount: number;
  conversations: Array<{
    partner: {
      _id: string;
      name: string;
      email: string;
      role: string;
    };
    lastMessage: string;
    messageCount: number;
    unreadCount: number;
  }>;
}

export const messageService = {
  // Get messages
  getMessages: async (params?: {
    page?: number;
    limit?: number;
    conversationWith?: string;
    messageType?: string;
  }): Promise<{
    messages: Message[];
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
    
    const response = await api.get(`/messages/my-messages?${searchParams.toString()}`);
    return response.data.data;
  },

  // Get conversations
  getConversations: async (): Promise<{
    conversations: Array<{
      partner: {
        _id: string;
        name: string;
        email: string;
        role: string;
      };
      lastMessage: string;
      messageCount: number;
      unreadCount: number;
    }>;
  }> => {
    const response = await api.get('/messages/conversations');
    return response.data.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/messages/unread-count');
    return response.data.data.count;
  },

  // Get conversation with a specific user
  getConversation: async (userId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    messages: Message[];
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
    
    const response = await api.get(`/messages/conversation/${userId}?${searchParams.toString()}`);
    return response.data.data;
  },

  // Send a new message
  sendMessage: async (data: {
    recipient: string;
    subject: string;
    content: string;
    relatedProperty?: string;
    relatedInterest?: string;
    priority?: 'low' | 'medium' | 'high';
    messageType?: 'inquiry' | 'response' | 'general';
  }): Promise<Message> => {
    const response = await api.post('/messages/send', data);
    return response.data.data.message;
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<Message> => {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data.data.message;
  },

  // Mark conversation as read
  markConversationAsRead: async (userId: string): Promise<void> => {
    await api.patch(`/messages/conversation/${userId}/read`);
  },

  // Delete message
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(`/messages/${messageId}`);
  },

  // Archive conversation
  archiveConversation: async (userId: string): Promise<void> => {
    await api.patch(`/messages/conversation/${userId}/archive`);
  },

  // Reply to message
  replyToMessage: async (messageId: string, content: string): Promise<Message> => {
    const response = await api.post(`/messages/${messageId}/reply`, { content });
    return response.data.data.message;
  },

  // Get message statistics
  getMessageStats: async (): Promise<MessageStats> => {
    const response = await api.get('/messages/stats');
    return response.data.data;
  },
};

