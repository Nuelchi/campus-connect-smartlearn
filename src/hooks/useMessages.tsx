
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

type Message = Tables<"messages">;
type Conversation = Tables<"conversations">;

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch conversations for current user
  const fetchConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
    } else {
      setConversations(data || []);
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      // Filter messages for this specific conversation based on participants
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        const filteredMessages = data?.filter(msg => 
          (msg.sender_id === conversation.participant1_id && msg.recipient_id === conversation.participant2_id) ||
          (msg.sender_id === conversation.participant2_id && msg.recipient_id === conversation.participant1_id)
        ) || [];
        setMessages(filteredMessages);
      }
    }
  };

  // Send a new message
  const sendMessage = async (recipientId: string, content: string) => {
    if (!user) return;

    try {
      // Get or create conversation
      const { data: conversationId, error: convError } = await supabase
        .rpc("get_or_create_conversation", {
          user1_id: user.id,
          user2_id: recipientId
        });

      if (convError) throw convError;

      // Insert message
      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          content
        });

      if (messageError) throw messageError;

      // Update conversation's last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      // Refresh conversations
      fetchConversations();
      
      // If this is the active conversation, refresh messages
      if (activeConversationId === conversationId) {
        fetchMessages(conversationId);
      }

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Start a new conversation
  const startConversation = async (recipientId: string) => {
    if (!user) return;

    try {
      const { data: conversationId, error } = await supabase
        .rpc("get_or_create_conversation", {
          user1_id: user.id,
          user2_id: recipientId
        });

      if (error) throw error;

      // Refresh conversations
      await fetchConversations();
      
      // Set as active conversation
      setActiveConversationId(conversationId);
      
      return conversationId;
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // Mark messages as read
  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    // Find the conversation to get participants
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("recipient_id", user.id)
      .eq("is_read", false)
      .or(
        `sender_id.eq.${conversation.participant1_id}.and.recipient_id.eq.${conversation.participant2_id},sender_id.eq.${conversation.participant2_id}.and.recipient_id.eq.${conversation.participant1_id}`
      );
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messageChannel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          console.log("New message received:", payload);
          // Refresh conversations to update last message time
          fetchConversations();
          // If message is for active conversation, refresh messages
          if (activeConversationId) {
            fetchMessages(activeConversationId);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations"
        },
        (payload) => {
          console.log("Conversation updated:", payload);
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [user, activeConversationId]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchConversations();
      setLoading(false);
    }
  }, [user]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
      markAsRead(activeConversationId);
    }
  }, [activeConversationId, conversations]);

  return {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    loading,
    sendMessage,
    startConversation,
    markAsRead,
    refetchConversations: fetchConversations
  };
}
