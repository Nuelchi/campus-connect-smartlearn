
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { format } from "date-fns";
import EventCard from "./EventCard";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string | null;
  is_all_day: boolean | null;
  location: string | null;
  is_global: boolean | null;
  color: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

interface SelectedDateEventsProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onSetReminder: (eventId: string, eventDate: string) => void;
}

const getEventPriority = (eventType: string) => {
  const priorities: Record<string, number> = { 
    exam: 1, 
    deadline: 2, 
    academic: 3, 
    holiday: 4, 
    celebration: 5, 
    break: 6 
  };
  return priorities[eventType] || 7;
};

export default function SelectedDateEvents({ 
  selectedDate, 
  events, 
  onSetReminder 
}: SelectedDateEventsProps) {
  const sortedEvents = events
    .sort((a, b) => getEventPriority(a.event_type) - getEventPriority(b.event_type));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {format(selectedDate, 'EEEE, MMM d')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No events on this date
          </p>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSetReminder={onSetReminder}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
