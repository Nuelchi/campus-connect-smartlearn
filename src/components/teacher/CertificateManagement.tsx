
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Award, Search, Users, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import IssueCertificateDialog from "./IssueCertificateDialog";

interface Student {
  id: string;
  first_name: string | null;
  last_name: string | null;
  has_certificate: boolean;
}

interface Course {
  id: string;
  title: string;
  students: Student[];
}

export default function CertificateManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchCoursesAndStudents();
  }, [user]);

  const fetchCoursesAndStudents = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Get courses taught by this teacher
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("id, title")
        .eq("instructor_id", user.id)
        .eq("is_active", true);

      if (coursesError) throw coursesError;

      // For each course, get enrolled students and check if they have certificates
      const coursesWithStudents = await Promise.all(
        (coursesData || []).map(async (course) => {
          // Get enrolled students with their profile information
          const { data: enrollments, error: enrollmentsError } = await supabase
            .from("enrollments")
            .select(`
              student_id,
              profiles!enrollments_student_id_fkey(id, first_name, last_name)
            `)
            .eq("course_id", course.id)
            .eq("status", "active");

          if (enrollmentsError) throw enrollmentsError;

          // Get existing certificates for this course
          const { data: certificates, error: certificatesError } = await supabase
            .from("certificates")
            .select("student_id")
            .eq("course_id", course.id)
            .eq("is_active", true);

          if (certificatesError) throw certificatesError;

          const certificateStudentIds = new Set(certificates?.map(cert => cert.student_id) || []);

          const students: Student[] = (enrollments || []).map(enrollment => ({
            id: enrollment.profiles.id,
            first_name: enrollment.profiles.first_name,
            last_name: enrollment.profiles.last_name,
            has_certificate: certificateStudentIds.has(enrollment.profiles.id),
          }));

          return {
            id: course.id,
            title: course.title,
            students,
          };
        })
      );

      setCourses(coursesWithStudents);
    } catch (error) {
      console.error("Error fetching courses and students:", error);
      toast({
        title: "Error",
        description: "Failed to load courses and students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (student: Student) => {
    return `${student.first_name || ""} ${student.last_name || ""}`.trim() || "Unknown Student";
  };

  const filteredCourses = courses.map(course => ({
    ...course,
    students: course.students.filter(student =>
      getStudentName(student).toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(course => course.students.length > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg font-semibold animate-pulse">Loading certificate management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Certificate Management</h2>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <span className="text-sm text-muted-foreground">Issue & manage certificates</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="space-y-6">
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No students found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm ? "Try adjusting your search" : "No enrolled students in your courses"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{course.title}</span>
                  <Badge variant="outline">
                    {course.students.length} student{course.students.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {getStudentName(student).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{getStudentName(student)}</p>
                          <div className="flex items-center gap-2">
                            {student.has_certificate ? (
                              <Badge variant="default">
                                <Award className="w-3 h-3 mr-1" />
                                Certified
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                No Certificate
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!student.has_certificate && (
                          <IssueCertificateDialog
                            courseId={course.id}
                            studentId={student.id}
                            studentName={getStudentName(student)}
                            onCertificateIssued={fetchCoursesAndStudents}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
