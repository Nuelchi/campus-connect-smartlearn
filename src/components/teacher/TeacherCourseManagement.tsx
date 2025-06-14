
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, FileText, MessageSquare, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CreateCourseDialog from "./CreateCourseDialog";
import CourseContentUpload from "./CourseContentUpload";
import CreateAssignmentDialog from "./CreateAssignmentDialog";
import MessagingCenter from "./MessagingCenter";
import Gradebook from "./Gradebook";

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  department: string | null;
  created_at: string;
  enrollment_count?: number;
}

interface CourseContent {
  id: string;
  title: string;
  content_type: string | null;
  file_url: string | null;
  created_at: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  created_at: string;
}

export default function TeacherCourseManagement() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseContent, setCourseContent] = useState<CourseContent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseContent();
      fetchAssignments();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get enrollment counts for each course
      const coursesWithCounts = await Promise.all(
        (data || []).map(async (course) => {
          const { count } = await supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id)
            .eq("status", "active");
          
          return { 
            ...course, 
            enrollment_count: count || 0,
            department: course.category || "General" // Use category as department fallback
          };
        })
      );

      setCourses(coursesWithCounts);
      if (coursesWithCounts.length > 0 && !selectedCourse) {
        setSelectedCourse(coursesWithCounts[0]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseContent = async () => {
    if (!selectedCourse) return;

    try {
      const { data, error } = await supabase
        .from("course_materials")
        .select("*")
        .eq("course_id", selectedCourse.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourseContent(data || []);
    } catch (error) {
      console.error("Error fetching course content:", error);
    }
  };

  const fetchAssignments = async () => {
    if (!selectedCourse) return;

    try {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("course_id", selectedCourse.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading course management...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <CreateCourseDialog onCourseCreated={fetchCourses} />
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No courses yet</h3>
              <p className="text-muted-foreground">Create your first course to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">My Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCourse?.id === course.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <h4 className="font-medium text-sm">{course.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-70">{course.category || "General"}</span>
                      <Badge variant="secondary" className="text-xs">
                        {course.enrollment_count} students
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Course Details */}
          <div className="lg:col-span-3">
            {selectedCourse && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedCourse.title}</CardTitle>
                      <p className="text-muted-foreground mt-1">{selectedCourse.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline">{selectedCourse.category || "General"}</Badge>
                        <Badge variant="outline">{selectedCourse.department || "General"}</Badge>
                        <Badge variant="outline">
                          <Users className="mr-1 h-3 w-3" />
                          {selectedCourse.enrollment_count} students
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      <TabsTrigger value="assignments">Assignments</TabsTrigger>
                      <TabsTrigger value="students">Students</TabsTrigger>
                      <TabsTrigger value="messages">Announcements</TabsTrigger>
                      <TabsTrigger value="grades">Grades</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Course Content</h3>
                        <CourseContentUpload 
                          courseId={selectedCourse.id} 
                          onContentUploaded={fetchCourseContent}
                        />
                      </div>
                      <div className="space-y-2">
                        {courseContent.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No content uploaded yet. Add videos or PDFs to get started.
                          </p>
                        ) : (
                          courseContent.map((content) => (
                            <div key={content.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div className="flex items-center space-x-3">
                                {content.content_type === 'video' ? (
                                  <FileText className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <FileText className="h-5 w-5 text-red-500" />
                                )}
                                <div>
                                  <h4 className="font-medium">{content.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {content.content_type?.toUpperCase() || "FILE"} • {new Date(content.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline">{content.content_type || "file"}</Badge>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="assignments" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Assignments</h3>
                        <CreateAssignmentDialog 
                          courseId={selectedCourse.id} 
                          onAssignmentCreated={fetchAssignments}
                        />
                      </div>
                      <div className="space-y-2">
                        {assignments.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            No assignments created yet. Create your first assignment.
                          </p>
                        ) : (
                          assignments.map((assignment) => (
                            <div key={assignment.id} className="p-3 bg-muted rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">{assignment.title}</h4>
                                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : "No deadline"}
                                  </p>
                                </div>
                                <Badge variant="outline">
                                  {assignment.deadline && new Date(assignment.deadline) > new Date() ? "Active" : "Past Due"}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="students">
                      <div className="text-center py-8 text-muted-foreground">
                        Student management features coming soon...
                      </div>
                    </TabsContent>

                    <TabsContent value="messages">
                      <MessagingCenter />
                    </TabsContent>

                    <TabsContent value="grades">
                      <Gradebook />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
