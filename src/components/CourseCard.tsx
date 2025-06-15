import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Users, Calendar, BookOpen, Play, Star, MessageCircle, ExternalLink } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useWebSocketMessages } from "@/hooks/useWebSocketMessages";
import { toast } from "@/hooks/use-toast";

type Course = Tables<"courses">;
type CourseMaterial = Tables<"course_materials">;

interface CourseCardProps {
  course: Course;
  enrollmentCount?: number;
  onEnroll?: (courseId: string) => void;
  onManage?: (courseId: string) => void;
  userRole?: string;
  isEnrolled?: boolean;
}

export default function CourseCard({ 
  course, 
  enrollmentCount = 0, 
  onEnroll, 
  onManage, 
  userRole,
  isEnrolled = false 
}: CourseCardProps) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const { startCourseConversation } = useWebSocketMessages();

  useEffect(() => {
    fetchCourseMaterials();
  }, [course.id]);

  const fetchCourseMaterials = async () => {
    const { data, error } = await supabase
      .from("course_materials")
      .select("*")
      .eq("course_id", course.id)
      .eq("content_type", "PDF");

    if (!error && data) {
      setMaterials(data);
    }
  };

  const handleViewCourse = () => {
    console.log("Viewing course:", course.id);
    window.location.href = `/course/${course.id}`;
  };

  const handlePdfClick = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const handleMessageTeacher = async () => {
    try {
      await startCourseConversation(course.id);
      toast({
        title: "Chat started",
        description: "You can now message the course instructor",
      });
      // Navigate to messaging section
      window.location.href = "/dashboard?section=messaging";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start conversation with instructor",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string | null) => {
    if (!category) return "bg-gray-500";
    const colors = {
      "Computer Science": "bg-blue-500",
      "Mathematics": "bg-purple-500", 
      "Physics": "bg-green-500",
      "Chemistry": "bg-red-500",
      "Biology": "bg-teal-500",
      "Engineering": "bg-orange-500",
      "Business": "bg-indigo-500",
      "Arts": "bg-pink-500",
    };
    return colors[category as keyof typeof colors] || "bg-slate-500";
  };

  const pdfMaterials = materials.filter(material => 
    material.file_url && (material.file_url.endsWith('.pdf') || material.content_type === 'PDF')
  );

  return (
    <Card className="group overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      {/* Thumbnail Section */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={16 / 9}>
          {course.image_url ? (
            <img 
              src={course.image_url} 
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full ${getCategoryColor(course.category)} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20"></div>
              <BookOpen className="h-16 w-16 text-white/80" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg line-clamp-2">{course.title}</h3>
              </div>
            </div>
          )}
        </AspectRatio>
        
        {/* PDF Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {pdfMaterials.length > 0 ? (
            <div className="w-full h-full p-4 flex flex-col">
              <div className="flex-1 bg-white rounded-lg overflow-hidden mb-4 relative flex items-center justify-center">
                {/* PDF Preview placeholder */}
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">PDF Preview</p>
                  <p className="text-xs text-gray-500">{pdfMaterials[0].title}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handlePdfClick(pdfMaterials[0].file_url!)}
                  size="sm" 
                  className="bg-white/90 text-black hover:bg-white flex-1"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open PDF
                </Button>
                <Button 
                  onClick={handleViewCourse}
                  size="sm" 
                  className="bg-blue-500/90 text-white hover:bg-blue-600 flex-1"
                >
                  <Play className="mr-2 h-4 w-4" />
                  View Course
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={handleViewCourse}
              size="lg" 
              className="bg-white/90 text-black hover:bg-white transform scale-90 group-hover:scale-100 transition-transform duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              View Course
            </Button>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge 
            variant={course.is_active ? "default" : "secondary"}
            className={`${course.is_active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} text-white border-0`}
          >
            {course.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Category Badge */}
        {course.category && (
          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(course.category)} text-white border-0 text-xs`}>
              {course.category}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {course.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed">
            {course.description}
          </CardDescription>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2">
            <div className="flex items-center gap-1">
              <Users size={16} className="text-blue-500" />
              <span className="font-medium">{enrollmentCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} className="text-green-500" />
              <span>{new Date(course.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 space-y-3">
        {/* Message Teacher Button - Show for students when viewing any course */}
        {userRole === "student" && (
          <Button 
            onClick={handleMessageTeacher}
            variant="outline" 
            className="w-full h-11 font-semibold border-2 hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Message Instructor
          </Button>
        )}

        {userRole === "student" && !isEnrolled && onEnroll && (
          <Button 
            onClick={() => onEnroll(course.id)} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-11 font-semibold"
            disabled={!course.is_active}
          >
            Enroll Now
          </Button>
        )}
        
        {userRole === "student" && isEnrolled && (
          <Button 
            onClick={handleViewCourse}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white border-0 h-11 font-semibold"
          >
            <Play className="mr-2 h-4 w-4" />
            Continue Learning
          </Button>
        )}
        
        {(userRole === "teacher" || userRole === "admin") && onManage && (
          <Button 
            onClick={() => onManage(course.id)} 
            variant="outline" 
            className="w-full h-11 font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Manage Course
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
