
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  course_id: string;
  is_announcement: boolean;
  sender_profile?: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface Student {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface Course {
  id: string;
  title: string;
}

export default function MessagingCenter() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [messageForm, setMessageForm] = useState({
    course_id: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchStudents();
      fetchCourses();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("course_discussions")
        .select(`
          *,
          profiles!course_discussions_author_id_fkey(first_name, last_name)
        `)
        .eq("author_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const formattedMessages: Message[] = (data || []).map(msg => ({
        ...msg,
        sender_profile: {
          first_name: msg.profiles?.first_name || null,
          last_name: msg.profiles?.last_name || null,
        }
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      // Get teacher's courses first
      const { data: teacherCourses, error: coursesError } = await supabase
        .from("courses")
        .select("id")
        .eq("instructor_id", user?.id);

      if (coursesError) throw coursesError;
      
      const courseIds = teacherCourses?.map(c => c.id) || [];
      
      if (courseIds.length === 0) {
        setStudents([]);
        return;
      }

      // Get students enrolled in teacher's courses
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from("enrollments")
        .select(`
          student_id,
          profiles!enrollments_student_id_fkey(id, first_name, last_name)
        `)
        .in("course_id", courseIds);

      if (enrollmentsError) throw enrollmentsError;
      
      const uniqueStudents = enrollments?.reduce((acc: Student[], enrollment: any) => {
        const student = enrollment.profiles;
        if (student && !acc.find(s => s.id === student.id)) {
          acc.push(student);
        }
        return acc;
      }, []) || [];
      
      setStudents(uniqueStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .eq("instructor_id", user?.id);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

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
      setIsComposeOpen(false);
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to post announcement. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center">Loading messaging center...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Announcements</h2>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
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
                <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
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
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No announcements yet</h3>
                <p className="text-muted-foreground">Create your first course announcement</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{message.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      By: {message.sender_profile?.first_name} {message.sender_profile?.last_name}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{message.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
