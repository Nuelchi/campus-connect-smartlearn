import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CreateAssignmentDialogProps {
  courseId: string;
  onAssignmentCreated: () => void;
}

export default function CreateAssignmentDialog({ courseId, onAssignmentCreated }: CreateAssignmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState<Date>();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    maxSubmissions: 1,
    maxFileSize: 10485760, // 10MB default
    lecturerFirstName: "",
    lecturerLastName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from("assignments")
        .insert({
          course_id: courseId,
          title: formData.title,
          description: formData.description,
          instructions: formData.instructions,
          deadline: deadline?.toISOString(),
          max_submissions: formData.maxSubmissions,
          max_file_size: formData.maxFileSize,
          lecturer_first_name: formData.lecturerFirstName,
          lecturer_last_name: formData.lecturerLastName,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment created successfully!",
      });

      setFormData({
        title: "",
        description: "",
        instructions: "",
        maxSubmissions: 1,
        maxFileSize: 10485760,
        lecturerFirstName: "",
        lecturerLastName: "",
      });
      setDeadline(undefined);
      setIsOpen(false);
      onAssignmentCreated();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
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
          <FileText className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lecturerFirstName">Your First Name</Label>
              <Input
                id="lecturerFirstName"
                value={formData.lecturerFirstName}
                onChange={(e) => setFormData(prev => ({ ...prev, lecturerFirstName: e.target.value }))}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecturerLastName">Your Last Name</Label>
              <Input
                id="lecturerLastName"
                value={formData.lecturerLastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lecturerLastName: e.target.value }))}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter assignment title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Assignment description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Detailed instructions for students"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Select deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxSubmissions">Max Submissions</Label>
              <Input
                id="maxSubmissions"
                type="number"
                min="1"
                value={formData.maxSubmissions}
                onChange={(e) => setFormData(prev => ({ ...prev, maxSubmissions: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                value={Math.round(formData.maxFileSize / 1024 / 1024)}
                onChange={(e) => setFormData(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) * 1024 * 1024 }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Assignment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
