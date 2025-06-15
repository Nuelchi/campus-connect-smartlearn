
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Bell } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
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

interface UpcomingEventsListProps {
  events: CalendarEvent[];
  onSetReminder: (eventId: string, eventDate: string) => void;
}

const getRelativeTimeText = (date: string) => {
  const eventDate = new Date(date);
  if (isToday(eventDate)) return 'Today';
  if (isTomorrow(eventDate)) return 'Tomorrow';
  
  const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil <= 7) return `In ${daysUntil} days`;
  
  return format(eventDate, 'MMM d, yyyy');
};

export default function UpcomingEventsList({ events, onSetReminder }: UpcomingEventsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No upcoming events scheduled
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    <div className="text-sm font-medium text-blue-600">
                      {getRelativeTimeText(event.start_date)}
                    </div>
                  </div>
                  <EventCard
                    event={event}
                    onSetReminder={onSetReminder}
                    showDate={true}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
