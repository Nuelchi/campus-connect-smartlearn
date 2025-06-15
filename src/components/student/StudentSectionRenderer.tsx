
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseManagement from "@/components/CourseManagement";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import AssignmentManagement from "@/components/dashboard/AssignmentManagement";
import CertificateCenter from "@/components/dashboard/CertificateCenter";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import CourseCard from "@/components/CourseCard";

interface StudentSectionRendererProps {
  section: string | null;
}

export default function StudentSectionRenderer({ section }: StudentSectionRendererProps) {
  const { role } = useAuth();
  const { courses, loading, isEnrolledInCourse } = useCourses();
  
  switch (section) {
    case "courses":
      return <CourseManagement />;
    case "my-courses":
      const enrolledCourses = courses.filter(course => isEnrolledInCourse(course.id));
      
      return (
        <Card>
          <CardHeader>
            <CardTitle>My Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-lg font-medium">Loading your courses...</div>
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                <p className="text-sm text-muted-foreground">
                  Browse available courses to start your learning journey!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    userRole={role}
                    isEnrolled={true}
                  />
                ))}
              </div>
            )}
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
