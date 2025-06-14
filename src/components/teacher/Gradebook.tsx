
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_name: string;
  file_url: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
  assignment: {
    title: string;
    course_id: string;
  };
  student_profile: {
    first_name: string;
    last_name: string;
  };
}

export default function Gradebook() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeForm, setGradeForm] = useState({
    grade: "",
    feedback: "",
  });

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      // Get all submissions for assignments in teacher's courses
      const { data, error } = await supabase
        .from("assignment_submissions")
        .select(`
          *,
          assignment:assignments(title, course_id),
          student_profile:profiles!assignment_submissions_student_id_fkey(first_name, last_name)
        `)
        .in("assignment_id",
          await supabase
            .from("assignments")
            .select("id")
            .in("course_id",
              await supabase
                .from("courses")
                .select("id")
                .eq("instructor_id", user?.id)
                .then(res => res.data?.map(c => c.id) || [])
            )
            .then(res => res.data?.map(a => a.id) || [])
        )
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !user) return;

    try {
      const { error } = await supabase
        .from("assignment_submissions")
        .update({
          grade: parseFloat(gradeForm.grade),
          feedback: gradeForm.feedback,
          graded_at: new Date().toISOString(),
          graded_by: user.id,
        })
        .eq("id", selectedSubmission.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Submission graded successfully!",
      });

      setGradeForm({ grade: "", feedback: "" });
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error("Error grading submission:", error);
      toast({
        title: "Error",
        description: "Failed to grade submission. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openGradeDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      grade: submission.grade?.toString() || "",
      feedback: submission.feedback || "",
    });
  };

  if (loading) {
    return <div className="text-center">Loading gradebook...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gradebook</h2>
        <div className="flex space-x-2">
          <Badge variant="outline">{submissions.length} submissions</Badge>
          <Badge variant="outline">
            {submissions.filter(s => s.grade !== null).length} graded
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No submissions yet</h3>
                <p className="text-muted-foreground">Student submissions will appear here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{submission.assignment.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Submitted by: {submission.student_profile.first_name} {submission.student_profile.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Submitted: {new Date(submission.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {submission.grade !== null ? (
                      <Badge variant="default">
                        Grade: {submission.grade}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{submission.file_name}</span>
                    {submission.file_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => openGradeDialog(submission)}
                    variant={submission.grade !== null ? "outline" : "default"}
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {submission.grade !== null ? "Update Grade" : "Grade"}
                  </Button>
                </div>
                {submission.feedback && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <Label className="text-sm font-medium">Feedback:</Label>
                    <p className="text-sm mt-1">{submission.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <form onSubmit={handleGradeSubmission} className="space-y-4">
              <div className="space-y-2">
                <Label>Student</Label>
                <p className="text-sm">
                  {selectedSubmission.student_profile.first_name} {selectedSubmission.student_profile.last_name}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Assignment</Label>
                <p className="text-sm">{selectedSubmission.assignment.title}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade (0-100)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.grade}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, grade: e.target.value }))}
                  placeholder="Enter grade"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm(prev => ({ ...prev, feedback: e.target.value }))}
                  placeholder="Provide feedback to the student"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Grade
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
