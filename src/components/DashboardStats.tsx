
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, TrendingUp, Trophy, Target, Award, Clock } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";
import { useAuth } from "@/hooks/useAuth";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

function StatCard({ title, value, description, icon, trend, className = "" }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`mr-1 h-3 w-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
            {trend.isPositive ? '+' : ''}{trend.value}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  role: string;
  stats: {
    totalCourses?: number;
    totalStudents?: number;
    totalAssignments?: number;
    completionRate?: number;
    enrolledCourses?: number;
    pendingAssignments?: number;
    totalTeachers?: number;
    totalEnrollments?: number;
    totalSubmissions?: number;
    totalUsers?: number;
  };
}

export default function DashboardStats({ role, stats }: DashboardStatsProps) {
  const { analytics: adminAnalytics, loading: adminLoading } = useAnalytics();
  const { analytics: teacherAnalytics, loading: teacherLoading } = useTeacherAnalytics();
  const { user } = useAuth();

  if (role === "admin") {
    const realStats = adminLoading ? stats : adminAnalytics;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Courses"
          value={realStats.totalCourses || 0}
          description="Active courses in the platform"
          icon={<BookOpen className="h-4 w-4 text-blue-500" />}
          trend={{ value: 12, isPositive: true }}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          title="Total Students"
          value={realStats.totalUsers || 0}
          description="Registered students"
          icon={<Users className="h-4 w-4 text-green-500" />}
          trend={{ value: 8, isPositive: true }}
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="Total Enrollments"
          value={realStats.totalEnrollments || 0}
          description="Course enrollments"
          icon={<Trophy className="h-4 w-4 text-purple-500" />}
          trend={{ value: 15, isPositive: true }}
          className="border-l-4 border-purple-500"
        />
        <StatCard
          title="Total Submissions"
          value={realStats.totalSubmissions || 0}
          description="Assignment submissions"
          icon={<TrendingUp className="h-4 w-4 text-orange-500" />}
          trend={{ value: 22, isPositive: true }}
          className="border-l-4 border-orange-500"
        />
      </div>
    );
  }

  if (role === "teacher") {
    const realStats = teacherLoading ? stats : teacherAnalytics;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Courses"
          value={realStats.totalCourses || 0}
          description="Courses you're teaching"
          icon={<BookOpen className="h-4 w-4 text-blue-500" />}
          className="border-l-4 border-blue-500"
        />
        <StatCard
          title="Total Students"
          value={realStats.totalStudents || 0}
          description="Students in your courses"
          icon={<Users className="h-4 w-4 text-green-500" />}
          className="border-l-4 border-green-500"
        />
        <StatCard
          title="Assignments"
          value={realStats.totalAssignments || 0}
          description="Active assignments"
          icon={<Calendar className="h-4 w-4 text-purple-500" />}
          className="border-l-4 border-purple-500"
        />
        <StatCard
          title="Submissions"
          value={realStats.totalSubmissions || 0}
          description="Total submissions received"
          icon={<TrendingUp className="h-4 w-4 text-orange-500" />}
          className="border-l-4 border-orange-500"
        />
      </div>
    );
  }

  if (role === "student") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={stats.enrolledCourses || 0}
          description="Active course enrollments"
          icon={<BookOpen className="h-4 w-4 text-blue-500" />}
          className="border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingAssignments || 0}
          description="Assignments to complete"
          icon={<Clock className="h-4 w-4 text-orange-500" />}
          className="border-l-4 border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
        />
        <StatCard
          title="Progress"
          value={`${stats.completionRate || 0}%`}
          description="Overall completion rate"
          icon={<Target className="h-4 w-4 text-green-500" />}
          className="border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
        />
        <StatCard
          title="Achievements"
          value="3"
          description="Certificates earned"
          icon={<Award className="h-4 w-4 text-purple-500" />}
          className="border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
        />
      </div>
    );
  }

  return null;
}
