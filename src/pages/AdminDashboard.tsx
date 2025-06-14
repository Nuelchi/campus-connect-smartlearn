
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Users, Settings, LayoutDashboard, Bell, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import DashboardStats from "@/components/DashboardStats";
import CourseManagement from "@/components/CourseManagement";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch total courses
      const { count: coursesCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      // Fetch total students (users with student role)
      const { count: studentsCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      // Fetch total assignments
      const { count: assignmentsCount } = await supabase
        .from("assignments")
        .select("*", { count: "exact", head: true });

      setStats({
        totalCourses: coursesCount || 0,
        totalStudents: studentsCount || 0,
        totalAssignments: assignmentsCount || 0,
      });
    };

    fetchStats();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "courses":
        return <CourseManagement />;
      case "users":
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management functionality coming soon...</p>
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
              <p className="text-muted-foreground">Advanced analytics coming soon...</p>
            </CardContent>
          </Card>
        );
      case "notifications":
        return <NotificationCenter />;
      case "settings":
        return <SettingsPanel />;
      default:
        return (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                        <span className="text-sm">New course "Advanced Mathematics" created</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">5 new students enrolled today</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Assignment deadline approaching</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Server Status</span>
                        <span className="text-green-600 text-sm font-medium">Healthy</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Database</span>
                        <span className="text-green-600 text-sm font-medium">Connected</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Storage</span>
                        <span className="text-green-600 text-sm font-medium">Available</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <CourseManagement />
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">User management functionality coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Advanced analytics coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="bg-background border-r w-64 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Book className="text-primary" />
          <span className="font-bold text-xl">Admin Panel</span>
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
            Courses
          </Button>
          <Button 
            variant={activeSection === "users" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSection("users")}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button 
            variant={activeSection === "analytics" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSection("analytics")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
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
        
        <Button onClick={signOut} variant="outline" className="w-full mt-4">
          Sign Out
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="space-y-8">
          {/* Header */}
          {activeSection === "dashboard" && (
            <>
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your learning management system and monitor platform activity.
                </p>
              </div>
              {/* Stats */}
              <DashboardStats role="admin" stats={stats} />
            </>
          )}

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
