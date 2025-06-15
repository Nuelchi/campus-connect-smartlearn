
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalAssignments: number;
  totalSubmissions: number;
  monthlyEnrollments: Array<{ month: string; enrollments: number }>;
  courseCategories: Array<{ category: string; count: number }>;
  submissionTrends: Array<{ month: string; submissions: number }>;
  userRoleDistribution: Array<{ role: string; count: number }>;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    monthlyEnrollments: [],
    courseCategories: [],
    submissionTrends: [],
    userRoleDistribution: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch basic counts
      const [
        { count: totalUsers },
        { count: totalCourses },
        { count: totalEnrollments },
        { count: totalAssignments },
        { count: totalSubmissions }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('assignments').select('*', { count: 'exact', head: true }),
        supabase.from('assignment_submissions').select('*', { count: 'exact', head: true })
      ]);

      // Fetch monthly enrollments for the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('enrolled_at')
        .gte('enrolled_at', sixMonthsAgo.toISOString());

      // Process monthly enrollments
      const monthlyEnrollments = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const count = enrollmentData?.filter(enrollment => {
          const enrollDate = new Date(enrollment.enrolled_at);
          return enrollDate.getMonth() === date.getMonth() && 
                 enrollDate.getFullYear() === date.getFullYear();
        }).length || 0;

        return { month, enrollments: count };
      });

      // Fetch course categories
      const { data: courseData } = await supabase
        .from('courses')
        .select('category');

      const categoryMap = new Map();
      courseData?.forEach(course => {
        const category = course.category || 'Uncategorized';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });

      const courseCategories = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count
      }));

      // Fetch submission trends
      const { data: submissionData } = await supabase
        .from('assignment_submissions')
        .select('submitted_at')
        .gte('submitted_at', sixMonthsAgo.toISOString());

      const submissionTrends = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const month = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const count = submissionData?.filter(submission => {
          const subDate = new Date(submission.submitted_at);
          return subDate.getMonth() === date.getMonth() && 
                 subDate.getFullYear() === date.getFullYear();
        }).length || 0;

        return { month, submissions: count };
      });

      // Fetch user role distribution
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role');

      const roleMap = new Map();
      roleData?.forEach(userRole => {
        const role = userRole.role;
        roleMap.set(role, (roleMap.get(role) || 0) + 1);
      });

      const userRoleDistribution = Array.from(roleMap.entries()).map(([role, count]) => ({
        role,
        count
      }));

      setAnalytics({
        totalUsers: totalUsers || 0,
        totalCourses: totalCourses || 0,
        totalEnrollments: totalEnrollments || 0,
        totalAssignments: totalAssignments || 0,
        totalSubmissions: totalSubmissions || 0,
        monthlyEnrollments,
        courseCategories,
        submissionTrends,
        userRoleDistribution,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    analytics,
    loading,
    refetch: fetchAnalytics
  };
};
