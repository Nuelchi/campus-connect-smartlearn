
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
import DashboardNavbar from "@/components/DashboardNavbar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  totalActiveCourses: number;
  totalStudents: number;
  totalTeachers: number;
  totalAssignments: number;
  totalEnrollments: number;
  totalSubmissions: number;
  totalUsers: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  user_email: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [stats, setStats] = useState<AdminStats>({
    totalActiveCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAssignments: 0,
    totalEnrollments: 0,
    totalSubmissions: 0,
    totalUsers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (user && role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
    }
  }, [user, role, toast]);

  const fetchAdminStats = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_dashboard_stats")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching admin stats:", error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard statistics.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setStats({
          totalActiveCourses: data.total_active_courses || 0,
          totalStudents: data.total_students || 0,
          totalTeachers: data.total_teachers || 0,
          totalAssignments: data.total_assignments || 0,
          totalEnrollments: data.total_enrollments || 0,
          totalSubmissions: data.total_submissions || 0,
          totalUsers: data.total_users || 0,
        });
      }
    } catch (error) {
      console.error("Error in fetchAdminStats:", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase.rpc("get_recent_activity", {
        limit_count: 10,
      });

      if (error) {
        console.error("Error fetching recent activity:", error);
        return;
      }

      if (data) {
        setRecentActivity(data);
      }
    } catch (error) {
      console.error("Error in fetchRecentActivity:", error);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user || role !== 'admin') return;
      
      setLoading(true);
      await Promise.all([fetchAdminStats(), fetchRecentActivity()]);
      setLoading(false);
    };

    loadDashboardData();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);

    return () => clearInterval(interval);
  }, [user, role]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_created':
        return 'bg-green-500';
      case 'student_enrolled':
        return 'bg-blue-500';
      case 'assignment_created':
        return 'bg-purple-500';
      case 'submission_created':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

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
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading dashboard data...</div>
              </div>
            ) : (
              <>
                <DashboardStats 
                  role="admin" 
                  stats={{
                    totalCourses: stats.totalActiveCourses,
                    totalStudents: stats.totalStudents,
                    totalAssignments: stats.totalAssignments,
                    totalTeachers: stats.totalTeachers,
                    totalEnrollments: stats.totalEnrollments,
                    totalSubmissions: stats.totalSubmissions,
                    totalUsers: stats.totalUsers,
                  }} 
                />
                
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
                            {recentActivity.length > 0 ? (
                              recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${getActivityIcon(activity.type)}`}></div>
                                  <div className="flex-1">
                                    <span className="text-sm">{activity.description}</span>
                                    <div className="text-xs text-muted-foreground">
                                      by {activity.user_email} • {formatTimeAgo(activity.created_at)}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">No recent activity</div>
                            )}
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
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Last Updated</span>
                              <span className="text-blue-600 text-sm font-medium">Just now</span>
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
              </>
            )}
          </div>
        );
    }
  };

  // Don't render anything if user is not admin
  if (role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-8 rounded-xl bg-background border shadow text-center">
          <div className="text-2xl font-bold mb-2">Access Denied</div>
          <div className="text-muted-foreground mb-4">
            You don't have permission to access the admin dashboard.
          </div>
          <Button onClick={() => window.location.href = '/login'}>Sign Out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardNavbar 
        title="Admin Dashboard" 
        subtitle="Manage your learning management system and monitor platform activity"
      />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="bg-background border-r w-64 min-h-[calc(100vh-4rem)] p-6 flex flex-col">
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
