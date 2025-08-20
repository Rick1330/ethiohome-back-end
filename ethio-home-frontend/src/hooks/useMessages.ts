import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/services/message';
import { toast } from 'sonner';

export const useMessages = (params?: {
  page?: number;
  limit?: number;
  conversationWith?: string;
  messageType?: string;
}) => {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => messageService.getMessages(params),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageService.getConversations(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

export const useUnreadMessageCount = () => {
  return useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: () => messageService.getUnreadCount(),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: () => {
      toast.success('Message sent successfully');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};

export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark message as read');
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.deleteMessage,
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete message');
    },
  });
};

export const useArchiveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messageService.archiveConversation,
    onSuccess: () => {
      toast.success('Conversation archived');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to archive conversation');
    },
  });
};

export const useReplyToMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      messageService.replyToMessage(messageId, content),
    onSuccess: () => {
      toast.success('Reply sent successfully');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send reply');
    },
  });
};

