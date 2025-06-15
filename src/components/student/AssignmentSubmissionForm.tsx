
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Link as LinkIcon, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AssignmentSubmissionFormProps {
  assignmentId: string;
  onSubmissionComplete: () => void;
}

export default function AssignmentSubmissionForm({ assignmentId, onSubmissionComplete }: AssignmentSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [submissionType, setSubmissionType] = useState<string>("file");
  const [file, setFile] = useState<File | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [comments, setComments] = useState("");
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('assignment-submissions')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('assignment-submissions')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      if (submissionType === "file" && file) {
        fileUrl = await uploadFile(file);
        fileName = file.name;
        fileSize = file.size;
      }

      const { error } = await supabase
        .from("assignment_submissions")
        .insert({
          assignment_id: assignmentId,
          student_id: user.id,
          submission_type: submissionType,
          file_url: fileUrl,
          submission_url: submissionType === "url" ? submissionUrl : null,
          file_name: fileName,
          file_size: fileSize,
          feedback: comments || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      });

      // Reset form
      setFile(null);
      setSubmissionUrl("");
      setComments("");
      setSubmissionType("file");
      onSubmissionComplete();
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to submit assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Submit Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="submissionType">Submission Type</Label>
            <Select value={submissionType} onValueChange={setSubmissionType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose submission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">File Upload (PDF, Video, etc.)</SelectItem>
                <SelectItem value="url">Project URL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {submissionType === "file" && (
            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.mp4,.mov,.avi,.jpg,.png,.jpeg"
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}

          {submissionType === "url" && (
            <div className="space-y-2">
              <Label htmlFor="submissionUrl">Project URL</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="submissionUrl"
                  type="url"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://github.com/yourproject or https://your-project.com"
                  className="flex-1"
                  required
                />
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any additional comments about your submission..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || (submissionType === "file" && !file) || (submissionType === "url" && !submissionUrl)}
            className="w-full"
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
