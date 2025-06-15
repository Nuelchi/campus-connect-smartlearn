
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
      
      // Get recent courses created (separate queries to avoid join issues)
      const { data: recentCourses } = await supabase
        .from('courses')
        .select('id, title, created_at, instructor_id')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent enrollments
      const { data: recentEnrollments } = await supabase
        .from('enrollments')
        .select('id, enrolled_at, course_id, student_id')
        .order('enrolled_at', { ascending: false })
        .limit(5);

      // Get recent assignments
      const { data: recentAssignments } = await supabase
        .from('assignments')
        .select('id, title, created_at, course_id')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent submissions
      const { data: recentSubmissions } = await supabase
        .from('assignment_submissions')
        .select('id, submitted_at, assignment_id, student_id')
        .order('submitted_at', { ascending: false })
        .limit(5);

      // Transform and combine all activities
      const allActivities: ActivityItem[] = [];

      // Add course activities
      if (recentCourses) {
        for (const course of recentCourses) {
          // Get instructor profile separately
          const { data: instructor } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', course.instructor_id)
            .maybeSingle();

          const instructorName = instructor 
            ? `${instructor.first_name || ''} ${instructor.last_name || ''}`.trim()
            : 'Unknown User';
          
          allActivities.push({
            id: course.id,
            type: 'course',
            title: 'New Course Created',
            description: `"${course.title}" by ${instructorName}`,
            timestamp: formatTimestamp(course.created_at),
            status: 'completed'
          });
        }
      }

      // Add enrollment activities
      if (recentEnrollments) {
        for (const enrollment of recentEnrollments) {
          // Get student profile and course separately
          const [{ data: student }, { data: course }] = await Promise.all([
            supabase.from('profiles').select('first_name, last_name').eq('id', enrollment.student_id).maybeSingle(),
            supabase.from('courses').select('title').eq('id', enrollment.course_id).maybeSingle()
          ]);

          const studentName = student 
            ? `${student.first_name || ''} ${student.last_name || ''}`.trim()
            : 'Unknown User';
          
          allActivities.push({
            id: enrollment.id,
            type: 'student',
            title: 'New Student Enrollment',
            description: `${studentName} enrolled in "${course?.title || 'Unknown Course'}"`,
            timestamp: formatTimestamp(enrollment.enrolled_at),
            status: 'completed'
          });
        }
      }

      // Add assignment activities
      if (recentAssignments) {
        for (const assignment of recentAssignments) {
          // Get course separately
          const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', assignment.course_id)
            .maybeSingle();

          allActivities.push({
            id: assignment.id,
            type: 'assignment',
            title: 'New Assignment Created',
            description: `"${assignment.title}" in ${course?.title || 'Unknown Course'}`,
            timestamp: formatTimestamp(assignment.created_at),
            status: 'completed'
          });
        }
      }

      // Add submission activities
      if (recentSubmissions) {
        for (const submission of recentSubmissions) {
          // Get student profile and assignment separately
          const [{ data: student }, { data: assignment }] = await Promise.all([
            supabase.from('profiles').select('first_name, last_name').eq('id', submission.student_id).maybeSingle(),
            supabase.from('assignments').select('title').eq('id', submission.assignment_id).maybeSingle()
          ]);

          const studentName = student 
            ? `${student.first_name || ''} ${student.last_name || ''}`.trim()
            : 'Unknown User';
          
          allActivities.push({
            id: submission.id,
            type: 'submission',
            title: 'Assignment Submission',
            description: `${studentName} submitted "${assignment?.title || 'Unknown Assignment'}"`,
            timestamp: formatTimestamp(submission.submitted_at),
            status: 'completed'
          });
        }
      }

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
