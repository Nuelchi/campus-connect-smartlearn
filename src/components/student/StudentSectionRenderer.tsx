
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MessagingCenterV2 from "@/components/messaging/MessagingCenterV2";
import StudentGrades from "./StudentGrades";
import SubmissionsList from "./SubmissionsList";
import AcademicCalendar from "./AcademicCalendar";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import CertificateCenter from "@/components/dashboard/CertificateCenter";
import { useCourses } from "@/hooks/useCourses";

interface StudentSectionRendererProps {
  section: string | null;
}

export default function StudentSectionRenderer({ section }: StudentSectionRendererProps) {
  const { courses, loading } = useCourses();

  switch (section) {
    case "courses":
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Badge variant="secondary">{courses.length} Enrolled</Badge>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Loading courses...</div>
          ) : courses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No courses enrolled</h3>
                  <p className="text-muted-foreground">Browse available courses to get started</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                    <Badge variant="outline">{course.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    
    case "messaging":
      return <MessagingCenterV2 />;
    
    case "grades":
      return <StudentGrades />;
    
    case "assignments":
      return <SubmissionsList />;
    
    case "calendar":
      return <AcademicCalendar />;
    
    case "certificates":
      return <CertificateCenter />;
    
    case "notifications":
      return <NotificationCenter />;
    
    case "help":
      return (
        <Card>
          <CardHeader>
            <CardTitle>Help & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Getting Started</h3>
                <p className="text-sm text-muted-foreground">Learn how to navigate the platform and access your courses.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Course Materials</h3>
                <p className="text-sm text-muted-foreground">Find and download course materials, watch videos, and complete assignments.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground">Need help? Contact our support team for assistance.</p>
              </div>
            </div>
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
