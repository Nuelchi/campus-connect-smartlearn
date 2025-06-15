
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

type Message = Tables<"messages">;
type Conversation = Tables<"conversations">;

export function useWebSocketMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

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
      // Fetch unread counts for each conversation
      fetchUnreadCounts(data || []);
    }
  };

  // Fetch unread message counts
  const fetchUnreadCounts = async (convs: Conversation[]) => {
    if (!user) return;

    const counts: Record<string, number> = {};
    
    for (const conv of convs) {
      const otherParticipant = conv.participant1_id === user.id 
        ? conv.participant2_id 
        : conv.participant1_id;

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", otherParticipant)
        .eq("recipient_id", user.id)
        .eq("is_read", false);

      if (!error && count !== null) {
        counts[conv.id] = count;
      }
    }
    
    setUnreadCounts(counts);
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `sender_id.eq.${conversation.participant1_id}.and.recipient_id.eq.${conversation.participant2_id},sender_id.eq.${conversation.participant2_id}.and.recipient_id.eq.${conversation.participant1_id}`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data || []);
    }
  };

  // Set up realtime subscriptions using Supabase channel
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messaging')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as Message;
        
        // Check if message is for current user
        if (newMessage.recipient_id === user.id) {
          toast({
            title: "New message",
            description: "You have received a new message",
          });
          
          // Refresh conversations and unread counts
          fetchConversations();
          
          // If message is for active conversation, add to messages
          if (activeConversationId) {
            fetchMessages(activeConversationId);
          }
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations'
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversationId]);

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

  // Start a conversation with a course teacher
  const startCourseConversation = async (courseId: string) => {
    if (!user) return;

    try {
      // Get course instructor
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("instructor_id, title")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      const { data: conversationId, error } = await supabase
        .rpc("get_or_create_conversation", {
          user1_id: user.id,
          user2_id: course.instructor_id
        });

      if (error) throw error;

      // Send initial message
      await sendMessage(course.instructor_id, `Hi! I'm interested in your course "${course.title}". Could you please provide more information?`);

      // Refresh conversations
      await fetchConversations();
      
      // Set as active conversation
      setActiveConversationId(conversationId);
      
      return conversationId;
    } catch (error) {
      console.error("Error starting course conversation:", error);
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

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const otherParticipant = conversation.participant1_id === user.id 
      ? conversation.participant2_id 
      : conversation.participant1_id;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", otherParticipant)
      .eq("recipient_id", user.id)
      .eq("is_read", false);

    // Update unread counts
    setUnreadCounts(prev => ({
      ...prev,
      [conversationId]: 0
    }));
  };

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
    unreadCounts,
    loading,
    sendMessage,
    startConversation,
    startCourseConversation,
    markAsRead,
    refetchConversations: fetchConversations
  };
}
