
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Bell } from "lucide-react";
import { format } from "date-fns";

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

interface EventCardProps {
  event: CalendarEvent;
  onSetReminder: (eventId: string, eventDate: string) => void;
  showDate?: boolean;
}

const eventTypeColors: Record<string, string> = {
  academic: 'bg-blue-500',
  holiday: 'bg-red-500',
  celebration: 'bg-purple-500',
  exam: 'bg-orange-500',
  deadline: 'bg-yellow-500',
  break: 'bg-green-500'
};

const eventTypeEmojis: Record<string, string> = {
  academic: '🎓',
  holiday: '🎉',
  celebration: '🎊',
  exam: '📚',
  deadline: '⏰',
  break: '🏖️'
};

export default function EventCard({ event, onSetReminder, showDate = false }: EventCardProps) {
  const formatEventTime = (event: CalendarEvent) => {
    if (event.is_all_day) return 'All Day';
    return format(new Date(event.start_date), 'h:mm a');
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">
              {eventTypeEmojis[event.event_type] || '📅'}
            </span>
            <Badge className={eventTypeColors[event.event_type] || 'bg-gray-500'}>
              {event.event_type}
            </Badge>
          </div>
          <h4 className="font-semibold">{event.title}</h4>
          {event.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {event.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {showDate && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(event.start_date), 'MMM d, yyyy')}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatEventTime(event)}
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {event.location}
              </div>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSetReminder(event.id, event.start_date)}
          className="shrink-0"
        >
          <Bell className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
