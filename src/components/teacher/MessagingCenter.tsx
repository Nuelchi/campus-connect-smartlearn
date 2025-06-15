
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AnnouncementForm from "./messaging/AnnouncementForm";
import AnnouncementCard from "./messaging/AnnouncementCard";
import EmptyAnnouncementsState from "./messaging/EmptyAnnouncementsState";

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

interface Course {
  id: string;
  title: string;
}

export default function MessagingCenter() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchCourses();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("course_discussions")
        .select("*")
        .eq("author_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get author profiles separately
      const authorIds = [...new Set(data?.map(msg => msg.author_id) || [])];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .in("id", authorIds);

      if (profilesError) throw profilesError;
      
      const formattedMessages: Message[] = (data || []).map(msg => {
        const profile = profiles?.find(p => p.id === msg.author_id);
        return {
          ...msg,
          sender_profile: {
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
          }
        };
      });
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
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

  if (loading) {
    return <div className="text-center">Loading messaging center...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Announcements</h2>
        <Button onClick={() => setIsComposeOpen(true)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      <div className="grid gap-4">
        {messages.length === 0 ? (
          <EmptyAnnouncementsState />
        ) : (
          messages.map((message) => (
            <AnnouncementCard key={message.id} message={message} />
          ))
        )}
      </div>

      <AnnouncementForm
        open={isComposeOpen}
        onOpenChange={setIsComposeOpen}
        courses={courses}
        onAnnouncementPosted={fetchMessages}
      />
    </div>
  );
}
