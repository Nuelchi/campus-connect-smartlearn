
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type Profile = Tables<"profiles">;

interface UserSearchByEmailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string) => void;
}

export default function UserSearchByEmail({
  open,
  onOpenChange,
  onSelectUser
}: UserSearchByEmailProps) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState<(Profile & { role: string; email: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchUserByEmail = async () => {
    if (!email.trim() || !user) {
      return;
    }

    setLoading(true);
    setNotFound(false);
    setFoundUser(null);
    
    try {
      // Search by first/last name containing email-like pattern as fallback
      const emailUsername = email.split('@')[0];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .or(`first_name.ilike.%${emailUsername}%,last_name.ilike.%${emailUsername}%`)
        .neq("id", user.id)
        .limit(1);

      if (profilesError) throw profilesError;

      if (profiles && profiles.length > 0) {
        const profile = profiles[0];
        
        // Get role for this user
        const { data: userRole, error: roleError } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", profile.id)
          .single();

        if (!roleError && userRole) {
          setFoundUser({
            ...profile,
            role: userRole.role,
            email: email // Use the searched email as display
          });
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }

    } catch (error) {
      console.error("Error searching user:", error);
      setNotFound(true);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUserByEmail();
    }
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Find User by Email
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                type="email"
              />
            </div>
            <Button onClick={searchUserByEmail} disabled={!email.trim() || loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {loading && (
            <div className="text-center py-4 text-muted-foreground">
              Searching for user...
            </div>
          )}

          {notFound && !loading && (
            <div className="text-center py-4 text-muted-foreground">
              No user found with email "{email}"
            </div>
          )}

          {foundUser && !loading && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(foundUser)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      {getDisplayName(foundUser)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(foundUser.role)}`}>
                      {foundUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {foundUser.email}
                  </p>
                  {foundUser.department && (
                    <p className="text-xs text-muted-foreground">
                      {foundUser.department}
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                className="w-full mt-3" 
                onClick={() => onSelectUser(foundUser.id)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Conversation
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
