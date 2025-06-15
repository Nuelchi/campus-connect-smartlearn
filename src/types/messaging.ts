
import { Tables } from "@/integrations/supabase/types";

export type Message = Tables<"messages">;
export type Conversation = Tables<"conversations">;

export interface MessageHookReturn {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  unreadCounts: Record<string, number>;
  loading: boolean;
  sendMessage: (recipientId: string, content: string) => Promise<void>;
  startConversation: (recipientId: string) => Promise<string | undefined>;
  startCourseConversation: (courseId: string) => Promise<string | undefined>;
  markAsRead: (conversationId: string) => Promise<void>;
  refetchConversations: () => Promise<void>;
}
