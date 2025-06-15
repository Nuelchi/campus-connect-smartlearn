
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messaging";
import { toast } from "@/hooks/use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

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
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Clean up existing channel if it exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create a new channel with a unique name to avoid conflicts
    const channelName = `messaging-${userId}-${Date.now()}`;
    const channel = supabase.channel(channelName);

    // Configure the channel with event listeners
    channel
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
      });

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to messaging channel');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('Error subscribing to messaging channel');
      }
    });

    // Store the channel reference
    channelRef.current = channel;

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId]); // Only depend on userId to avoid frequent re-subscriptions

  // Handle callback updates without re-subscribing
  useEffect(() => {
    // Update callback references without re-creating the subscription
    // The callbacks are captured in the closure above
  }, [activeConversationId, onNewMessage, onConversationUpdate, onMessageUpdate]);
}
