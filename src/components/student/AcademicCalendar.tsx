
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { CalendarIcon, Clock, MapPin, Bell, Sparkles } from "lucide-react";
import { format, isSameDay, isToday, isTomorrow, addDays, startOfMonth, endOfMonth } from "date-fns";

const eventTypeColors = {
  academic: 'bg-blue-500',
  holiday: 'bg-red-500',
  celebration: 'bg-purple-500',
  exam: 'bg-orange-500',
  deadline: 'bg-yellow-500',
  break: 'bg-green-500'
};

const eventTypeEmojis = {
  academic: '🎓',
  holiday: '🎉',
  celebration: '🎊',
  exam: '📚',
  deadline: '⏰',
  break: '🏖️'
};

export default function AcademicCalendar() {
  const { events, loading, createReminder, getEventsByDateRange, getUpcomingEvents } = useCalendarEvents();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');

  const selectedDateEvents = events.filter(event => 
    isSameDay(new Date(event.start_date), selectedDate)
  );

  const upcomingEvents = getUpcomingEvents(10);
  
  const currentMonthEvents = getEventsByDateRange(
    startOfMonth(selectedDate),
    endOfMonth(selectedDate)
  );

  const getEventPriority = (eventType: string) => {
    const priorities = { exam: 1, deadline: 2, academic: 3, holiday: 4, celebration: 5, break: 6 };
    return priorities[eventType as keyof typeof priorities] || 7;
  };

  const formatEventTime = (event: any) => {
    if (event.is_all_day) return 'All Day';
    return format(new Date(event.start_date), 'h:mm a');
  };

  const getRelativeTimeText = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    
    const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) return `In ${daysUntil} days`;
    
    return format(eventDate, 'MMM d, yyyy');
  };

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
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <CalendarIcon className="h-8 w-8" />
                Academic Calendar
              </h1>
              <p className="text-blue-100">
                Stay on top of important dates, holidays, and academic events! ✨
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentMonthEvents.length}</div>
              <div className="text-sm text-blue-100">Events This Month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'list')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="month">Calendar View</TabsTrigger>
          <TabsTrigger value="list">Upcoming Events</TabsTrigger>
        </TabsList>

        <TabsContent value="month" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
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
                  onSelect={(date) => date && setSelectedDate(date)}
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

            {/* Selected Date Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  {format(selectedDate, 'EEEE, MMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No events on this date
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateEvents
                      .sort((a, b) => getEventPriority(a.event_type) - getEventPriority(b.event_type))
                      .map((event) => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">
                                {eventTypeEmojis[event.event_type]}
                              </span>
                              <Badge className={eventTypeColors[event.event_type]}>
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
                            onClick={() => handleSetReminder(event.id, event.start_date)}
                            className="shrink-0"
                          >
                            <Bell className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No upcoming events scheduled
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl">
                          {eventTypeEmojis[event.event_type]}
                        </div>
                        <Badge className={`${eventTypeColors[event.event_type]} text-xs`}>
                          {event.event_type}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="text-sm font-medium text-blue-600">
                            {getRelativeTimeText(event.start_date)}
                          </div>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(event.start_date), 'MMM d, yyyy')}
                          </div>
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
                        onClick={() => handleSetReminder(event.id, event.start_date)}
                      >
                        <Bell className="h-4 w-4 mr-1" />
                        Remind Me
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
