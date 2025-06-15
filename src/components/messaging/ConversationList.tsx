
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UnreadIndicator from "./UnreadIndicator";

type Conversation = Tables<"conversations">;
type Profile = Tables<"profiles">;

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  unreadCounts?: Record<string, number>;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  unreadCounts = {}
}: ConversationListProps) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  // Fetch profiles for conversation participants
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!conversations.length) return;

      const userIds = new Set<string>();
      conversations.forEach(conv => {
        userIds.add(conv.participant1_id);
        userIds.add(conv.participant2_id);
      });

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", Array.from(userIds));

      if (!error && data) {
        const profileMap: Record<string, Profile> = {};
        data.forEach(profile => {
          profileMap[profile.id] = profile;
        });
        setProfiles(profileMap);
      }
    };

    fetchProfiles();
  }, [conversations]);

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    const otherUserId = conversation.participant1_id === user.id 
      ? conversation.participant2_id 
      : conversation.participant1_id;
    return profiles[otherUserId];
  };

  const getEmailInitials = (email: string, count: number = 4): string => {
    return email.split('@')[0].substring(0, count).toUpperCase();
  };

  const getDisplayName = (profile: Profile | null) => {
    if (!profile) return "Unknown User";

    // First priority: username
    if (profile.username) {
      return profile.username;
    }

    // Second priority: first + last name
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }

    // Third priority: would need email from auth, but we'll just show "User" for now
    return "User";
  };

  const getInitials = (profile: Profile | null) => {
    if (!profile) return "U";

    // First try username initials
    if (profile.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }

    // Then try first + last name initials
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
    }

    return "U";
  };

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No conversations yet</p>
        <p className="text-sm">Start a new chat to get started</p>
      </div>
    );
  }

  return (
    <div className="max-h-[500px] overflow-y-auto">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const displayName = getDisplayName(otherParticipant);
        const initials = getInitials(otherParticipant);
        const unreadCount = unreadCounts[conversation.id] || 0;
        
        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 border-b border-border/50 relative",
              activeConversationId === conversation.id && "bg-muted"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <UnreadIndicator count={unreadCount} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm truncate">{displayName}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.last_message_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {otherParticipant?.department || "Click to start chatting"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
