
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/messaging";

export class ConversationService {
  static async fetchConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getOrCreateConversation(userId: string, otherUserId: string): Promise<string> {
    // First check if conversation already exists
    const { data: existingConversation, error: fetchError } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(participant1_id.eq.${userId},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${userId})`)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation without sending initial message
    const { data: newConversation, error: createError } = await supabase
      .from("conversations")
      .insert({
        participant1_id: userId < otherUserId ? userId : otherUserId,
        participant2_id: userId < otherUserId ? otherUserId : userId,
      })
      .select("id")
      .single();

    if (createError) throw createError;

    return newConversation.id;
  }

  static async fetchUnreadCounts(conversations: Conversation[], userId: string): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    for (const conversation of conversations) {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", userId)
        .eq("is_read", false)
        .or(`and(sender_id.eq.${conversation.participant1_id},recipient_id.eq.${conversation.participant2_id}),and(sender_id.eq.${conversation.participant2_id},recipient_id.eq.${conversation.participant1_id})`);

      if (!error) {
        counts[conversation.id] = count || 0;
      }
    }

    return counts;
  }

  static async markMessagesAsRead(conversationId: string, userId: string, conversations: Conversation[]): Promise<void> {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("recipient_id", userId)
      .or(`and(sender_id.eq.${conversation.participant1_id},recipient_id.eq.${conversation.participant2_id}),and(sender_id.eq.${conversation.participant2_id},recipient_id.eq.${conversation.participant1_id})`);

    if (error) throw error;
  }
}
