
import { Users, Calendar, Star } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;

interface CourseStatsProps {
  course: Course;
  enrollmentCount: number;
}

export default function CourseStats({ course, enrollmentCount }: CourseStatsProps) {
  return (
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
  );
}
