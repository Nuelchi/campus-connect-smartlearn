
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface AnnouncementCardProps {
  message: Message;
}

export default function AnnouncementCard({ message }: AnnouncementCardProps) {
  return (
    <Card>
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
  );
}
