
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface TeacherAnalyticsData {
  totalCourses: number;
  totalStudents: number;
  totalAssignments: number;
  totalSubmissions: number;
  courseEnrollments: Array<{ course: string; enrollments: number }>;
  assignmentSubmissions: Array<{ assignment: string; submissions: number }>;
  monthlyActivity: Array<{ month: string; submissions: number; enrollments: number }>;
}

export const useTeacherAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<TeacherAnalyticsData>({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    courseEnrollments: [],
    assignmentSubmissions: [],
    monthlyActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchTeacherAnalytics = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get teacher's courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id);

      const courseIds = courses?.map(c => c.id) || [];

      if (courseIds.length === 0) {
        setAnalytics({
          totalCourses: 0,
          totalStudents: 0,
          totalAssignments: 0,
          totalSubmissions: 0,
          courseEnrollments: [],
          assignmentSubmissions: [],
          monthlyActivity: [],
        });
        setLoading(false);
        return;
      }

      // Get enrollments for teacher's courses
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('id, course_id, enrolled_at')
        .in('course_id', courseIds);

      // Get assignments for teacher's courses
      const { data: assignments } = await supabase
        .from('assignments')
        .select('id, title, course_id')
        .in('course_id', courseIds);

      const assignmentIds = assignments?.map(a => a.id) || [];

      // Get submissions for teacher's assignments
      const { data: submissions } = await supabase
        .from('assignment_submissions')
        .select('id, assignment_id, submitted_at')
        .in('assignment_id', assignmentIds);

      // Calculate course enrollments
      const courseEnrollmentMap = new Map();
      courses?.forEach(course => {
        const enrollmentCount = enrollments?.filter(e => e.course_id === course.id).length || 0;
        courseEnrollmentMap.set(course.title, enrollmentCount);
      });

      const courseEnrollments = Array.from(courseEnrollmentMap.entries()).map(([course, enrollments]) => ({
        course,
        enrollments
      }));

      // Calculate assignment submissions
      const assignmentSubmissionMap = new Map();
      assignments?.forEach(assignment => {
        const submissionCount = submissions?.filter(s => s.assignment_id === assignment.id).length || 0;
        assignmentSubmissionMap.set(assignment.title, submissionCount);
      });

      const assignmentSubmissions = Array.from(assignmentSubmissionMap.entries()).map(([assignment, submissions]) => ({
        assignment,
        submissions
      }));

      // Calculate monthly activity for last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyActivity = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const monthEnrollments = enrollments?.filter(enrollment => {
          const enrollDate = new Date(enrollment.enrolled_at);
          return enrollDate.getMonth() === date.getMonth() && 
                 enrollDate.getFullYear() === date.getFullYear();
        }).length || 0;

        const monthSubmissions = submissions?.filter(submission => {
          const subDate = new Date(submission.submitted_at);
          return subDate.getMonth() === date.getMonth() && 
                 subDate.getFullYear() === date.getFullYear();
        }).length || 0;

        return { 
          month, 
          enrollments: monthEnrollments,
          submissions: monthSubmissions
        };
      });

      // Get unique students across all courses
      const uniqueStudents = new Set(enrollments?.map(e => e.id));

      setAnalytics({
        totalCourses: courses?.length || 0,
        totalStudents: uniqueStudents.size,
        totalAssignments: assignments?.length || 0,
        totalSubmissions: submissions?.length || 0,
        courseEnrollments,
        assignmentSubmissions,
        monthlyActivity,
      });
    } catch (error) {
      console.error('Error fetching teacher analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherAnalytics();
  }, [user?.id]);

  return {
    analytics,
    loading,
    refetch: fetchTeacherAnalytics
  };
};
