
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Teachers can view their courses" ON public.courses;
DROP POLICY IF EXISTS "Teachers can manage their courses" ON public.courses;
DROP POLICY IF EXISTS "Students can view their enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Students can create their enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Course members can view assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can manage assignments in their courses" ON public.assignments;
DROP POLICY IF EXISTS "Students can view their submissions" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Students can create their submissions" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Students can update their submissions" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Teachers can grade submissions in their courses" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Enable RLS on tables that don't have it yet
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for admins to access all data
CREATE POLICY "Admins can view all courses" ON public.courses
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all courses" ON public.courses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can view their courses" ON public.courses
  FOR SELECT TO authenticated
  USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Teachers can manage their courses" ON public.courses
  FOR ALL TO authenticated
  USING (instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Enrollments policies
CREATE POLICY "Students can view their enrollments" ON public.enrollments
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'teacher'));

CREATE POLICY "Students can create their enrollments" ON public.enrollments
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all enrollments" ON public.enrollments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Assignments policies
CREATE POLICY "Course members can view assignments" ON public.assignments
  FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = assignments.course_id 
      AND courses.instructor_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE enrollments.course_id = assignments.course_id 
      AND enrollments.student_id = auth.uid()
      AND enrollments.status = 'active'
    )
  );

CREATE POLICY "Teachers can manage assignments in their courses" ON public.assignments
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = assignments.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Assignment submissions policies
CREATE POLICY "Students can view their submissions" ON public.assignment_submissions
  FOR SELECT TO authenticated
  USING (
    student_id = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON a.course_id = c.id
      WHERE a.id = assignment_submissions.assignment_id
      AND c.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Students can create their submissions" ON public.assignment_submissions
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their submissions" ON public.assignment_submissions
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can grade submissions in their courses" ON public.assignment_submissions
  FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (
      SELECT 1 FROM public.assignments a
      JOIN public.courses c ON a.course_id = c.id
      WHERE a.id = assignment_submissions.assignment_id
      AND c.instructor_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can update their profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create a view for admin dashboard stats
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.courses WHERE is_active = true) as total_active_courses,
  (SELECT COUNT(*) FROM public.user_roles WHERE role = 'student') as total_students,
  (SELECT COUNT(*) FROM public.user_roles WHERE role = 'teacher') as total_teachers,
  (SELECT COUNT(*) FROM public.assignments) as total_assignments,
  (SELECT COUNT(*) FROM public.enrollments WHERE status = 'active') as total_enrollments,
  (SELECT COUNT(*) FROM public.assignment_submissions) as total_submissions,
  (SELECT COUNT(*) FROM auth.users) as total_users;

-- Create a function to get recent activity for admin dashboard
CREATE OR REPLACE FUNCTION public.get_recent_activity(limit_count integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  type text,
  description text,
  user_email text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH recent_activities AS (
    SELECT 
      c.id,
      'course_created' as type,
      'New course "' || c.title || '" created' as description,
      COALESCE(p.first_name || ' ' || p.last_name, 'Unknown User') as user_email,
      c.created_at
    FROM courses c
    LEFT JOIN profiles p ON c.instructor_id = p.id
    WHERE c.created_at > NOW() - INTERVAL '7 days'
    
    UNION ALL
    
    SELECT 
      e.id,
      'student_enrolled' as type,
      'Student enrolled in "' || c.title || '"' as description,
      COALESCE(ps.first_name || ' ' || ps.last_name, 'Unknown User') as user_email,
      e.enrolled_at as created_at
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    LEFT JOIN profiles ps ON e.student_id = ps.id
    WHERE e.enrolled_at > NOW() - INTERVAL '7 days'
    
    UNION ALL
    
    SELECT 
      a.id,
      'assignment_created' as type,
      'New assignment "' || a.title || '" created' as description,
      COALESCE(pi.first_name || ' ' || pi.last_name, 'Unknown User') as user_email,
      a.created_at
    FROM assignments a
    JOIN courses c ON a.course_id = c.id
    LEFT JOIN profiles pi ON c.instructor_id = pi.id
    WHERE a.created_at > NOW() - INTERVAL '7 days'
    
    UNION ALL
    
    SELECT 
      s.id,
      'submission_created' as type,
      'Assignment submission received' as description,
      COALESCE(ps.first_name || ' ' || ps.last_name, 'Unknown User') as user_email,
      s.submitted_at as created_at
    FROM assignment_submissions s
    LEFT JOIN profiles ps ON s.student_id = ps.id
    WHERE s.submitted_at > NOW() - INTERVAL '7 days'
  )
  SELECT ra.id, ra.type, ra.description, ra.user_email, ra.created_at
  FROM recent_activities ra
  ORDER BY ra.created_at DESC
  LIMIT limit_count;
$$;
