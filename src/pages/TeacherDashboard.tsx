
import { Plus, Users, BookOpen, FileText, BarChart } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function TeacherDashboard() {
  // Mock data - replace with real data from your API
  const stats = {
    totalCourses: 8,
    totalStudents: 156,
    totalAssignments: 24,
    completionRate: 78,
  };

  const quickActions = [
    {
      title: "Create Course",
      description: "Add a new course",
      icon: <Plus className="h-6 w-6" />,
      onClick: () => console.log("Create course"),
      variant: "default" as const,
    },
    {
      title: "Manage Students",
      description: "View and manage enrolled students",
      icon: <Users className="h-6 w-6" />,
      onClick: () => console.log("Manage students"),
    },
    {
      title: "Create Assignment",
      description: "Add new assignments",
      icon: <FileText className="h-6 w-6" />,
      onClick: () => console.log("Create assignment"),
    },
    {
      title: "View Analytics",
      description: "Check course performance",
      icon: <BarChart className="h-6 w-6" />,
      onClick: () => console.log("View analytics"),
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "student" as const,
      title: "New Student Enrollment",
      description: "John Doe enrolled in React Basics",
      timestamp: "1 hour ago",
      status: "completed" as const,
    },
    {
      id: "2",
      type: "assignment" as const,
      title: "JavaScript Quiz",
      description: "15 submissions received",
      timestamp: "3 hours ago",
      status: "in-progress" as const,
    },
    {
      id: "3",
      type: "course" as const,
      title: "Python Advanced",
      description: "Course updated with new content",
      timestamp: "1 day ago",
      status: "completed" as const,
    },
  ];

  return (
    <DashboardLayout 
      title="Teacher Dashboard" 
      subtitle="Manage your courses and students"
    >
      <DashboardWelcome roleSpecificMessage="Ready to inspire and educate today?" />
      
      <div className="space-y-8">
        <DashboardStats role="teacher" stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions actions={quickActions} />
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
