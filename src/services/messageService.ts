
import { supabase } from "@/integrations/supabase/client";
import { Message, Conversation } from "@/types/messaging";

export class MessageService {
  static async fetchMessages(conversationId: string, conversations: Conversation[]): Promise<Message[]> {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) {
      console.log("Conversation not found:", conversationId);
      return [];
    }

    console.log("Fetching messages for conversation participants:", {
      participant1: conversation.participant1_id,
      participant2: conversation.participant2_id
    });

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${conversation.participant1_id},recipient_id.eq.${conversation.participant2_id}),and(sender_id.eq.${conversation.participant2_id},recipient_id.eq.${conversation.participant1_id})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    
    console.log("Fetched messages from database:", data);
    return data || [];
  }

  static async sendMessage(senderId: string, recipientId: string, content: string): Promise<void> {
    console.log("Sending message:", { senderId, recipientId, content });
    
    // Insert message
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content
      });

    if (messageError) {
      console.error("Error inserting message:", messageError);
      throw messageError;
    }

    // Get or create conversation
    const { data: conversationId, error: convError } = await supabase
      .rpc("get_or_create_conversation", {
        user1_id: senderId,
        user2_id: recipientId
      });

    if (convError) {
      console.error("Error getting/creating conversation:", convError);
      throw convError;
    }

    console.log("Message sent successfully, conversation ID:", conversationId);

    // Update conversation's last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
  }
}
