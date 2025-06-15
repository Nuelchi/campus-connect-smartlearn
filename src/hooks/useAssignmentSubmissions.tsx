
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

type AssignmentSubmission = Tables<"assignment_submissions"> & {
  assignment: Tables<"assignments"> & {
    course: Tables<"courses">;
  };
};

export function useAssignmentSubmissions() {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSubmissions = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select(`
        *,
        assignment:assignments(
          *,
          course:courses(*)
        )
      `)
      .eq("student_id", user.id)
      .order("submitted_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching submissions:", error);
    } else {
      setSubmissions(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  return {
    submissions,
    loading,
    refetchSubmissions: fetchSubmissions
  };
}
