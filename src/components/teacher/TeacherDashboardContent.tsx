
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TeacherCourseManagement from "./TeacherCourseManagement";
import TeacherQuickActions from "./TeacherQuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TeacherDashboardContentProps {
  tab: string | null;
}

export default function TeacherDashboardContent({ tab }: TeacherDashboardContentProps) {
  // Mock data - replace with real data from your API
  const stats = {
    totalCourses: 8,
    totalStudents: 156,
    totalAssignments: 24,
    completionRate: 78,
  };

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
              <TeacherQuickActions />
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
