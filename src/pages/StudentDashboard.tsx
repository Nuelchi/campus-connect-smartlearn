
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Settings, LayoutDashboard, FileText, Trophy, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import DashboardStats from "@/components/DashboardStats";
import CourseManagement from "@/components/CourseManagement";
import AssignmentManagement from "@/components/dashboard/AssignmentManagement";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import CertificateCenter from "@/components/dashboard/CertificateCenter";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import DashboardNavbar from "@/components/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    pendingAssignments: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Fetch enrolled courses
      const { count: enrolledCount } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)
        .eq("status", "active");

      // Fetch pending assignments (mock for now)
      const pendingAssignments = 3; // Mock data

      setStats({
        enrolledCourses: enrolledCount || 0,
        pendingAssignments: pendingAssignments,
        completionRate: 78, // Mock data
      });
    };

    fetchStats();
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case "courses":
        return <CourseManagement />;
      case "assignments":
        return <AssignmentManagement userRole="student" />;
      case "certificates":
        return <CertificateCenter />;
      case "notifications":
        return <NotificationCenter />;
      case "settings":
        return <SettingsPanel />;
      default:
        return (
          <div className="space-y-6">
            <DashboardStats role="student" stats={stats} />
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Browse Courses</TabsTrigger>
                <TabsTrigger value="mycourses">My Courses</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Completed Module 3 in Mathematics 101</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Submitted assignment for Physics</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">New assignment posted in Chemistry</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Physics Lab Report</span>
                          <span className="text-red-600 text-sm font-medium">2 days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Math Problem Set</span>
                          <span className="text-yellow-600 text-sm font-medium">5 days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Chemistry Quiz</span>
                          <span className="text-green-600 text-sm font-medium">1 week</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <CourseManagement />
              </TabsContent>

              <TabsContent value="mycourses">
                <Card>
                  <CardHeader>
                    <CardTitle>My Enrolled Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">My courses view coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assignments">
                <AssignmentManagement userRole="student" />
              </TabsContent>
            </Tabs>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardNavbar 
        title="Student Dashboard" 
        subtitle="Track your learning progress and discover new courses"
      />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="bg-background border-r w-64 min-h-[calc(100vh-4rem)] p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Book className="text-primary" />
            <span className="font-bold text-xl">Student Panel</span>
          </div>
          
          <nav className="space-y-2 flex-1">
            <Button 
              variant={activeSection === "dashboard" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant={activeSection === "courses" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("courses")}
            >
              <Book className="mr-2 h-4 w-4" />
              My Courses
            </Button>
            <Button 
              variant={activeSection === "assignments" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("assignments")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Assignments
            </Button>
            <Button 
              variant={activeSection === "certificates" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("certificates")}
            >
              <Trophy className="mr-2 h-4 w-4" />
              Certificates
            </Button>
            <Button 
              variant={activeSection === "notifications" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button 
              variant={activeSection === "settings" ? "default" : "ghost"} 
              className="w-full justify-start"
              onClick={() => setActiveSection("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
