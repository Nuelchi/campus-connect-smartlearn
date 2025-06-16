
import { Plus, BookOpen, Calendar, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardWelcome from "@/components/dashboard/DashboardWelcome";
import DashboardStats from "@/components/DashboardStats";
import StudentQuickActions from "@/components/student/StudentQuickActions";
import StudentRecentActivity from "@/components/student/StudentRecentActivity";
import StudentSectionRenderer from "@/components/student/StudentSectionRenderer";
import { useSearchParams } from "react-router-dom";
import { useStudentAnalytics } from "@/hooks/useStudentAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react"; // Make sure useEffect is imported

export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const { analytics, loading } = useStudentAnalytics();

  useEffect(() => {
    // Set the config
    window.ChatWidgetConfig = {
      webhook: {
        url: 'https://nuel12.app.n8n.cloud/webhook/ed405ea8-24ba-41bd-909a-e642d219a048/chat',
        route: 'general'
      },
      branding: {
        logo: '<your company logo URL>',
        name: 'DoxaTech.io',
        welcomeText: 'Hi 👋, how can we help?',
        responseTimeText: 'We typically respond right away'
      },
      style: {
        primaryColor: '#854fff',
        secondaryColor: '#6b3fd4',
        position: 'right',
        backgroundColor: '#ffffff',
        fontColor: '#333333'
      }
    };

    // Inject the script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/Nuelchi/chatbot@main/index.js';
    script.async = true;
    document.body.appendChild(script);

    // Optional cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);
export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section");
  const { analytics, loading } = useStudentAnalytics();

  // If there's a section parameter, render that section
  if (section) {
    return (
      <DashboardLayout 
        title="Student Dashboard" 
        subtitle="Manage your learning journey"
      >
        <StudentSectionRenderer section={section} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Student Dashboard" 
    >
      <DashboardWelcome roleSpecificMessage="Ready to unlock your potential today? 🚀" />
      
      <div className="space-y-8">
        {/* Motivational Banner */}
        <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Keep Going! You're Doing Great! ✨</h2>
                <p className="text-blue-100">
                  {analytics.completionRate > 75 ? "Outstanding progress! You're on fire! 🔥" :
                   analytics.completionRate > 50 ? "Great momentum! Keep pushing forward! 💪" :
                   "Every expert was once a beginner. Start your journey today! 🌟"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{analytics.completionRate}%</div>
                <div className="text-sm text-blue-100">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <DashboardStats 
          role="student" 
          stats={{
            enrolledCourses: analytics.enrolledCourses,
            pendingAssignments: analytics.pendingAssignments,
            completionRate: analytics.completionRate,
          }} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StudentQuickActions />
          <StudentRecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
