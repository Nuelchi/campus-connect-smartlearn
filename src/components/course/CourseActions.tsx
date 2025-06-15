
import { Button } from "@/components/ui/button";
import { MessageCircle, Play } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;

interface CourseActionsProps {
  course: Course;
  userRole?: string;
  isEnrolled?: boolean;
  onEnroll?: (courseId: string) => void;
  onManage?: (courseId: string) => void;
  onMessageTeacher: () => void;
  onViewCourse: () => void;
}

export default function CourseActions({ 
  course, 
  userRole, 
  isEnrolled, 
  onEnroll, 
  onManage, 
  onMessageTeacher,
  onViewCourse
}: CourseActionsProps) {
  return (
    <div className="space-y-3">
      {/* Message Teacher Button - Show for students when viewing any course */}
      {userRole === "student" && (
        <Button 
          onClick={onMessageTeacher}
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
          onClick={onViewCourse}
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
    </div>
  );
}
