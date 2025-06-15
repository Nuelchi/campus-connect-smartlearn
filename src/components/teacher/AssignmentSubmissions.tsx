
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Calendar, 
  Download, 
  ExternalLink, 
  GraduationCap,
  User
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";

type AssignmentSubmission = Tables<"assignment_submissions"> & {
  assignment: Tables<"assignments">;
  student_profile?: Tables<"profiles"> | null;
};

export default function AssignmentSubmissions() {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");
  const [grading, setGrading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // First get the teacher's courses
      const { data: courses } = await supabase
        .from("courses")
        .select("id")
        .eq("instructor_id", user.id);
      
      if (!courses || courses.length === 0) {
        setSubmissions([]);
        setLoading(false);
        return;
      }

      const courseIds = courses.map(c => c.id);

      // Get submissions for teacher's courses
      const { data: submissionData, error: submissionError } = await supabase
        .from("assignment_submissions")
        .select(`
          *,
          assignment:assignments(*)
        `)
        .in("assignment.course_id", courseIds)
        .order("submitted_at", { ascending: false });
      
      if (submissionError) {
        console.error("Error fetching submissions:", submissionError);
        toast({
          title: "Error",
          description: "Failed to load submissions. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Get student profiles separately
      const studentIds = submissionData?.map(s => s.student_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", studentIds);

      // Combine submissions with profiles
      const submissionsWithProfiles = submissionData?.map(submission => ({
        ...submission,
        student_profile: profiles?.find(p => p.id === submission.student_id) || null
      })) || [];

      setSubmissions(submissionsWithProfiles);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load submissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    if (!gradingSubmission || !grade) return;
    
    setGrading(true);
    
    try {
      const { error } = await supabase
        .from("assignment_submissions")
        .update({
          grade: parseFloat(grade),
          feedback: feedback || null,
          graded_at: new Date().toISOString(),
          graded_by: user?.id
        })
        .eq("id", gradingSubmission.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment graded successfully!",
      });

      setGradingSubmission(null);
      setGrade("");
      setFeedback("");
      fetchSubmissions();
    } catch (error) {
      console.error("Error grading assignment:", error);
      toast({
        title: "Error",
        description: "Failed to grade assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGrading(false);
    }
  };

  const getSubmissionTypeIcon = (submission: AssignmentSubmission) => {
    if (submission.submission_type === "url") {
      return <ExternalLink className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Submissions Yet</h3>
            <p className="text-muted-foreground">
              Students haven't submitted any assignments yet. Check back later!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Assignment Submissions</h2>
        <p className="text-muted-foreground">Review and grade student submissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Student</TableHead>
                <TableHead className="font-semibold">Assignment</TableHead>
                <TableHead className="font-semibold">Submitted</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Grade</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {submission.student_profile?.first_name || "Unknown"} {submission.student_profile?.last_name || "Student"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {submission.student_profile?.username || "No username"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{submission.assignment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {submission.assignment.deadline ? 
                          format(new Date(submission.assignment.deadline), "MMM dd, yyyy") : 
                          "No deadline"
                        }
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      {format(new Date(submission.submitted_at), "MMM dd, yyyy HH:mm")}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSubmissionTypeIcon(submission)}
                      <Badge variant="outline" className="text-xs">
                        {submission.submission_type === "url" ? "URL" : "File"}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {submission.grade !== null ? (
                      <Badge className="bg-green-100 text-green-800">
                        {submission.grade}%
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      {submission.file_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(submission.file_url, '_blank')}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      )}
                      {submission.submission_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(submission.submission_url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => {
                              setGradingSubmission(submission);
                              setGrade(submission.grade?.toString() || "");
                              setFeedback(submission.feedback || "");
                            }}
                          >
                            <GraduationCap className="w-3 h-3 mr-1" />
                            Grade
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Grade Assignment</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">
                                Student: {submission.student_profile?.first_name || "Unknown"} {submission.student_profile?.last_name || "Student"}
                              </h4>
                              <p className="text-sm text-muted-foreground">Assignment: {submission.assignment.title}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="grade">Grade (0-100)</Label>
                              <Input
                                id="grade"
                                type="number"
                                min="0"
                                max="100"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                placeholder="Enter grade..."
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="feedback">Feedback</Label>
                              <Textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide feedback for the student..."
                                rows={4}
                              />
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setGradingSubmission(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleGrade} disabled={grading || !grade}>
                                {grading ? "Grading..." : "Submit Grade"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
