
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

type Assignment = Tables<"assignments">;

export function useAssignments(courseId?: string) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  const fetchAssignments = async () => {
    setLoading(true);
    
    let query = supabase.from("assignments").select(`
      *,
      course:courses(*)
    `);
    
    // Filter by course if provided
    if (courseId) {
      query = query.eq("course_id", courseId);
    }
    
    // Filter by instructor if teacher
    if (role === "teacher" && user?.id) {
      query = query.eq("courses.instructor_id", user.id);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching assignments:", error);
    } else {
      setAssignments(data || []);
    }
    
    setLoading(false);
  };

  const refetchAssignments = () => {
    fetchAssignments();
  };

  useEffect(() => {
    if (user && role) {
      fetchAssignments();
    }
  }, [user, role, courseId]);

  return {
    assignments,
    loading,
    fetchAssignments,
    refetchAssignments
  };
}
