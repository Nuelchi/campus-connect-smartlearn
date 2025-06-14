
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessagingCenter from "./MessagingCenter";
import Gradebook from "./Gradebook";

interface TeacherSectionRendererProps {
  section: string | null;
}

export default function TeacherSectionRenderer({ section }: TeacherSectionRendererProps) {
  switch (section) {
    case "messaging":
      return <MessagingCenter />;
    case "gradebook":
      return <Gradebook />;
    case "students":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Student management functionality coming soon...</p>
          </CardContent>
        </Card>
      );
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
    case "analytics":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analytics dashboard coming soon...</p>
          </CardContent>
        </Card>
      );
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
      return (
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Notification center coming soon...</p>
          </CardContent>
        </Card>
      );
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
      return (
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Settings panel coming soon...</p>
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
}
