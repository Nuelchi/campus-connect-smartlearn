
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { ConversationService } from "@/services/conversationService";
import { MessageService } from "@/services/messageService";
import { useMessageSubscriptions } from "./useMessageSubscriptions";
import { useCourseConversations } from "./useCourseConversations";
import { Message, Conversation, MessageHookReturn } from "@/types/messaging";

export function useWebSocketMessages(): MessageHookReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { startCourseConversation: handleCourseConversation } = useCourseConversations();

  // Fetch conversations for current user
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    const conversationsData = await ConversationService.fetchConversations(user.id);
    setConversations(conversationsData);
    
    // Fetch unread counts for each conversation
    const counts = await ConversationService.fetchUnreadCounts(conversationsData, user.id);
    setUnreadCounts(counts);
  }, [user]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    const messagesData = await MessageService.fetchMessages(conversationId, conversations);
    setMessages(messagesData);
  }, [user, conversations]);

  // Send a new message
  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!user) return;

    try {
      await MessageService.sendMessage(user.id, recipientId, content);

      // Refresh conversations
      await fetchConversations();
      
      // If this is the active conversation, refresh messages
      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [user, activeConversationId, fetchConversations, fetchMessages]);

  // Start a new conversation
  const startConversation = useCallback(async (recipientId: string) => {
    if (!user) return;

    try {
      const conversationId = await ConversationService.getOrCreateConversation(user.id, recipientId);

      // Refresh conversations
      await fetchConversations();
      
      // Set as active conversation
      setActiveConversationId(conversationId);
      
      return conversationId;
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  }, [user, fetchConversations]);

  // Start a conversation with a course teacher
  const startCourseConversation = useCallback(async (courseId: string) => {
    if (!user) return;

    try {
      const conversationId = await handleCourseConversation(courseId, user.id);

      // Refresh conversations
      await fetchConversations();
      
      // Set as active conversation
      setActiveConversationId(conversationId);
      
      return conversationId;
    } catch (error) {
      console.error("Error starting course conversation:", error);
    }
  }, [user, handleCourseConversation, fetchConversations]);

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    await ConversationService.markMessagesAsRead(conversationId, user.id, conversations);

    // Update unread counts
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: 0
    }));
  }, [user, conversations]);

  // Set up realtime subscriptions
  useMessageSubscriptions({
    userId: user?.id || null,
    activeConversationId,
    onNewMessage: fetchConversations,
    onConversationUpdate: fetchConversations,
    onMessageUpdate: () => {
      if (activeConversationId) {
        fetchMessages(activeConversationId);
      }
    }
  });

  // Initial load
  useEffect(() => {
    if (user) {
      fetchConversations();
      setLoading(false);
    }
  }, [user, fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      markAsRead(activeConversationId);
    }
  }, [activeConversationId, fetchMessages, markAsRead]);

  return {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    unreadCounts,
    loading,
    sendMessage,
    startConversation,
    startCourseConversation,
    markAsRead,
    refetchConversations: fetchConversations
  };
}
