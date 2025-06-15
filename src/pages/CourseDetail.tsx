
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, BookOpen, Download, Eye, Maximize, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

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

  const handleEnroll = async () => {
    if (!user || !courseId) return;

    try {
      const { error } = await supabase
        .from("enrollments")
        .insert({
          student_id: user.id,
          course_id: courseId
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast({
        title: "Success",
        description: "Successfully enrolled in the course!",
      });
    } catch (error) {
      console.error("Error enrolling:", error);
      toast({
        title: "Error",
        description: "Failed to enroll in the course",
        variant: "destructive",
      });
    }
  };

  const handleMaterialClick = (material: CourseMaterial) => {
    if (material.file_url) {
      window.open(material.file_url, '_blank');
    } else if (material.external_url) {
      window.open(material.external_url, '_blank');
    }
  };

  const renderMaterialViewer = (material: CourseMaterial) => {
    const embedStyle = "w-full h-full border-0 rounded-lg";
    
    if (material.file_url && (material.file_url.endsWith('.pdf') || material.content_type === 'PDF')) {
      return (
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsFullscreen(true)}
              className="bg-black/70 text-white hover:bg-black/80"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedMaterial(null)}
              className="bg-black/70 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <iframe 
            src={material.file_url}
            className={embedStyle}
            style={{ height: '600px' }}
            title="PDF Viewer"
          />
        </div>
      );
    }
    
    if (material.file_url?.match(/\.(mp4|mov|mkv|webm)$/)) {
      return (
        <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedMaterial(null)}
            className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </Button>
          <video 
            controls 
            className={`${embedStyle} h-[600px] object-contain`}
            src={material.file_url}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    if (material.external_url?.includes('youtube.com') || material.external_url?.includes('youtu.be')) {
      const videoId = material.external_url.match(/(?:youtube\.com\/(?:.*v=|.*\/|.*embed\/)|youtu\.be\/)([^"&?\/\s]+)/)?.[1];
      if (videoId) {
        return (
          <div className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedMaterial(null)}
              className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </Button>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className={`${embedStyle} h-[600px]`}
              allowFullScreen
            />
          </div>
        );
      }
    }
    
    if (material.file_url?.endsWith('.docx')) {
      return (
        <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedMaterial(null)}
            className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
          >
            <X className="h-4 w-4" />
          </Button>
          <iframe
            src={`https://docs.google.com/gview?url=${material.file_url}&embedded=true`}
            className={`${embedStyle} h-[600px]`}
          />
        </div>
      );
    }
    
    // Default case - try to display the file
    return (
      <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setSelectedMaterial(null)}
          className="absolute top-3 right-3 z-10 bg-black/70 text-white hover:bg-black/80"
        >
          <X className="h-4 w-4" />
        </Button>
        <iframe
          src={material.file_url || material.external_url || ''}
          className={`${embedStyle} h-[600px]`}
        />
      </div>
    );
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
          <Button onClick={() => navigate("/dashboard?section=courses")}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      {/* Fullscreen PDF Modal */}
      {isFullscreen && selectedMaterial && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={() => setIsFullscreen(false)}
              variant="secondary"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <X className="h-4 w-4" />
              Exit Fullscreen
            </Button>
          </div>
          <iframe 
            src={selectedMaterial.file_url || ''}
            className="w-full h-full"
            title="PDF Viewer"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard?section=courses")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        {/* Course Header */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-6">
              {course.image_url ? (
                <img 
                  src={course.image_url} 
                  alt={course.title}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full md:w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
              )}
              
              <div className="flex-1 space-y-4">
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">{course.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">{course.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {course.category && (
                    <Badge variant="secondary">{course.category}</Badge>
                  )}
                  {course.department && (
                    <Badge variant="outline">{course.department}</Badge>
                  )}
                  <Badge variant={course.is_active ? "default" : "secondary"}>
                    {course.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Enrollment Button */}
                {role === "student" && (
                  <div className="pt-4">
                    {!isEnrolled ? (
                      <Button 
                        onClick={handleEnroll}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        disabled={!course.is_active}
                      >
                        Enroll in Course
                      </Button>
                    ) : (
                      <Badge className="bg-green-500 text-white">Enrolled</Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Viewer - Full Width if Material Selected */}
          {selectedMaterial && (
            <div className="lg:col-span-3 mb-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Viewing: {selectedMaterial.title}</span>
                    <Badge variant="outline">{selectedMaterial.content_type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderMaterialViewer(selectedMaterial)}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className={selectedMaterial ? "lg:col-span-2" : "lg:col-span-2"}>
            {/* Syllabus */}
            {course?.syllabus && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl mb-6">
                <CardHeader>
                  <CardTitle>Course Syllabus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{course.syllabus}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Course Modules */}
            {modules.length > 0 && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Course Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={module.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          Module {index + 1}: {module.title}
                        </h3>
                        {module.description && (
                          <p className="text-gray-600 dark:text-gray-300">{module.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className={selectedMaterial ? "lg:col-span-1" : "space-y-6"}>
            {/* Course Materials */}
            {(isEnrolled || role === "teacher" || role === "admin") && materials.length > 0 && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <div 
                        key={material.id}
                        className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                          selectedMaterial?.id === material.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''
                        }`}
                        onClick={() => setSelectedMaterial(material)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{material.title}</h4>
                          <p className="text-xs text-gray-500">{material.content_type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {material.file_url && (
                            <Eye className="h-4 w-4 text-blue-500" />
                          )}
                          {material.external_url && (
                            <Eye className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Access Notice for Non-Enrolled Students */}
            {role === "student" && !isEnrolled && materials.length > 0 && (
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BookOpen className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Enroll to Access Materials
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Course materials are available after enrollment
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
