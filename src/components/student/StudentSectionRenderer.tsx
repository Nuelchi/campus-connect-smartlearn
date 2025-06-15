
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseManagement from "@/components/CourseManagement";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import AssignmentManagement from "@/components/dashboard/AssignmentManagement";
import CertificateCenter from "@/components/dashboard/CertificateCenter";
import { useAuth } from "@/hooks/useAuth";

interface StudentSectionRendererProps {
  section: string | null;
}

export default function StudentSectionRenderer({ section }: StudentSectionRendererProps) {
  const { role } = useAuth();
  
  switch (section) {
    case "courses":
      return <CourseManagement />;
    case "my-courses":
      return (
        <Card>
          <CardHeader>
            <CardTitle>My Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p>My courses functionality coming soon...</p>
          </CardContent>
        </Card>
      );
    case "assignments":
      return <AssignmentManagement userRole={role} />;
    case "submit-assignment":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Submit Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Assignment submission functionality coming soon...</p>
          </CardContent>
        </Card>
      );
    case "grades":
      return (
        <Card>
          <CardHeader>
            <CardTitle>My Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Grades view functionality coming soon...</p>
          </CardContent>
        </Card>
      );
    case "certificates":
      return <CertificateCenter />;
    case "progress":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Progress tracking functionality coming soon...</p>
          </CardContent>
        </Card>
      );
    case "calendar":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Academic Calendar</CardTitle>
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
