
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface StudentAnalyticsData {
  enrolledCourses: number;
  pendingAssignments: number;
  completedAssignments: number;
  completionRate: number;
  recentSubmissions: Array<{
    id: string;
    assignment_title: string;
    course_title: string;
    submitted_at: string;
    grade?: number;
  }>;
  upcomingDeadlines: Array<{
    id: string;
    title: string;
    course_title: string;
    deadline: string;
  }>;
}

export const useStudentAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<StudentAnalyticsData>({
    enrolledCourses: 0,
    pendingAssignments: 0,
    completedAssignments: 0,
    completionRate: 0,
    recentSubmissions: [],
    upcomingDeadlines: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStudentAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get student's enrolled courses
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          courses(id, title)
        `)
        .eq('student_id', user.id)
        .eq('status', 'active');

      const courseIds = enrollments?.map(e => e.course_id) || [];

      // Get assignments for enrolled courses
      const { data: assignments } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          deadline,
          course_id,
          courses(title)
        `)
        .in('course_id', courseIds);

      // Get student's submissions
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select(`
          id,
          assignment_id,
          submitted_at,
          grade,
          assignments(title, course_id, courses(title))
        `)
        .eq('student_id', user.id);

      // Calculate stats
      const enrolledCourses = enrollments?.length || 0;
      const totalAssignments = assignments?.length || 0;
      const completedAssignments = submissions?.length || 0;
      const pendingAssignments = Math.max(0, totalAssignments - completedAssignments);
      const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

      // Recent submissions (last 5)
      const recentSubmissions = submissions?.slice(0, 5).map(sub => ({
        id: sub.id,
        assignment_title: sub.assignments?.title || 'Unknown Assignment',
        course_title: sub.assignments?.courses?.title || 'Unknown Course',
        submitted_at: new Date(sub.submitted_at).toLocaleDateString(),
        grade: sub.grade
      })) || [];

      // Upcoming deadlines (next 5)
      const now = new Date();
      const upcomingDeadlines = assignments
        ?.filter(assignment => {
          if (!assignment.deadline) return false;
          return new Date(assignment.deadline) > now;
        })
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
        .slice(0, 5)
        .map(assignment => ({
          id: assignment.id,
          title: assignment.title,
          course_title: assignment.courses?.title || 'Unknown Course',
          deadline: new Date(assignment.deadline!).toLocaleDateString()
        })) || [];

      setAnalytics({
        enrolledCourses,
        pendingAssignments,
        completedAssignments,
        completionRate,
        recentSubmissions,
        upcomingDeadlines,
      });
    } catch (error) {
      console.error('Error fetching student analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentAnalytics();
  }, [user?.id]);

  return {
    analytics,
    loading,
    refetch: fetchStudentAnalytics
  };
};
