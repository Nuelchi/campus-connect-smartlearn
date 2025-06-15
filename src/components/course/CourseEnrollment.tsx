
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;

interface CourseEnrollmentProps {
  course: Course;
  user: any;
  role: string | null;
  isEnrolled: boolean;
  onEnrollmentChange: (enrolled: boolean) => void;
}

export default function CourseEnrollment({ 
  course, 
  user, 
  role, 
  isEnrolled, 
  onEnrollmentChange 
}: CourseEnrollmentProps) {
  const handleEnroll = async () => {
    if (!user || !course.id) return;

    try {
      const { error } = await supabase
        .from("enrollments")
        .insert({
          student_id: user.id,
          course_id: course.id
        });

      if (error) throw error;

      onEnrollmentChange(true);
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

  if (role !== "student") return null;

  return (
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
  );
}
