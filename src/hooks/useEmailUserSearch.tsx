
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";

type Profile = Tables<"profiles">;

interface SearchUserResult {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  department: string;
  role: string;
}

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
      // Use the new database function to search by email
      const { data, error } = await supabase
        .rpc("search_user_by_email" as any, {
          search_email: email.trim().toLowerCase(),
          requesting_user_id: user.id
        }) as { data: SearchUserResult[] | null; error: any };

      if (error) {
        console.error("Error searching user by email:", error);
        setNotFound(true);
      } else if (data && Array.isArray(data) && data.length > 0) {
        const userData = data[0];
        setFoundUser({
          id: userData.id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          department: userData.department,
          created_at: new Date().toISOString(), // We don't need this for display
          updated_at: new Date().toISOString(), // We don't need this for display
          avatar_url: null, // Not returned by our function
          role: userData.role,
          email: userData.email
        });
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
