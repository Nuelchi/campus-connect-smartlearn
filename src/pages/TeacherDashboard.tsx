
import { Plus, Users, BookOpen, FileText, BarChart } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TeacherCourseManagement from "@/components/teacher/TeacherCourseManagement";
import MessagingCenter from "@/components/teacher/MessagingCenter";
import Gradebook from "@/components/teacher/Gradebook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeacherDashboard() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const tab = searchParams.get("tab");

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
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", "courses");
        url.searchParams.set("action", "create");
        window.history.pushState({}, "", url);
      },
      variant: "default" as const,
    },
    {
      title: "Manage Students",
      description: "View and manage enrolled students",
      icon: <Users className="h-6 w-6" />,
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("section", "students");
        window.history.pushState({}, "", url);
      },
    },
    {
      title: "Create Assignment",
      description: "Add new assignments",
      icon: <FileText className="h-6 w-6" />,
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("section", "assignments");
        url.searchParams.set("action", "create");
        window.history.pushState({}, "", url);
      },
    },
    {
      title: "View Analytics",
      description: "Check course performance",
      icon: <BarChart className="h-6 w-6" />,
      onClick: () => {
        const url = new URL(window.location.href);
        url.searchParams.set("section", "analytics");
        window.history.pushState({}, "", url);
      },
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

  // Render content based on section parameter
  const renderSectionContent = () => {
    switch (section) {
      case "messaging":
        return <MessagingCenter />;
      case "gradebook":
        return <Gradebook />;
      case "students":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Student management functionality coming soon...</p>
            </CardContent>
          </Card>
        );
      case "assignments":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Assignment Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Assignment management functionality coming soon...</p>
            </CardContent>
          </Card>
        );
      case "analytics":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics dashboard coming soon...</p>
            </CardContent>
          </Card>
        );
      case "calendar":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Calendar functionality coming soon...</p>
            </CardContent>
          </Card>
        );
      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Notification center coming soon...</p>
            </CardContent>
          </Card>
        );
      case "help":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Help and support resources coming soon...</p>
            </CardContent>
          </Card>
        );
      case "settings":
      case "account":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Settings panel coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        // Default dashboard view
        return (
          <>
            <DashboardWelcome roleSpecificMessage="Ready to inspire and educate today?" />
            
            <div className="space-y-8">
              <DashboardStats role="teacher" stats={stats} />
              
              <Tabs defaultValue={tab || "overview"} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
                  <TabsTrigger value="courses">Course Management</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <QuickActions actions={quickActions} />
                    <RecentActivity activities={recentActivities} />
                  </div>
                </TabsContent>
                
                <TabsContent value="courses">
                  <TeacherCourseManagement />
                </TabsContent>
              </Tabs>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout 
      title="Teacher Dashboard" 
      subtitle="Manage your courses and students"
    >
      {renderSectionContent()}
    </DashboardLayout>
  );
}
