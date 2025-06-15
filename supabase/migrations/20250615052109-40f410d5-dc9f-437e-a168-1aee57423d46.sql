
-- Create a view to calculate student grades and GPA
CREATE OR REPLACE VIEW student_grade_summary AS
SELECT 
  s.student_id,
  s.assignment_id,
  a.title as assignment_title,
  a.course_id,
  c.title as course_title,
  c.category as course_category,
  s.grade,
  s.submitted_at,
  s.graded_at,
  s.feedback,
  -- Calculate letter grade
  CASE 
    WHEN s.grade >= 97 THEN 'A+'
    WHEN s.grade >= 93 THEN 'A'
    WHEN s.grade >= 90 THEN 'A-'
    WHEN s.grade >= 87 THEN 'B+'
    WHEN s.grade >= 83 THEN 'B'
    WHEN s.grade >= 80 THEN 'B-'
    WHEN s.grade >= 77 THEN 'C+'
    WHEN s.grade >= 73 THEN 'C'
    WHEN s.grade >= 70 THEN 'C-'
    WHEN s.grade >= 67 THEN 'D+'
    WHEN s.grade >= 65 THEN 'D'
    ELSE 'F'
  END as letter_grade,
  -- Calculate GPA points
  CASE 
    WHEN s.grade >= 97 THEN 4.0
    WHEN s.grade >= 93 THEN 4.0
    WHEN s.grade >= 90 THEN 3.7
    WHEN s.grade >= 87 THEN 3.3
    WHEN s.grade >= 83 THEN 3.0
    WHEN s.grade >= 80 THEN 2.7
    WHEN s.grade >= 77 THEN 2.3
    WHEN s.grade >= 73 THEN 2.0
    WHEN s.grade >= 70 THEN 1.7
    WHEN s.grade >= 67 THEN 1.3
    WHEN s.grade >= 65 THEN 1.0
    ELSE 0.0
  END as gpa_points
FROM assignment_submissions s
JOIN assignments a ON s.assignment_id = a.id
JOIN courses c ON a.course_id = c.id
WHERE s.grade IS NOT NULL;

-- Create a view for student overall statistics
CREATE OR REPLACE VIEW student_academic_stats AS
SELECT 
  student_id,
  COUNT(*) as total_assignments,
  COUNT(CASE WHEN grade IS NOT NULL THEN 1 END) as graded_assignments,
  COUNT(CASE WHEN grade IS NULL THEN 1 END) as pending_assignments,
  ROUND(AVG(grade), 2) as overall_average,
  ROUND(AVG(gpa_points), 2) as cumulative_gpa,
  MAX(grade) as highest_grade,
  MIN(grade) as lowest_grade,
  COUNT(CASE WHEN grade >= 90 THEN 1 END) as a_grades,
  COUNT(CASE WHEN grade >= 80 AND grade < 90 THEN 1 END) as b_grades,
  COUNT(CASE WHEN grade >= 70 AND grade < 80 THEN 1 END) as c_grades,
  COUNT(CASE WHEN grade < 70 THEN 1 END) as below_c_grades
FROM student_grade_summary
GROUP BY student_id;
