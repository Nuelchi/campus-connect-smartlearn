
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { startOfMonth, endOfMonth } from "date-fns";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarView from "./calendar/CalendarView";
import SelectedDateEvents from "./calendar/SelectedDateEvents";
import UpcomingEventsList from "./calendar/UpcomingEventsList";

export default function AcademicCalendar() {
  const { events, loading, createReminder, getEventsByDateRange, getUpcomingEvents, getEventsByDate } = useCalendarEvents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');

  console.log('Current events in component:', events);
  console.log('Selected date:', selectedDate);

  const selectedDateEvents = getEventsByDate(selectedDate);
  const upcomingEvents = getUpcomingEvents(10);
  const currentMonthEvents = getEventsByDateRange(
    startOfMonth(selectedDate),
    endOfMonth(selectedDate)
  );

  console.log('Current month events:', currentMonthEvents);

  const handleSetReminder = async (eventId: string, eventDate: string) => {
    const reminderTime = new Date(new Date(eventDate).getTime() - 24 * 60 * 60 * 1000); // 24 hours before
    await createReminder(eventId, reminderTime.toISOString());
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-medium">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CalendarHeader currentMonthEventsCount={currentMonthEvents.length} />

      <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'list')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="month">Calendar View</TabsTrigger>
          <TabsTrigger value="list">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              events={events}
            />
            <SelectedDateEvents
              selectedDate={selectedDate}
              events={selectedDateEvents}
              onSetReminder={handleSetReminder}
            />
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <UpcomingEventsList
            events={upcomingEvents}
            onSetReminder={handleSetReminder}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
