
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/messaging";

export class ConversationService {
  static async fetchConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return [];
    }
    
    return data || [];
  }

  static async fetchUnreadCounts(conversations: Conversation[], userId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    
    for (const conv of conversations) {
      const otherParticipant = conv.participant1_id === userId 
        ? conv.participant2_id 
        : conv.participant1_id;

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", otherParticipant)
        .eq("recipient_id", userId)
        .eq("is_read", false);

      if (!error && count !== null) {
        counts[conv.id] = count;
      }
    }
    
    return counts;
  }

  static async getOrCreateConversation(user1Id: string, user2Id: string): Promise<string> {
    const { data: conversationId, error } = await supabase
      .rpc("get_or_create_conversation", {
        user1_id: user1Id,
        user2_id: user2Id
      });

    if (error) throw error;
    return conversationId;
  }

  static async markMessagesAsRead(conversationId: string, userId: string, conversations: Conversation[]): Promise<void> {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const otherParticipant = conversation.participant1_id === userId 
      ? conversation.participant2_id 
      : conversation.participant1_id;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", otherParticipant)
      .eq("recipient_id", userId)
      .eq("is_read", false);
  }
}
