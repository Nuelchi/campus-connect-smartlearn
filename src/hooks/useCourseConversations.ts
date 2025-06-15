
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConversationService } from "@/services/conversationService";
import { MessageService } from "@/services/messageService";

export function useCourseConversations() {
  const startCourseConversation = useCallback(async (courseId: string, userId: string) => {
    try {
      console.log("Starting course conversation for courseId:", courseId, "userId:", userId);
      
      // Get course instructor
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("instructor_id, title")
        .eq("id", courseId)
        .single();

      if (courseError) {
        console.error("Error fetching course:", courseError);
        throw courseError;
      }

      if (!course) {
        throw new Error("Course not found");
      }

      console.log("Course found:", course);

      // Check if user is trying to message themselves
      if (course.instructor_id === userId) {
        throw new Error("You cannot message yourself");
      }

      const conversationId = await ConversationService.getOrCreateConversation(userId, course.instructor_id);
      console.log("Conversation created/found:", conversationId);

      // Send initial message about the course
      await MessageService.sendMessage(
        userId, 
        course.instructor_id, 
        `Hi! I'm interested in your course "${course.title}". Could you please provide more information?`
      );
      
      console.log("Initial message sent successfully");
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
