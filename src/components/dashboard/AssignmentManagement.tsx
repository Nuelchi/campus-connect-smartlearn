
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Clock, Users, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";

type Assignment = Tables<"assignments">;
type AssignmentSubmission = Tables<"assignment_submissions">;

interface AssignmentWithSubmission extends Assignment {
  submission?: AssignmentSubmission;
  course_title?: string;
}

interface AssignmentManagementProps {
  userRole: string;
}

export default function AssignmentManagement({ userRole }: AssignmentManagementProps) {
  const [availableAssignments, setAvailableAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [submittedAssignments, setSubmittedAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [overdueAssignments, setOverdueAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user, userRole]);

  const fetchAssignments = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      if (userRole === "teacher") {
        await fetchTeacherAssignments();
      } else {
        await fetchStudentAssignments();
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherAssignments = async () => {
    // Get teacher's courses
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title")
      .eq("instructor_id", user!.id);
    
    if (!courses || courses.length === 0) {
      setAvailableAssignments([]);
      setSubmittedAssignments([]);
      setOverdueAssignments([]);
      return;
    }

    const courseIds = courses.map(c => c.id);
    
    // Get all assignments for teacher's courses
    const { data: assignments } = await supabase
      .from("assignments")
      .select("*")
      .in("course_id", courseIds)
      .order("created_at", { ascending: false });

    if (assignments) {
      const now = new Date();
      const assignmentsWithCourseInfo = assignments.map(assignment => ({
        ...assignment,
        course_title: courses.find(c => c.id === assignment.course_id)?.title || "Unknown Course"
      }));

      // For teachers, categorize by deadline status
      const available = assignmentsWithCourseInfo.filter(a => 
        !a.deadline || new Date(a.deadline) > now
      );
      const overdue = assignmentsWithCourseInfo.filter(a => 
        a.deadline && new Date(a.deadline) <= now
      );

      setAvailableAssignments(available);
      setOverdueAssignments(overdue);
      setSubmittedAssignments([]); // Teachers don't have "submitted" assignments
    }
  };

  const fetchStudentAssignments = async () => {
    // Get student's enrolled courses
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("student_id", user!.id)
      .eq("status", "active");
    
    if (!enrollments || enrollments.length === 0) {
      setAvailableAssignments([]);
      setSubmittedAssignments([]);
      setOverdueAssignments([]);
      return;
    }

    const courseIds = enrollments.map(e => e.course_id);
    
    // Get all assignments for enrolled courses
    const { data: assignments } = await supabase
      .from("assignments")
      .select(`
        *,
        courses!inner(title)
      `)
      .in("course_id", courseIds)
      .order("deadline", { ascending: true });

    // Get student's submissions
    const { data: submissions } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("student_id", user!.id);

    if (assignments) {
      const now = new Date();
      const submissionMap = new Map(
        submissions?.map(s => [s.assignment_id, s]) || []
      );

      const assignmentsWithSubmissions = assignments.map(assignment => ({
        ...assignment,
        submission: submissionMap.get(assignment.id),
        course_title: (assignment as any).courses?.title || "Unknown Course"
      }));

      // Categorize assignments
      const available = assignmentsWithSubmissions.filter(a => 
        !a.submission && (!a.deadline || new Date(a.deadline) > now)
      );
      
      const submitted = assignmentsWithSubmissions.filter(a => a.submission);
      
      const overdue = assignmentsWithSubmissions.filter(a => 
        !a.submission && a.deadline && new Date(a.deadline) <= now
      );

      setAvailableAssignments(available);
      setSubmittedAssignments(submitted);
      setOverdueAssignments(overdue);
    }
  };

  const handleAssignmentAction = (assignmentId: string) => {
    if (userRole === "teacher") {
      window.location.href = `/dashboard?section=assignments`;
    } else {
      window.location.href = `/dashboard?section=submit-assignment`;
    }
  };

  const getStatusBadge = (assignment: AssignmentWithSubmission) => {
    if (assignment.submission) {
      if (assignment.submission.grade !== null) {
        return <Badge className="bg-green-100 text-green-800">Graded ({assignment.submission.grade}%)</Badge>;
      }
      return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
    }
    
    if (assignment.deadline && new Date(assignment.deadline) <= new Date()) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    return <Badge variant="outline">Pending</Badge>;
  };

  const AssignmentCard = ({ assignment }: { assignment: AssignmentWithSubmission }) => (
    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{assignment.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{assignment.course_title}</p>
          </div>
          {getStatusBadge(assignment)}
        </div>
      </CardHeader>
      <CardContent>
        {assignment.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{assignment.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          {assignment.deadline && (
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>Created: {new Date(assignment.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        {assignment.submission && (
          <div className="text-xs text-muted-foreground mb-3">
            Submitted: {new Date(assignment.submission.submitted_at).toLocaleDateString()}
            {assignment.submission.feedback && (
              <p className="mt-1 text-sm">{assignment.submission.feedback}</p>
            )}
          </div>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleAssignmentAction(assignment.id)}
          className="w-full"
        >
          {userRole === "teacher" ? "View Details" : 
           assignment.submission ? "View Submission" : "Submit Assignment"}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {userRole === "teacher" ? "Assignment Management" : "My Assignments"}
        </h2>
        {userRole === "teacher" && (
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Available ({availableAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {userRole === "teacher" ? "Active" : "Submitted"} ({submittedAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Overdue ({overdueAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4">
            {availableAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No available assignments</p>
                </CardContent>
              </Card>
            ) : (
              availableAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <div className="grid gap-4">
            {submittedAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {userRole === "teacher" ? "No active assignments" : "No submitted assignments"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              submittedAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <div className="grid gap-4">
            {overdueAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No overdue assignments</p>
                </CardContent>
              </Card>
            ) : (
              overdueAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
