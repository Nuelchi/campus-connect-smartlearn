
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Message = Tables<"messages">;
type Conversation = Tables<"conversations">;
type Profile = Tables<"profiles">;

interface ChatWindowProps {
  messages: Message[];
  conversationId: string;
  conversations: Conversation[];
}

export default function ChatWindow({ messages, conversationId, conversations }: ChatWindowProps) {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch profiles for message senders
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!messages.length) return;

      const userIds = new Set(messages.map(msg => msg.sender_id));
      
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
  }, [messages]);

  // Get conversation info for header
  const conversation = conversations.find(c => c.id === conversationId);
  const otherParticipant = conversation && user 
    ? conversation.participant1_id === user.id 
      ? conversation.participant2_id 
      : conversation.participant1_id
    : null;

  const otherProfile = otherParticipant ? profiles[otherParticipant] : null;

  const getDisplayName = (profile: Profile | null) => {
    if (!profile) return "Unknown User";
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return "User";
  };

  const getInitials = (profile: Profile | null) => {
    if (!profile) return "U";
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      {otherProfile && (
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(otherProfile)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{getDisplayName(otherProfile)}</h3>
            <p className="text-sm text-muted-foreground">
              {otherProfile.department || "Student/Teacher"}
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender_id === user?.id;
            const senderProfile = profiles[message.sender_id];
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {!isOwnMessage && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {getInitials(senderProfile)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 break-words",
                    isOwnMessage
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
