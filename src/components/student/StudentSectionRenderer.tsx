import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseManagement from "@/components/CourseManagement";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import AssignmentManagement from "@/components/dashboard/AssignmentManagement";
import CertificateCenter from "@/components/dashboard/CertificateCenter";
import StudentGrades from "@/components/student/StudentGrades";
import AcademicCalendar from "@/components/student/AcademicCalendar";
import MessagingCenterV2 from "@/components/messaging/MessagingCenterV2";
import { useAuth } from "@/hooks/useAuth";
import { useCourses } from "@/hooks/useCourses";
import CourseCard from "@/components/CourseCard";
import SubmissionsList from "@/components/student/SubmissionsList";

interface StudentSectionRendererProps {
  section: string | null;
}

export default function StudentSectionRenderer({ section }: StudentSectionRendererProps) {
  const { role } = useAuth();
  const { courses, loading, isEnrolledInCourse, enrollments } = useCourses();
  
  switch (section) {
    case "courses":
      return <CourseManagement />;
    case "my-courses":
      console.log("All courses:", courses);
      console.log("All enrollments:", enrollments);
      console.log("User role:", role);
      
      const enrolledCourses = courses.filter(course => {
        const isEnrolled = isEnrolledInCourse(course.id);
        console.log(`Course ${course.title} (${course.id}) - enrolled:`, isEnrolled);
        return isEnrolled;
      });
      
      console.log("Filtered enrolled courses:", enrolledCourses);
      
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
                <div className="mt-4 text-xs text-gray-400">
                  Debug: Found {courses.length} total courses, {enrollments.length} enrollments
                </div>
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Assignment Submissions</h1>
              <p className="text-muted-foreground mt-2">
                Track all your submitted assignments, grades, and feedback in one place
              </p>
            </div>
          </div>
          <SubmissionsList />
        </div>
      );
    case "messaging":
      return <MessagingCenterV2 />;
    case "grades":
      return <StudentGrades />;
    case "certificates":
      return <CertificateCenter />;
    case "calendar":
      return <AcademicCalendar />;
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
