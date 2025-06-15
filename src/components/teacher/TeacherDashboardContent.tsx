
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/DashboardStats";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TeacherCourseManagement from "./TeacherCourseManagement";
import TeacherQuickActions from "./TeacherQuickActions";
import TeacherAnalyticsDashboard from "./TeacherAnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";

interface TeacherDashboardContentProps {
  tab: string | null;
}

export default function TeacherDashboardContent({ tab }: TeacherDashboardContentProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { analytics, loading } = useTeacherAnalytics();
  
  console.log("TeacherDashboardContent - tab:", tab);

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    if (value === "overview") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard?tab=${value}`);
    }
  };

  const currentTab = tab || "overview";

  return (
    <>
      <DashboardWelcome roleSpecificMessage="Ready to inspire and educate today? 📚" />
      
      <div className="space-y-8">
        <DashboardStats 
          role="teacher" 
          stats={{
            totalCourses: analytics.totalCourses,
            totalStudents: analytics.totalStudents,
            totalAssignments: analytics.totalAssignments,
            totalSubmissions: analytics.totalSubmissions,
          }} 
        />
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TeacherQuickActions />
              <RecentActivity />
            </div>
          </TabsContent>
          
          <TabsContent value="courses">
            <TeacherCourseManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <TeacherAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
