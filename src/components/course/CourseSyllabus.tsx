
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseSyllabusProps {
  syllabus: string;
}

export default function CourseSyllabus({ syllabus }: CourseSyllabusProps) {
  if (!syllabus) return null;

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl mb-6">
      <CardHeader>
        <CardTitle>Course Syllabus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose dark:prose-invert max-w-none">
          <p className="whitespace-pre-wrap">{syllabus}</p>
        </div>
      </CardContent>
    </Card>
  );
}
