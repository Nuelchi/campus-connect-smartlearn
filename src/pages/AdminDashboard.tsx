import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Users, Settings, LayoutDashboard, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import DashboardStats from "@/components/DashboardStats";
import CourseManagement from "@/components/CourseManagement";
import AssignmentManagement from "@/components/dashboard/AssignmentManagement";
import StudentManagement from "@/components/dashboard/StudentManagement";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const { signOut, user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalAssignments: 0,
    totalEnrollments: 0,
    totalSubmissions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total teachers
      const { count: teachersCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "teacher");

      // Fetch total students
      const { count: studentsCount } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      // Fetch total courses
      const { count: coursesCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      // Fetch total assignments
      const { count: assignmentsCount } = await supabase
        .from("assignments")
        .select("*", { count: "exact", head: true });

      // Fetch total enrollments
      const { count: enrollmentsCount } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true });

      // Fetch total submissions (mock for now)
      const totalSubmissions = 150; // Mock data

      setStats({
        totalUsers: usersCount || 0,
        totalTeachers: teachersCount || 0,
        totalStudents: studentsCount || 0,
        totalCourses: coursesCount || 0,
        totalAssignments: assignmentsCount || 0,
        totalEnrollments: enrollmentsCount || 0,
        totalSubmissions: totalSubmissions,
      });
    };

    fetchStats();
  }, [user]);

  const renderContent = () => {
    switch (activeSection) {
      case "courses":
        return <CourseManagement />;
      case "students":
        return <StudentManagement />;
      case "assignments":
        return <AssignmentManagement userRole="admin" />;
      case "notifications":
        return <NotificationCenter />;
      case "settings":
        return <SettingsPanel />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage users, monitor activity, and oversee the entire learning platform.
              </p>
            </div>
            <DashboardStats role="admin" stats={{
              totalCourses: stats.totalCourses,
              totalStudents: stats.totalStudents,
              totalAssignments: stats.totalAssignments,
              completionRate: 85 // Mock data for now
            }} />
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Total Users: {stats.totalUsers}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Total Courses: {stats.totalCourses}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Total Assignments: {stats.totalAssignments}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">New user registered</span>
                        <span className="text-muted-foreground text-sm">5 minutes ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Course "Mathematics 101" created</span>
                        <span className="text-muted-foreground text-sm">30 minutes ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Assignment "Physics Lab Report" submitted</span>
                        <span className="text-muted-foreground text-sm">1 hour ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="courses">
                <CourseManagement />
              </TabsContent>

              <TabsContent value="students">
                <StudentManagement />
              </TabsContent>

              <TabsContent value="assignments">
                <AssignmentManagement userRole="admin" />
              </TabsContent>
            </Tabs>
          </div>
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
            variant={activeSection === "students" ? "default" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveSection("students")}
          >
            <Users className="mr-2 h-4 w-4" />
            Students
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
                  Manage users, monitor activity, and oversee the entire learning platform.
                </p>
              </div>
              {/* Stats */}
              <DashboardStats 
                role="admin" 
                stats={{
                  totalCourses: stats.totalCourses,
                  totalStudents: stats.totalStudents,
                  totalAssignments: stats.totalAssignments,
                  completionRate: 85 // Mock data for now
                }} 
              />
            </>
          )}

          {/* Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
