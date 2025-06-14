
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
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
  };
}

export default function DashboardStats({ role, stats }: DashboardStatsProps) {
  if (role === "admin") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Courses"
          value={stats.totalCourses || 0}
          description="Active courses in the platform"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          description="Registered students"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Assignments"
          value={stats.totalAssignments || 0}
          description="Assignments across all courses"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Platform Activity"
          value="92%"
          description="Overall engagement rate"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
    );
  }

  if (role === "teacher") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Courses"
          value={stats.totalCourses || 0}
          description="Courses you're teaching"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          description="Students in your courses"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Assignments"
          value={stats.totalAssignments || 0}
          description="Active assignments"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate || 0}%`}
          description="Average completion rate"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
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
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Pending Assignments"
          value={stats.pendingAssignments || 0}
          description="Assignments due soon"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate || 0}%`}
          description="Your overall progress"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Certificates"
          value="3"
          description="Courses completed"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    );
  }

  return null;
}
