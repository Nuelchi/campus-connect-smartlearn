
import { Plus, Users, BookOpen, Settings, Shield, BarChart } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  // Mock data - replace with real data from your API
  const stats = {
    totalCourses: 45,
    totalStudents: 1250,
    totalTeachers: 78,
    totalUsers: 1328,
  };

  const quickActions = [
    {
      title: "User Management",
      description: "Manage all users and roles",
      icon: <Users className="h-6 w-6" />,
      onClick: () => console.log("User management"),
      variant: "default" as const,
    },
    {
      title: "Course Oversight",
      description: "Monitor all courses",
      icon: <BookOpen className="h-6 w-6" />,
      onClick: () => console.log("Course oversight"),
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: <Settings className="h-6 w-6" />,
      onClick: () => console.log("System settings"),
    },
    {
      title: "Security Center",
      description: "Manage security policies",
      icon: <Shield className="h-6 w-6" />,
      onClick: () => console.log("Security center"),
    },
    {
      title: "Analytics Dashboard",
      description: "View platform analytics",
      icon: <BarChart className="h-6 w-6" />,
      onClick: () => navigate("/dashboard?tab=analytics"),
    },
    {
      title: "Add Administrator",
      description: "Create new admin accounts",
      icon: <Plus className="h-6 w-6" />,
      onClick: () => console.log("Add administrator"),
    },
  ];

  const handleTabChange = (value: string) => {
    if (value === "overview") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard?tab=${value}`);
    }
  };

  const currentTab = tab || "overview";

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      subtitle="Platform administration and oversight"
    >
      <DashboardWelcome roleSpecificMessage="Manage and oversee the entire platform." />
      
      <div className="space-y-8">
        <DashboardStats role="admin" stats={stats} />
        
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <QuickActions actions={quickActions} />
              <RecentActivity />
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
