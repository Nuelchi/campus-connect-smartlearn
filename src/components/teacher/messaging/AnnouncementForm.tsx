
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface Course {
  id: string;
  title: string;
}

interface AnnouncementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  onAnnouncementPosted: () => void;
}

export default function AnnouncementForm({
  open,
  onOpenChange,
  courses,
  onAnnouncementPosted
}: AnnouncementFormProps) {
  const { user } = useAuth();
  const [messageForm, setMessageForm] = useState({
    course_id: "",
    title: "",
    content: "",
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from("course_discussions")
        .insert({
          author_id: user.id,
          course_id: messageForm.course_id,
          title: messageForm.title,
          content: messageForm.content,
          is_announcement: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement posted successfully!",
      });

      setMessageForm({
        course_id: "",
        title: "",
        content: "",
      });
      onOpenChange(false);
      onAnnouncementPosted();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to post announcement. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Course Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={messageForm.course_id} onValueChange={(value) => setMessageForm(prev => ({ ...prev, course_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={messageForm.title}
              onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={messageForm.content}
              onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your announcement"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" />
              Post Announcement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
