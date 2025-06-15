
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;

interface CourseDetailHeaderProps {
  course: Course;
  onBack: () => void;
}

export default function CourseDetailHeader({ course, onBack }: CourseDetailHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
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
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
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
            </div>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}
