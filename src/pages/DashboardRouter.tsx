
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

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

  // Fallback: unknown role
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 rounded-xl bg-background border shadow text-center">
        <div className="text-2xl font-bold mb-2">No Dashboard Assigned</div>
        <div className="text-muted-foreground mb-4">
          Your account does not have an assigned dashboard yet.<br />Contact your admin if you think this is a mistake.
        </div>
      </div>
    </div>
  );
}
