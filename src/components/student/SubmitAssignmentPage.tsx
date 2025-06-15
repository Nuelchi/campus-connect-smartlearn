
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import AssignmentSubmissionForm from "./AssignmentSubmissionForm";

type Assignment = Tables<"assignments">;

export default function SubmitAssignmentPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Get enrolled courses
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
      
      if (!error) {
        setAssignments(data || []);
      }
    }
    
    setLoading(false);
  };

  const selectedAssignmentData = assignments.find(a => a.id === selectedAssignment);

  const handleSubmissionComplete = () => {
    // Reset the selected assignment to allow another submission
    setSelectedAssignment("");
    // Optionally refresh assignments
    fetchAssignments();
  };

  if (loading) {
    return <div className="p-4">Loading assignments...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Submit Assignment</h2>
        <p className="text-muted-foreground">Choose an assignment to submit your work</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment">Choose Assignment</Label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger>
                <SelectValue placeholder="Select an assignment to submit" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{assignment.title}</span>
                      {assignment.deadline && (
                        <Badge variant={new Date(assignment.deadline) > new Date() ? "default" : "destructive"} className="ml-2">
                          {new Date(assignment.deadline) > new Date() ? "Active" : "Overdue"}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAssignmentData && (
            <div className="p-4 bg-muted rounded-lg space-y-3">
              <h3 className="font-semibold">{selectedAssignmentData.title}</h3>
              {selectedAssignmentData.description && (
                <p className="text-sm text-muted-foreground">{selectedAssignmentData.description}</p>
              )}
              {selectedAssignmentData.instructions && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Instructions:</p>
                  <p className="text-sm text-muted-foreground">{selectedAssignmentData.instructions}</p>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {selectedAssignmentData.deadline && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Due: {new Date(selectedAssignmentData.deadline).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Created: {new Date(selectedAssignmentData.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {(selectedAssignmentData.lecturer_first_name || selectedAssignmentData.lecturer_last_name) && (
                <div className="text-sm">
                  <span className="font-medium">Instructor:</span>{" "}
                  {selectedAssignmentData.lecturer_first_name} {selectedAssignmentData.lecturer_last_name}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAssignment && (
        <AssignmentSubmissionForm 
          assignmentId={selectedAssignment}
          onSubmissionComplete={handleSubmissionComplete}
        />
      )}

      {assignments.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Assignments Available</h3>
            <p className="text-muted-foreground">
              You don't have any assignments to submit at the moment. Check back later or contact your instructors.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
