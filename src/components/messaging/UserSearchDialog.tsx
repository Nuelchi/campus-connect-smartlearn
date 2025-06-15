
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type Profile = Tables<"profiles">;
type UserRole = Tables<"user_roles">;

interface UserSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string) => void;
}

export default function UserSearchDialog({
  open,
  onOpenChange,
  onSelectUser
}: UserSearchDialogProps) {
  const { user, role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<(Profile & { role: string })[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users based on search term and role restrictions
  const searchUsers = async () => {
    if (!user || !searchTerm.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    
    try {
      // Get profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .neq("id", user.id)
        .limit(10);

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Get roles for these users
      const userIds = profiles.map(p => p.id);
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .in("user_id", userIds);

      if (rolesError) throw rolesError;

      // Combine profiles with roles and filter based on current user's role
      const usersWithRoles = profiles.map(profile => {
        const userRole = userRoles?.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "user"
        };
      }).filter(userWithRole => {
        // Students can message teachers and other students
        // Teachers can message students and other teachers
        // Admins can message everyone
        if (role === "admin") return true;
        if (role === "student") return ["teacher", "student"].includes(userWithRole.role);
        if (role === "teacher") return ["student", "teacher"].includes(userWithRole.role);
        return true;
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    }
    
    setLoading(false);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, user, role]);

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
            <MessageCircle className="h-5 w-5" />
            Start New Conversation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {loading && (
            <div className="text-center py-4 text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading && searchTerm && users.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No users found
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2">
            {users.map((searchUser) => (
              <div
                key={searchUser.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => onSelectUser(searchUser.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(searchUser)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">
                      {getDisplayName(searchUser)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(searchUser.role)}`}>
                      {searchUser.role}
                    </span>
                  </div>
                  {searchUser.department && (
                    <p className="text-xs text-muted-foreground truncate">
                      {searchUser.department}
                    </p>
                  )}
                </div>
                
                <Button size="sm" variant="outline">
                  Chat
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
