import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Building2, Sparkles } from "lucide-react";
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
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("department")
          .eq("id", user.id)
          .maybeSingle();
        
        if (!error && profile?.department) {
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
        <div className="text-lg font-semibold animate-pulse flex items-center gap-2">
          <Sparkles className="h-6 w-6 animate-spin" />
          Loading courses...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 min-h-screen p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {role === "student" ? "Discover Amazing Courses" : "Course Management"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">
              {role === "student" 
                ? "Find the perfect course to advance your learning journey"
                : "Manage your courses and track student progress"
              }
            </p>
            {userDepartment && role === "student" && (
              <div className="flex items-center mt-3 text-blue-600 dark:text-blue-400">
                <Building2 className="h-5 w-5 mr-2" />
                <span className="font-medium">Your Department: {userDepartment}</span>
              </div>
            )}
          </div>
          {(role === "teacher" || role === "admin") && (
            <CreateCourseDialog onCourseCreated={fetchCourses} />
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search courses by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 transition-colors"
              />
            </div>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[220px] h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
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
              <SelectTrigger className="w-[200px] h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl">
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
            
            <Button variant="outline" className="h-12 px-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="mr-2 h-5 w-5" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
                {searchTerm || selectedCategory !== "all" || selectedDepartment !== "all"
                  ? "Try adjusting your search terms or filters to discover more courses"
                  : role === "teacher" 
                    ? "Create your first course to get started on your teaching journey"
                    : "Check back later for exciting new courses"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
