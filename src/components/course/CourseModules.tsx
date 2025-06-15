
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

type CourseModule = Tables<"course_modules">;

interface CourseModulesProps {
  modules: CourseModule[];
}

export default function CourseModules({ modules }: CourseModulesProps) {
  if (modules.length === 0) return null;

  return (
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
  );
}
