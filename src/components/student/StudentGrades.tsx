
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Award, TrendingUp, BookOpen, Clock } from "lucide-react";

interface GradeSummary {
  student_id: string;
  assignment_id: string;
  assignment_title: string;
  course_id: string;
  course_title: string;
  course_category: string;
  grade: number;
  submitted_at: string;
  graded_at: string;
  feedback: string;
  letter_grade: string;
  gpa_points: number;
}

interface AcademicStats {
  student_id: string;
  total_assignments: number;
  graded_assignments: number;
  pending_assignments: number;
  overall_average: number;
  cumulative_gpa: number;
  highest_grade: number;
  lowest_grade: number;
  a_grades: number;
  b_grades: number;
  c_grades: number;
  below_c_grades: number;
}

export default function StudentGrades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<GradeSummary[]>([]);
  const [stats, setStats] = useState<AcademicStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchGrades();
      fetchStats();
    }
  }, [user?.id]);

  const fetchGrades = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('student_grade_summary')
      .select('*')
      .eq('student_id', user.id)
      .order('graded_at', { ascending: false });

    if (error) {
      console.error('Error fetching grades:', error);
    } else {
      setGrades(data || []);
    }
  };

  const fetchStats = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('student_academic_stats')
      .select('*')
      .eq('student_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching academic stats:', error);
    } else {
      setStats(data);
    }
    
    setLoading(false);
  };

  const getGradeColor = (letterGrade: string) => {
    if (letterGrade.startsWith('A')) return 'bg-green-500';
    if (letterGrade.startsWith('B')) return 'bg-blue-500';
    if (letterGrade.startsWith('C')) return 'bg-yellow-500';
    if (letterGrade.startsWith('D')) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.5) return 'text-yellow-600';
    if (gpa >= 2.0) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-medium">Loading your grades...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getGPAColor(stats.cumulative_gpa || 0)}`}>
                {stats.cumulative_gpa?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Out of 4.0 scale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.overall_average?.toFixed(1) || '0.0'}%
              </div>
              <p className="text-xs text-muted-foreground">
                Across all assignments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.graded_assignments}
              </div>
              <p className="text-xs text-muted-foreground">
                Of {stats.total_assignments} assignments
              </p>
              <Progress 
                value={(stats.graded_assignments / stats.total_assignments) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending_assignments}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting grades
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grade Distribution */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.a_grades}</div>
                <div className="text-sm text-muted-foreground">A Grades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.b_grades}</div>
                <div className="text-sm text-muted-foreground">B Grades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.c_grades}</div>
                <div className="text-sm text-muted-foreground">C Grades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.below_c_grades}</div>
                <div className="text-sm text-muted-foreground">Below C</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Grades</CardTitle>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No graded assignments yet.</p>
              <p className="text-sm text-muted-foreground">
                Grades will appear here once your assignments are graded.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Letter</TableHead>
                    <TableHead>GPA Points</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Graded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.assignment_id}>
                      <TableCell className="font-medium">
                        {grade.assignment_title}
                        {grade.feedback && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {grade.feedback.substring(0, 100)}
                            {grade.feedback.length > 100 && '...'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{grade.course_title}</div>
                          {grade.course_category && (
                            <div className="text-xs text-muted-foreground">
                              {grade.course_category}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">{grade.grade}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(grade.letter_grade)}>
                          {grade.letter_grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={getGPAColor(grade.gpa_points)}>
                          {grade.gpa_points.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(grade.submitted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(grade.graded_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
