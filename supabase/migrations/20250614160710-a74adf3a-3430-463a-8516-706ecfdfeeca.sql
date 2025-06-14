
-- Drop and recreate the admin_dashboard_stats view with correct columns
DROP VIEW IF EXISTS admin_dashboard_stats;

CREATE VIEW admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM user_roles WHERE role = 'teacher') as total_teachers,
  (SELECT COUNT(*) FROM user_roles WHERE role = 'student') as total_students,
  (SELECT COUNT(*) FROM courses WHERE is_active = true) as total_active_courses,
  (SELECT COUNT(*) FROM assignment_submissions) as total_submissions,
  (SELECT COUNT(*) FROM enrollments WHERE status = 'active') as total_enrollments,
  (SELECT COUNT(*) FROM assignments) as total_assignments,
  (SELECT COUNT(*) FROM profiles) as total_users;
