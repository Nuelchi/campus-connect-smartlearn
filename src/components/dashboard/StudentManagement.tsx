
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  enrollments: {
    course: {
      title: string;
    };
    enrolled_at: string;
    status: string;
  }[];
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const fetchStudents = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Get teacher's courses first
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
      .eq("instructor_id", user.id);
    
    if (courses && courses.length > 0) {
      const courseIds = courses.map(c => c.id);
      
      // Get enrollments for teacher's courses with student profiles
      const { data: enrollments, error } = await supabase
        .from("enrollments")
        .select(`
          student_id,
          enrolled_at,
          status,
          course:courses(title)
        `)
        .in("course_id", courseIds)
        .eq("status", "active");
      
      if (!error && enrollments) {
        // Group by student and get their profiles
        const studentIds = [...new Set(enrollments.map(e => e.student_id))];
        
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .in("id", studentIds);
        
        if (profiles) {
          const studentsData = profiles.map(profile => ({
            ...profile,
            enrollments: enrollments.filter(e => e.student_id === profile.id)
          }));
          
          setStudents(studentsData);
        }
      }
    }
    
    setLoading(false);
  };

  if (loading) {
    return <div className="p-4">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">{students.length} students</span>
        </div>
      </div>

      <div className="grid gap-4">
        {students.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No students enrolled in your courses</p>
            </CardContent>
          </Card>
        ) : (
          students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {student.first_name || student.last_name 
                    ? `${student.first_name || ""} ${student.last_name || ""}`.trim()
                    : "Unnamed Student"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span className="text-sm font-medium">Enrolled Courses:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {student.enrollments.map((enrollment, index) => (
                      <Badge key={index} variant="secondary">
                        {enrollment.course.title}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Joined: {new Date(student.enrollments[0]?.enrolled_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
