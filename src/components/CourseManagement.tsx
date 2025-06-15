
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Building2 } from "lucide-react";
import CourseCard from "./CourseCard";
import CreateCourseDialog from "./CreateCourseDialog";
import { useCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CourseManagement() {
  const { courses, loading, fetchCourses, enrollInCourse, isEnrolledInCourse } = useCourses();
  const { role, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [enrollmentCounts, setEnrollmentCounts] = useState<Record<string, number>>({});
  const [userDepartment, setUserDepartment] = useState<string | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch user's department
  useEffect(() => {
    const fetchUserDepartment = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("department")
          .eq("id", user.id)
          .single();
        
        if (profile?.department) {
          setUserDepartment(profile.department);
          setSelectedDepartment(profile.department); // Default to user's department
        }
      }
    };

    fetchUserDepartment();
  }, [user]);

  // Extract unique departments and categories from courses
  useEffect(() => {
    const uniqueDepartments = [...new Set(courses.map(course => course.category).filter(Boolean))];
    const uniqueCategories = [...new Set(courses.map(course => course.category).filter(Boolean))];
    
    setDepartments(uniqueDepartments);
    setCategories(uniqueCategories);
  }, [courses]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === "" || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    
    const matchesDepartment = selectedDepartment === "all" || course.category === selectedDepartment;

    return matchesSearch && matchesCategory && matchesDepartment;
  });

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
          {userDepartment && role === "student" && (
            <p className="text-sm text-blue-600 mt-1">
              <Building2 className="inline h-4 w-4 mr-1" />
              Your Department: {userDepartment}
            </p>
          )}
        </div>
        {(role === "teacher" || role === "admin") && (
          <CreateCourseDialog onCourseCreated={fetchCourses} />
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
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
                {searchTerm || selectedCategory !== "all" || selectedDepartment !== "all"
                  ? "Try adjusting your search terms or filters"
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
