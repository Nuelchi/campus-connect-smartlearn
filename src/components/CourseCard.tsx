
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

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
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <CardDescription className="line-clamp-2">{course.description}</CardDescription>
          </div>
          <Badge variant={course.is_active ? "default" : "secondary"}>
            {course.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {course.image_url && (
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-32 object-cover rounded-md mb-4"
          />
        )}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{enrollmentCount} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{new Date(course.created_at).toLocaleDateString()}</span>
          </div>
          {course.category && (
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{course.category}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        {userRole === "student" && !isEnrolled && onEnroll && (
          <Button 
            onClick={() => onEnroll(course.id)} 
            className="w-full"
            disabled={!course.is_active}
          >
            Enroll Now
          </Button>
        )}
        {userRole === "student" && isEnrolled && (
          <Button variant="outline" className="w-full">
            View Course
          </Button>
        )}
        {(userRole === "teacher" || userRole === "admin") && onManage && (
          <Button 
            onClick={() => onManage(course.id)} 
            variant="outline" 
            className="w-full"
          >
            Manage Course
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
