
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Award } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface IssueCertificateDialogProps {
  courseId: string;
  studentId: string;
  studentName: string;
  onCertificateIssued: () => void;
}

export default function IssueCertificateDialog({ 
  courseId, 
  studentId, 
  studentName, 
  onCertificateIssued 
}: IssueCertificateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completionDate, setCompletionDate] = useState<Date>();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    finalGrade: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !completionDate) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from("certificates")
        .insert({
          student_id: studentId,
          course_id: courseId,
          issued_by: user.id,
          final_grade: formData.finalGrade ? parseFloat(formData.finalGrade) : null,
          completion_date: completionDate.toISOString(),
          notes: formData.notes || null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Certificate issued to ${studentName}!`,
      });

      setFormData({
        finalGrade: "",
        notes: "",
      });
      setCompletionDate(undefined);
      setIsOpen(false);
      onCertificateIssued();
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast({
        title: "Error",
        description: "Failed to issue certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Award className="mr-2 h-4 w-4" />
          Issue Certificate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Issue Certificate</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Issue a certificate to {studentName}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Completion Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {completionDate ? format(completionDate, "PPP") : "Select completion date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={completionDate}
                  onSelect={setCompletionDate}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="finalGrade">Final Grade (optional)</Label>
            <Input
              id="finalGrade"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.finalGrade}
              onChange={(e) => setFormData(prev => ({ ...prev, finalGrade: e.target.value }))}
              placeholder="Enter final grade (0-100)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or achievements"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !completionDate}>
              {loading ? "Issuing..." : "Issue Certificate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
