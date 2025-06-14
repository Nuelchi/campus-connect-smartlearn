
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import RoleSelector from "@/components/RoleSelector";

// This handles redirect for users without a dashboard role, or not logged in
export default function DashboardRouter() {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [roleCheckAttempted, setRoleCheckAttempted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    
    // Mark initial load as complete only when we're not loading anymore
    if (!loading) {
      setInitialLoadComplete(true);
      // Give time for role to be fetched after auth completes
      setTimeout(() => {
        setRoleCheckAttempted(true);
      }, 500);
    }
  }, [user, loading, navigate]);

  // Show loading during initial auth check or while waiting for role check
  if (loading || !initialLoadComplete || (user && !roleCheckAttempted)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  // If user is not logged in, redirect to login (handled by useEffect above)
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-8 rounded-xl bg-background border shadow text-center">
          <div className="text-2xl font-bold mb-2">Authentication Required</div>
          <div className="text-muted-foreground mb-4">
            Please log in to access your dashboard.
          </div>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  // Show dashboard matching user role
  if (role === "admin") return <AdminDashboard />;
  if (role === "teacher") return <TeacherDashboard />;
  if (role === "student") return <StudentDashboard />;

  // Only show role selector if user is logged in but has no role AND we've actually checked for it
  if (role === null && roleCheckAttempted) {
    return <RoleSelector />;
  }

  // If role is "user" or any other value, default to student dashboard
  return <StudentDashboard />;
}
