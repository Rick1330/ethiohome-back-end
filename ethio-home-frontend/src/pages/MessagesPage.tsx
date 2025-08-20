import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCenter } from '@/components/messaging/MessageCenter';
import { 
  useMessages, 
  useConversations,
  useSendMessage,
  useMarkMessageAsRead,
  useDeleteMessage 
} from '@/hooks/useMessages';

export const MessagesPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedConversation, setSelectedConversation] = useState<string>();
  
  const { data: messagesData, isLoading: messagesLoading } = useMessages({
    conversationWith: selectedConversation
  });
  const { data: conversationsData, isLoading: conversationsLoading } = useConversations();
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessageAsRead();
  const deleteMessageMutation = useDeleteMessage();

  const messages = messagesData?.messages || [];
  const conversations = conversationsData?.conversations || [];

  const handleSelectConversation = (userId: string) => {
    setSelectedConversation(userId);
  };

  const handleSendMessage = (data: {
    recipient: string;
    subject: string;
    content: string;
    relatedProperty?: string;
    relatedInterest?: string;
    priority?: 'low' | 'medium' | 'high';
    messageType?: 'inquiry' | 'response' | 'general';
  }) => {
    sendMessageMutation.mutate(data);
  };

  const handleMarkAsRead = (messageId: string) => {
    markAsReadMutation.mutate(messageId);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MessageCenter
          messages={messages}
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          onSendMessage={handleSendMessage}
          onMarkAsRead={handleMarkAsRead}
          onDeleteMessage={handleDeleteMessage}
          isLoading={messagesLoading || conversationsLoading}
        />
      </div>
    </div>
  );
};

