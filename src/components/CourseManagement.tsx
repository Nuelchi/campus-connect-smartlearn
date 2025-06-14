
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import CourseCard from "./CourseCard";
import CreateCourseDialog from "./CreateCourseDialog";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CourseManagement() {
  const { courses, loading, fetchCourses, enrollInCourse, isEnrolledInCourse } = useCourses();
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnroll = async (courseId: string) => {
    const success = await enrollInCourse(courseId);
    if (success) {
      toast({
        title: "Success",
        description: "Successfully enrolled in the course!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManage = (courseId: string) => {
    // TODO: Navigate to course detail page
    console.log("Managing course:", courseId);
  };

  // Fetch enrollment counts for each course
  useEffect(() => {
    const fetchEnrollmentCounts = async () => {
      const counts: Record<string, number> = {};
      for (const course of courses) {
        // This is a simplified version - in a real app you'd batch these requests
        const { count } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .eq("course_id", course.id)
          .eq("status", "active");
        counts[course.id] = count || 0;
      }
      setEnrollmentCounts(counts);
    };

    if (courses.length > 0) {
      fetchEnrollmentCounts();
    }
  }, [courses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg font-semibold animate-pulse">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {role === "student" ? "Available Courses" : "Course Management"}
          </h2>
          <p className="text-muted-foreground">
            {role === "student" 
              ? "Discover and enroll in courses that interest you"
              : "Manage your courses and track student progress"
            }
          </p>
        </div>
        {(role === "teacher" || role === "admin") && (
          <CreateCourseDialog onCourseCreated={fetchCourses} />
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms"
                  : role === "teacher" 
                    ? "Create your first course to get started"
                    : "Check back later for new courses"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrollmentCount={enrollmentCounts[course.id] || 0}
              onEnroll={handleEnroll}
              onManage={handleManage}
              userRole={role}
              isEnrolled={isEnrolledInCourse(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
