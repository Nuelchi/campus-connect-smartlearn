
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessagingCenterV2 from "@/components/messaging/MessagingCenterV2";
import StudentGrades from "./StudentGrades";
import AcademicCalendar from "./AcademicCalendar";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import SubmissionsList from "./SubmissionsList";
import SubmitAssignmentPage from "./SubmitAssignmentPage";
import AssignmentManagement from "@/components/dashboard/AssignmentManagement";

interface StudentSectionRendererProps {
  section: string | null;
}

export default function StudentSectionRenderer({ section }: StudentSectionRendererProps) {
  switch (section) {
    case "assignments":
      return <AssignmentManagement userRole="student" />;
    case "messaging":
      return <MessagingCenterV2 />;
    case "grades":
      return <StudentGrades />;
    case "calendar":
      return <AcademicCalendar />;
    case "submissions":
      return <SubmissionsList />;
    case "submit-assignment":
      return <SubmitAssignmentPage />;
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
