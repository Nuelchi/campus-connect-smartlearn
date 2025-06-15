
import { supabase } from "@/integrations/supabase/client";
import { Message, Conversation } from "@/types/messaging";

export class MessageService {
  static async fetchMessages(conversationId: string, conversations: Conversation[]): Promise<Message[]> {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return [];

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `sender_id.eq.${conversation.participant1_id}.and.recipient_id.eq.${conversation.participant2_id},sender_id.eq.${conversation.participant2_id}.and.recipient_id.eq.${conversation.participant1_id}`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    
    return data || [];
  }

  static async sendMessage(senderId: string, recipientId: string, content: string): Promise<void> {
    // Insert message
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content
      });

    if (messageError) throw messageError;

    // Get or create conversation
    const { data: conversationId, error: convError } = await supabase
      .rpc("get_or_create_conversation", {
        user1_id: senderId,
        user2_id: recipientId
      });

    if (convError) throw convError;

    // Update conversation's last_message_at
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
  }
}
