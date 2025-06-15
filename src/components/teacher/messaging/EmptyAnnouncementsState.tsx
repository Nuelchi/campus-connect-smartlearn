
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function EmptyAnnouncementsState() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center py-8">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No announcements yet</h3>
          <p className="text-muted-foreground">Create your first course announcement</p>
        </div>
      </CardContent>
    </Card>
  );
}
