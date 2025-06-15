
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, ExternalLink } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;
type CourseMaterial = Tables<"course_materials">;

interface CourseThumbnailProps {
  course: Course;
  pdfMaterials: CourseMaterial[];
  onViewCourse: () => void;
  onPdfClick: (url: string) => void;
}

export default function CourseThumbnail({ 
  course, 
  pdfMaterials, 
  onViewCourse, 
  onPdfClick 
}: CourseThumbnailProps) {
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

  return (
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
                onClick={() => onPdfClick(pdfMaterials[0].file_url!)}
                size="sm" 
                className="bg-white/90 text-black hover:bg-white flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open PDF
              </Button>
              <Button 
                onClick={onViewCourse}
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
            onClick={onViewCourse}
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
  );
}
