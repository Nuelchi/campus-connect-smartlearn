
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ActivityItem {
  id: string;
  type: 'course' | 'assignment' | 'student' | 'submission';
  title: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'in-progress';
}

export const useRecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      // Get recent courses created
      const { data: recentCourses } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          created_at,
          profiles:instructor_id (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent enrollments
      const { data: recentEnrollments } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          courses:course_id (
            title
          ),
          profiles:student_id (
            first_name,
            last_name
          )
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      // Get recent assignments
      const { data: recentAssignments } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          created_at,
          courses:course_id (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent submissions
      const { data: recentSubmissions } = await supabase
        .from('assignment_submissions')
        .select(`
          id,
          submitted_at,
          assignments:assignment_id (
            title
          ),
          profiles:student_id (
            first_name,
            last_name
          )
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);

      // Transform and combine all activities
      const allActivities: ActivityItem[] = [];

      // Add course activities
      recentCourses?.forEach(course => {
        const instructorName = course.profiles 
          ? `${course.profiles.first_name || ''} ${course.profiles.last_name || ''}`.trim()
          : 'Unknown User';
        
        allActivities.push({
          id: course.id,
          type: 'course',
          title: 'New Course Created',
          description: `"${course.title}" by ${instructorName}`,
          timestamp: formatTimestamp(course.created_at),
          status: 'completed'
        });
      });

      // Add enrollment activities
      recentEnrollments?.forEach(enrollment => {
        const studentName = enrollment.profiles 
          ? `${enrollment.profiles.first_name || ''} ${enrollment.profiles.last_name || ''}`.trim()
          : 'Unknown User';
        
        allActivities.push({
          id: enrollment.id,
          type: 'student',
          title: 'New Student Enrollment',
          description: `${studentName} enrolled in "${enrollment.courses?.title || 'Unknown Course'}"`,
          timestamp: formatTimestamp(enrollment.enrolled_at),
          status: 'completed'
        });
      });

      // Add assignment activities
      recentAssignments?.forEach(assignment => {
        allActivities.push({
          id: assignment.id,
          type: 'assignment',
          title: 'New Assignment Created',
          description: `"${assignment.title}" in ${assignment.courses?.title || 'Unknown Course'}`,
          timestamp: formatTimestamp(assignment.created_at),
          status: 'completed'
        });
      });

      // Add submission activities
      recentSubmissions?.forEach(submission => {
        const studentName = submission.profiles 
          ? `${submission.profiles.first_name || ''} ${submission.profiles.last_name || ''}`.trim()
          : 'Unknown User';
        
        allActivities.push({
          id: submission.id,
          type: 'submission',
          title: 'Assignment Submission',
          description: `${studentName} submitted "${submission.assignments?.title || 'Unknown Assignment'}"`,
          timestamp: formatTimestamp(submission.submitted_at),
          status: 'completed'
        });
      });

      // Sort all activities by timestamp (most recent first)
      allActivities.sort((a, b) => {
        const timeA = new Date(convertTimestamp(a.timestamp)).getTime();
        const timeB = new Date(convertTimestamp(b.timestamp)).getTime();
        return timeB - timeA;
      });

      setActivities(allActivities.slice(0, 10)); // Show only top 10
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const convertTimestamp = (formattedTime: string) => {
    // Convert formatted time back to ISO string for sorting
    const now = new Date();
    
    if (formattedTime === 'Just now') return now.toISOString();
    
    const match = formattedTime.match(/(\d+)\s+(minute|hour|day)s?\s+ago/);
    if (match) {
      const amount = parseInt(match[1]);
      const unit = match[2];
      
      const result = new Date(now);
      if (unit === 'minute') result.setMinutes(result.getMinutes() - amount);
      if (unit === 'hour') result.setHours(result.getHours() - amount);
      if (unit === 'day') result.setDate(result.getDate() - amount);
      
      return result.toISOString();
    }
    
    return formattedTime;
  };

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  return {
    activities,
    loading,
    refetch: fetchRecentActivity
  };
};
