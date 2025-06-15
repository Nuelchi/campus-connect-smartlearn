
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConversationService } from "@/services/conversationService";
import { MessageService } from "@/services/messageService";

export function useCourseConversations() {
  const startCourseConversation = useCallback(async (courseId: string, userId: string) => {
    try {
      // Get course instructor
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("instructor_id, title")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;

      const conversationId = await ConversationService.getOrCreateConversation(userId, course.instructor_id);

      // Send initial message
      await MessageService.sendMessage(
        userId, 
        course.instructor_id, 
        `Hi! I'm interested in your course "${course.title}". Could you please provide more information?`
      );
      
      return conversationId;
    } catch (error) {
      console.error("Error starting course conversation:", error);
      throw error;
    }
  }, []);

  return {
    startCourseConversation
  };
}
