
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messaging";
import { toast } from "@/hooks/use-toast";

interface UseMessageSubscriptionsProps {
  userId: string | null;
  activeConversationId: string | null;
  onNewMessage: () => void;
  onConversationUpdate: () => void;
  onMessageUpdate: () => void;
}

export function useMessageSubscriptions({
  userId,
  activeConversationId,
  onNewMessage,
  onConversationUpdate,
  onMessageUpdate
}: UseMessageSubscriptionsProps) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('messaging')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as Message;
        
        // Check if message is for current user
        if (newMessage.recipient_id === userId) {
          toast({
            title: "New message",
            description: "You have received a new message",
          });
          
          // Refresh conversations and unread counts
          onNewMessage();
          
          // If message is for active conversation, add to messages
          if (activeConversationId) {
            onMessageUpdate();
          }
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations'
      }, () => {
        onConversationUpdate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, activeConversationId, onNewMessage, onConversationUpdate, onMessageUpdate]);
}
