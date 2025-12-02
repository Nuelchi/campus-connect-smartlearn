import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Assignment = Tables<"assignments">;

interface SubmitAssignmentDialogProps {
  assignment: Assignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function SubmitAssignmentDialog({
  assignment,
  open,
  onOpenChange,
  onSuccess
}: SubmitAssignmentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !assignment) return;
    
    if (!file && !submissionUrl) {
      toast.error("Please provide either a file or a submission URL");
      return;
    }

    setSubmitting(true);

    try {
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/${assignment.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('assignment-submissions')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('assignment-submissions')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileName = file.name;
        fileSize = file.size;
      }

      // Insert submission
      const { error: insertError } = await supabase
        .from('assignment_submissions')
        .insert({
          assignment_id: assignment.id,
          student_id: user.id,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          submission_url: submissionUrl || null,
          submission_type: file ? 'file' : 'url'
        });

      if (insertError) throw insertError;

      toast.success("Assignment submitted successfully!");
      onSuccess();
      onOpenChange(false);
      setFile(null);
      setSubmissionUrl("");
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      toast.error(error.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Assignment: {assignment.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="file">Upload File</Label>
            <div className="mt-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept={assignment.allowed_file_types?.join(',') || '.pdf,.doc,.docx'}
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div>
            <Label htmlFor="url">Submission URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://..."
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              className="mt-2"
            />
          </div>

          {assignment.instructions && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium mb-1">Instructions:</p>
              <p className="text-sm text-muted-foreground">{assignment.instructions}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
