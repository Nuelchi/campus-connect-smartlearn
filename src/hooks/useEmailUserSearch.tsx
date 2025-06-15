
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type Profile = Tables<"profiles">;

export function useEmailUserSearch() {
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

  const resetSearch = () => {
    setEmail("");
    setFoundUser(null);
    setNotFound(false);
    setLoading(false);
  };

  return {
    email,
    setEmail,
    foundUser,
    loading,
    notFound,
    searchUserByEmail,
    resetSearch
  };
}
