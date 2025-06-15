
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessagingCenterV2 from "@/components/messaging/MessagingCenterV2";
import Gradebook from "./Gradebook";
import TeacherCourseManagement from "./TeacherCourseManagement";
import TeacherAnalyticsDashboard from "./TeacherAnalyticsDashboard";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import CreateCourseDialog from "./CreateCourseDialog";
import StudentManagement from "@/components/dashboard/StudentManagement";
import AssignmentCreationInterface from "./AssignmentCreationInterface";
import { useCourses } from "@/hooks/useCourses";

interface TeacherSectionRendererProps {
  section: string | null;
}

export default function TeacherSectionRenderer({ section }: TeacherSectionRendererProps) {
  const { fetchCourses } = useCourses();

  switch (section) {
    case "messaging":
      return <MessagingCenterV2 />;
    case "gradebook":
      return <Gradebook />;
    case "course-management":
      return <TeacherCourseManagement />;
    case "create-course":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateCourseDialog onCourseCreated={fetchCourses} />
          </CardContent>
        </Card>
      );
    case "students":
      return <StudentManagement />;
    case "assignments":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Assignment management functionality coming soon...</p>
          </CardContent>
        </Card>
      );
    case "create-assignment":
      return <AssignmentCreationInterface />;
    case "analytics":
      return <TeacherAnalyticsDashboard />;
    case "calendar":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Calendar functionality coming soon...</p>
          </CardContent>
        </Card>
      );
    case "notifications":
      return <NotificationCenter />;
    case "help":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Help and support resources coming soon...</p>
          </CardContent>
        </Card>
      );
    case "settings":
    case "account":
      return <SettingsPanel />;
    default:
      return null;
  }
}
