
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "./useAuth";

type Course = Tables<"courses">;
type Enrollment = Tables<"enrollments">;

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  const fetchCourses = async () => {
    setLoading(true);
    
    let query = supabase.from("courses").select("*");
    
    // Filter based on role
    if (role === "teacher") {
      query = query.eq("instructor_id", user?.id);
    } else if (role === "student") {
      query = query.eq("is_active", true);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching courses:", error);
    } else {
      setCourses(data || []);
    }
    
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    if (!user || role !== "student") return;
    
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("student_id", user.id);
    
    if (error) {
      console.error("Error fetching enrollments:", error);
    } else {
      setEnrollments(data || []);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return false;
    
    const { error } = await supabase
      .from("enrollments")
      .insert({
        student_id: user.id,
        course_id: courseId
      });
    
    if (error) {
      console.error("Error enrolling in course:", error);
      return false;
    }
    
    fetchEnrollments();
    return true;
  };

  const getEnrollmentCount = async (courseId: string) => {
    const { count, error } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("course_id", courseId)
      .eq("status", "active");
    
    if (error) {
      console.error("Error getting enrollment count:", error);
      return 0;
    }
    
    return count || 0;
  };

  const isEnrolledInCourse = (courseId: string) => {
    return enrollments.some(enrollment => 
      enrollment.course_id === courseId && enrollment.status === "active"
    );
  };

  useEffect(() => {
    if (user && role) {
      fetchCourses();
      fetchEnrollments();
    }
  }, [user, role]);

  return {
    courses,
    enrollments,
    loading,
    fetchCourses,
    enrollInCourse,
    getEnrollmentCount,
    isEnrolledInCourse
  };
}
