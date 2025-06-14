
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Users, Settings, LayoutDashboard, FileText, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import DashboardStats from "@/components/DashboardStats";
import CourseManagement from "@/components/CourseManagement";
import { supabase } from "@/integrations/supabase/client";

export default function TeacherDashboard() {
  const { signOut, user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Fetch teacher's courses
      const { data: courses, count: coursesCount } = await supabase
        .from("courses")
        .select("id", { count: "exact" })
        .eq("instructor_id", user.id);

      // Fetch total students in teacher's courses
      let studentsCount = 0;
      if (courses && courses.length > 0) {
        const courseIds = courses.map(c => c.id);
        const { count } = await supabase
          .from("enrollments")
          .select("*", { count: "exact", head: true })
          .in("course_id", courseIds)
          .eq("status", "active");
        studentsCount = count || 0;
      }

      // Fetch assignments in teacher's courses
      let assignmentsCount = 0;
      if (courses && courses.length > 0) {
        const courseIds = courses.map(c => c.id);
        const { count } = await supabase
          .from("assignments")
          .select("*", { count: "exact", head: true })
          .in("course_id", courseIds);
        assignmentsCount = count || 0;
      }

      setStats({
        totalCourses: coursesCount || 0,
        totalStudents: studentsCount,
        totalAssignments: assignmentsCount,
        completionRate: 85, // Mock data for now
      });
    };

    fetchStats();
  }, [user]);

  return (
    <div className="flex h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="bg-background border-r w-64 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Book className="text-primary" />
          <span className="font-bold text-xl">Teacher Panel</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Book className="mr-2 h-4 w-4" />
            My Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Students
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Assignments
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start">
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your courses, track student progress, and create engaging content.
            </p>
          </div>

          {/* Stats */}
          <DashboardStats role="teacher" stats={stats} />

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
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
                        <span className="text-sm">New student enrolled in Mathematics 101</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Assignment submissions received: 12</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Upcoming assignment deadline in 2 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Assignment
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Book className="mr-2 h-4 w-4" />
                      Add Course Material
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Bell className="mr-2 h-4 w-4" />
                      Send Announcement
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <CourseManagement />
            </TabsContent>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Student Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Student management functionality coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Assignment management functionality coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
