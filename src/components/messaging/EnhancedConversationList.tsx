import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Conversation } from "@/types/messaging";
import UnreadIndicator from "./UnreadIndicator";

interface ConversationWithDetails extends Conversation {
  otherParticipant?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
  };
  course?: {
    id: string;
    title: string;
    instructor_name: string | null;
  };
}

interface GroupedConversations {
  [courseId: string]: {
    course: { id: string; title: string; instructor_name: string | null };
    conversations: ConversationWithDetails[];
  };
}

interface EnhancedConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  unreadCounts: Record<string, number>;
}

export default function EnhancedConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  unreadCounts
}: EnhancedConversationListProps) {
  const { user } = useAuth();
  const [conversationsWithDetails, setConversationsWithDetails] = useState<ConversationWithDetails[]>([]);
  const [groupedConversations, setGroupedConversations] = useState<GroupedConversations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && conversations.length > 0) {
      fetchConversationDetails();
    }
  }, [user, conversations]);

  const fetchConversationDetails = async () => {
    if (!user) return;

    try {
      const detailedConversations: ConversationWithDetails[] = [];

      for (const conversation of conversations) {
        // Get the other participant's details
        const otherParticipantId = conversation.participant1_id === user.id 
          ? conversation.participant2_id 
          : conversation.participant1_id;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, username")
          .eq("id", otherParticipantId)
          .single();

        // Find course connection between teacher and student
        let courseInfo = null;
        
        // Get teacher's courses
        const { data: teacherCourses } = await supabase
          .from("courses")
          .select("id, title, instructor_id")
          .eq("instructor_id", user.id);

        if (teacherCourses && teacherCourses.length > 0) {
          // Check if the other participant is enrolled in any of these courses
          const { data: enrollment } = await supabase
            .from("enrollments")
            .select("course_id, courses(id, title, instructor_id)")
            .eq("student_id", otherParticipantId)
            .in("course_id", teacherCourses.map(c => c.id))
            .limit(1)
            .single();

          if (enrollment && enrollment.courses) {
            // Get instructor profile information separately
            const { data: instructorProfile } = await supabase
              .from("profiles")
              .select("first_name, last_name, username")
              .eq("id", enrollment.courses.instructor_id)
              .single();

            const instructorName = instructorProfile?.username || 
              (instructorProfile?.first_name || instructorProfile?.last_name 
                ? `${instructorProfile.first_name || ""} ${instructorProfile.last_name || ""}`.trim()
                : null);

            courseInfo = {
              id: enrollment.courses.id,
              title: enrollment.courses.title,
              instructor_name: instructorName
            };
          }
        }

        detailedConversations.push({
          ...conversation,
          otherParticipant: profile || undefined,
          course: courseInfo || undefined
        });
      }

      setConversationsWithDetails(detailedConversations);
      
      // Group conversations by course
      const grouped: GroupedConversations = {};
      
      detailedConversations.forEach(conv => {
        const courseId = conv.course?.id || 'general';
        const courseTitle = conv.course?.title || 'General Messages';
        const instructorName = conv.course?.instructor_name || null;
        
        if (!grouped[courseId]) {
          grouped[courseId] = {
            course: { id: courseId, title: courseTitle, instructor_name: instructorName },
            conversations: []
          };
        }
        
        grouped[courseId].conversations.push(conv);
      });

      setGroupedConversations(grouped);
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (participant?: { id: string; first_name: string | null; last_name: string | null; username: string | null }) => {
    if (!participant) return "Unknown User";

    // First priority: username
    if (participant.username) {
      return participant.username;
    }

    // Second priority: first + last name
    if (participant.first_name || participant.last_name) {
      return `${participant.first_name || ""} ${participant.last_name || ""}`.trim();
    }

    return "User";
  };

  const getInitials = (participant?: { id: string; first_name: string | null; last_name: string | null; username: string | null }) => {
    if (!participant) return "U";

    // First try username initials
    if (participant.username) {
      return participant.username.substring(0, 2).toUpperCase();
    }

    // Then try first + last name initials
    const firstName = participant.first_name || "";
    const lastName = participant.last_name || "";
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
    }

    return "U";
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading conversations...
      </div>
    );
  }

  if (Object.keys(groupedConversations).length === 0) {
    return (
      <div className="p-8 text-center">
        <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
        <p className="text-muted-foreground text-sm">
          Students will appear here when they message you about courses
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {Object.entries(groupedConversations).map(([courseId, group]) => (
          <div key={courseId}>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  {group.course.title}
                </h4>
                {group.course.instructor_name && (
                  <p className="text-xs text-muted-foreground/70">
                    Instructor: {group.course.instructor_name}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="text-xs ml-auto">
                {group.conversations.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {group.conversations.map((conversation) => {
                const unreadCount = unreadCounts[conversation.id] || 0;
                const isActive = activeConversationId === conversation.id;
                const displayName = getDisplayName(conversation.otherParticipant);
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                      isActive 
                        ? "bg-primary/10 border-primary/20" 
                        : "hover:bg-muted/50 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm">
                          {getInitials(conversation.otherParticipant)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <h5 className="font-medium text-sm truncate">
                              {displayName}
                            </h5>
                            {conversation.otherParticipant?.first_name || conversation.otherParticipant?.last_name ? (
                              <p className="text-xs text-muted-foreground">
                                {conversation.otherParticipant.first_name} {conversation.otherParticipant.last_name}
                              </p>
                            ) : null}
                          </div>
                          {unreadCount > 0 && (
                            <UnreadIndicator count={unreadCount} />
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          Last message: {new Date(conversation.last_message_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
