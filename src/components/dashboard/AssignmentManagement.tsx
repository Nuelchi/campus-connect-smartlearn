
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";

type Assignment = Tables<"assignments">;

interface AssignmentManagementProps {
  userRole: string;
}

export default function AssignmentManagement({ userRole }: AssignmentManagementProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchAssignments();
  }, [user, userRole]);

  const fetchAssignments = async () => {
    if (!user) return;
    
    setLoading(true);
    
    if (userRole === "teacher") {
      // Fetch assignments for teacher's courses
      const { data: courses } = await supabase
        .from("courses")
        .select("id")
        .eq("instructor_id", user.id);
      
      if (courses && courses.length > 0) {
        const courseIds = courses.map(c => c.id);
        const { data, error } = await supabase
          .from("assignments")
          .select("*")
          .in("course_id", courseIds)
          .order("created_at", { ascending: false });
        
        if (!error) setAssignments(data || []);
      }
    } else if (userRole === "student") {
      // Fetch assignments for enrolled courses
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("student_id", user.id)
        .eq("status", "active");
      
      if (enrollments && enrollments.length > 0) {
        const courseIds = enrollments.map(e => e.course_id);
        const { data, error } = await supabase
          .from("assignments")
          .select("*")
          .in("course_id", courseIds)
          .order("deadline", { ascending: true });
        
        if (!error) setAssignments(data || []);
      }
    }
    
    setLoading(false);
  };

  const handleButtonClick = () => {
    if (userRole === "teacher") {
      window.location.href = "/dashboard?section=assignments";
    } else {
      window.location.href = "/dashboard?section=submit-assignment";
    }
  };

  if (loading) {
    return <div className="p-4">Loading assignments...</div>;
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

      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No assignments found</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <Badge variant={new Date(assignment.deadline || "") > new Date() ? "default" : "destructive"}>
                    {new Date(assignment.deadline || "") > new Date() ? "Active" : "Overdue"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleDateString() : "No deadline"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>Created: {new Date(assignment.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={handleButtonClick}>
                    {userRole === "teacher" ? "View Submissions" : "Submit Assignment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
