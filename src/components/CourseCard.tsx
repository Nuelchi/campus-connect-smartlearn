
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { useWebSocketMessages } from "@/hooks/useWebSocketMessages";
import { useCourseMaterials } from "@/hooks/useCourseMaterials";
import { toast } from "@/hooks/use-toast";
import CourseThumbnail from "./course/CourseThumbnail";
import CourseStats from "./course/CourseStats";
import CourseActions from "./course/CourseActions";

type Course = Tables<"courses">;

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
  const { pdfMaterials } = useCourseMaterials(course.id);
  const { startCourseConversation } = useWebSocketMessages();

  const handleViewCourse = () => {
    console.log("Viewing course:", course.id);
    window.location.href = `/course/${course.id}`;
  };

  const handlePdfClick = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const handleMessageTeacher = async () => {
    try {
      const conversationId = await startCourseConversation(course.id);
      if (conversationId) {
        toast({
          title: "Chat started",
          description: "You can now message the course instructor",
        });
        // Navigate to messaging section with conversation ID
        window.location.href = `/dashboard?section=messaging&conversation=${conversationId}`;
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation with instructor",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
      <CourseThumbnail
        course={course}
        pdfMaterials={pdfMaterials}
        onViewCourse={handleViewCourse}
        onPdfClick={handlePdfClick}
      />
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {course.title}
          </CardTitle>
          
          <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-3 text-sm leading-relaxed">
            {course.description}
          </CardDescription>

          <CourseStats course={course} enrollmentCount={enrollmentCount} />
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <CourseActions
          course={course}
          userRole={userRole}
          isEnrolled={isEnrolled}
          onEnroll={onEnroll}
          onManage={onManage}
          onMessageTeacher={handleMessageTeacher}
          onViewCourse={handleViewCourse}
        />
      </CardFooter>
    </Card>
  );
}
