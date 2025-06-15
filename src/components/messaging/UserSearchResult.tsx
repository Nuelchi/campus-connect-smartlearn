
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface UserSearchResultProps {
  user: Profile & { role: string; email: string };
  onStartConversation: (userId: string) => void;
}

export default function UserSearchResult({ user, onStartConversation }: UserSearchResultProps) {
  const getDisplayName = (user: Profile) => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return "User";
  };

  const getInitials = (user: Profile) => {
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  };

  const getRoleBadgeColor = (userRole: string) => {
    switch (userRole) {
      case "teacher": return "bg-blue-100 text-blue-800";
      case "student": return "bg-green-100 text-green-800";
      case "admin": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials(user)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">
              {getDisplayName(user)}
            </p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {user.email}
          </p>
          {user.department && (
            <p className="text-xs text-muted-foreground">
              {user.department}
            </p>
          )}
        </div>
      </div>
      
      <Button 
        className="w-full mt-3" 
        onClick={() => onStartConversation(user.id)}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Start Conversation
      </Button>
    </div>
  );
}
