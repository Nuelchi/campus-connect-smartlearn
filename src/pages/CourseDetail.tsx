
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import CourseDetailHeader from "@/components/course/CourseDetailHeader";
import CourseEnrollment from "@/components/course/CourseEnrollment";
import CourseMaterialViewer from "@/components/course/CourseMaterialViewer";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseModules from "@/components/course/CourseModules";
import CourseSyllabus from "@/components/course/CourseSyllabus";

type Course = Tables<"courses">;
type CourseMaterial = Tables<"course_materials">;
type CourseModule = Tables<"course_modules">;

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<CourseMaterial | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    
    fetchCourseData();
    checkEnrollment();
  }, [courseId, user]);

  const fetchCourseData = async () => {
    if (!courseId) return;

    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch course materials
      const { data: materialsData, error: materialsError } = await supabase
        .from("course_materials")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (materialsError) throw materialsError;
      setMaterials(materialsData || []);

      // Fetch course modules
      const { data: modulesData, error: modulesError } = await supabase
        .from("course_modules")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (modulesError) throw modulesError;
      setModules(modulesData || []);

    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user || !courseId) return;

    const { data } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", user.id)
      .eq("course_id", courseId)
      .eq("status", "active")
      .single();

    setIsEnrolled(!!data);
  };

  const handleBack = () => {
    navigate("/dashboard?section=courses");
  };

  const handleEnrollmentChange = (enrolled: boolean) => {
    setIsEnrolled(enrolled);
  };

  const handleMaterialSelect = (material: CourseMaterial) => {
    setSelectedMaterial(material);
  };

  const handleCloseMaterialViewer = () => {
    setSelectedMaterial(null);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-semibold animate-pulse">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course not found</h1>
          <Button onClick={handleBack}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <CourseDetailHeader course={course} onBack={handleBack} />

        {/* Enrollment Section */}
        <div className="flex justify-end">
          <CourseEnrollment
            course={course}
            user={user}
            role={role}
            isEnrolled={isEnrolled}
            onEnrollmentChange={handleEnrollmentChange}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Viewer - Full Width if Material Selected */}
          {selectedMaterial && (
            <CourseMaterialViewer
              material={selectedMaterial}
              isFullscreen={isFullscreen}
              onClose={handleCloseMaterialViewer}
              onFullscreen={handleToggleFullscreen}
            />
          )}

          {/* Main Content */}
          <div className={selectedMaterial ? "lg:col-span-2" : "lg:col-span-2"}>
            <CourseSyllabus syllabus={course.syllabus || ""} />
            <CourseModules modules={modules} />
          </div>

          {/* Sidebar */}
          <div className={selectedMaterial ? "lg:col-span-1" : ""}>
            <CourseSidebar
              materials={materials}
              isEnrolled={isEnrolled}
              role={role}
              selectedMaterial={selectedMaterial}
              onMaterialSelect={handleMaterialSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
