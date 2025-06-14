
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import RoleSelector from "@/components/RoleSelector";

// This handles redirect for users without a dashboard role, or not logged in
export default function DashboardRouter() {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-semibold animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  // Show dashboard matching user role
  if (role === "admin") return <AdminDashboard />;
  if (role === "teacher") return <TeacherDashboard />;
  if (role === "student" || role === "user") return <StudentDashboard />;

  // If user is logged in but has no role, show role selector
  if (user && !role) {
    return <RoleSelector />;
  }

  // Fallback: should not reach here normally
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
