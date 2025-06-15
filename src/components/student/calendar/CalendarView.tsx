
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";

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

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
}

export default function CalendarView({ selectedDate, onSelectDate, events }: CalendarViewProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {format(selectedDate, 'MMMM yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          className="rounded-md border"
          modifiers={{
            hasEvent: (date) => events.some(event => 
              isSameDay(new Date(event.start_date), date)
            )
          }}
          modifiersStyles={{
            hasEvent: { 
              backgroundColor: '#3b82f6', 
              color: 'white',
              fontWeight: 'bold'
            }
          }}
        />
      </CardContent>
    </Card>
  );
}
