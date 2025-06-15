
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

    try {
      const conversationsData = await ConversationService.fetchConversations(user.id);
      setConversations(conversationsData);
      
      // Fetch unread counts for each conversation
      const counts = await ConversationService.fetchUnreadCounts(conversationsData, user.id);
      setUnreadCounts(counts);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [user]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      console.log("Fetching messages for conversation:", conversationId);
      const messagesData = await MessageService.fetchMessages(conversationId, conversations);
      console.log("Fetched messages:", messagesData);
      setMessages(messagesData);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [user, conversations]);

  // Send a new message
  const sendMessage = useCallback(async (recipientId: string, content: string) => {
    if (!user) return;

    try {
      await MessageService.sendMessage(user.id, recipientId, content);

      // Refresh conversations to update last_message_at
      await fetchConversations();
      
      // If this is the active conversation, refresh messages immediately
      if (activeConversationId) {
        await fetchMessages(activeConversationId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
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
      throw error;
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
      throw error;
    }
  }, [user, handleCourseConversation, fetchConversations]);

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      await ConversationService.markMessagesAsRead(conversationId, user.id, conversations);

      // Update unread counts
      setUnreadCounts(prev => ({
        ...prev,
        [conversationId]: 0
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }, [user, conversations]);

  // Set up realtime subscriptions
  useMessageSubscriptions({
    userId: user?.id || null,
    activeConversationId,
    onNewMessage: () => {
      console.log("New message received, refreshing conversations");
      fetchConversations();
    },
    onConversationUpdate: () => {
      console.log("Conversation updated, refreshing conversations");
      fetchConversations();
    },
    onMessageUpdate: () => {
      console.log("Message updated, refreshing messages for active conversation");
      if (activeConversationId) {
        fetchMessages(activeConversationId);
      }
    }
  });

  // Initial load
  useEffect(() => {
    if (user) {
      console.log("User available, fetching conversations");
      fetchConversations();
      setLoading(false);
    }
  }, [user, fetchConversations]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      console.log("Active conversation changed to:", activeConversationId);
      fetchMessages(activeConversationId);
      markAsRead(activeConversationId);
    } else {
      // Clear messages when no conversation is selected
      setMessages([]);
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
