
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Eye } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type CourseMaterial = Tables<"course_materials">;

interface CourseSidebarProps {
  materials: CourseMaterial[];
  isEnrolled: boolean;
  role: string | null;
  selectedMaterial: CourseMaterial | null;
  onMaterialSelect: (material: CourseMaterial) => void;
}

export default function CourseSidebar({ 
  materials, 
  isEnrolled, 
  role, 
  selectedMaterial, 
  onMaterialSelect 
}: CourseSidebarProps) {
  return (
    <div className="space-y-6">
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
                  onClick={() => onMaterialSelect(material)}
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
  );
}
