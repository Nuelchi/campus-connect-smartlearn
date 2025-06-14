
import { Plus, BookOpen, Calendar, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function StudentDashboard() {
  // Mock data - replace with real data from your API
  const stats = {
    enrolledCourses: 5,
    pendingAssignments: 3,
    completionRate: 85,
  };

  const quickActions = [
    {
      title: "Browse Courses",
      description: "Find new courses to enroll in",
      icon: <BookOpen className="h-6 w-6" />,
      onClick: () => console.log("Browse courses"),
    },
    {
      title: "View Assignments",
      description: "Check your pending assignments",
      icon: <Calendar className="h-6 w-6" />,
      onClick: () => console.log("View assignments"),
    },
    {
      title: "My Certificates",
      description: "View your earned certificates",
      icon: <Award className="h-6 w-6" />,
      onClick: () => console.log("View certificates"),
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "assignment" as const,
      title: "Math Assignment #3",
      description: "Due in 2 days",
      timestamp: "2 hours ago",
      status: "pending" as const,
    },
    {
      id: "2",
      type: "course" as const,
      title: "JavaScript Basics",
      description: "New lesson available",
      timestamp: "1 day ago",
      status: "in-progress" as const,
    },
    {
      id: "3",
      type: "submission" as const,
      title: "History Essay",
      description: "Submitted successfully",
      timestamp: "3 days ago",
      status: "completed" as const,
    },
  ];

  return (
    <DashboardLayout 
      title="Student Dashboard" 
      subtitle="Manage your learning journey"
    >
      <DashboardWelcome roleSpecificMessage="Ready to continue your learning journey?" />
      
      <div className="space-y-8">
        <DashboardStats role="student" stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions actions={quickActions} />
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
