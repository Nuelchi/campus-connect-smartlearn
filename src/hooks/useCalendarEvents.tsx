
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: string; // Changed from strict union to string to match database
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

export function useCalendarEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      console.log('Fetching calendar events...');
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        toast.error('Failed to load calendar events');
      } else {
        console.log('Fetched calendar events:', data);
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReminder = useCallback(async (eventId: string, remindAt: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('event_reminders')
        .insert({
          event_id: eventId,
          user_id: user.id,
          remind_at: remindAt,
          reminder_type: 'notification'
        });

      if (error) {
        console.error('Error creating reminder:', error);
        toast.error('Failed to create reminder');
      } else {
        toast.success('Reminder set successfully!');
      }
    } catch (error) {
      console.error('Error in createReminder:', error);
      toast.error('Failed to create reminder');
    }
  }, [user?.id]);

  const getEventsByDateRange = useCallback((startDate: Date, endDate: Date) => {
    console.log('Getting events for date range:', startDate, 'to', endDate);
    const filteredEvents = events.filter(event => {
      const eventStart = new Date(event.start_date);
      const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
      
      const isInRange = (eventStart >= startDate && eventStart <= endDate) ||
             (eventEnd >= startDate && eventEnd <= endDate) ||
             (eventStart <= startDate && eventEnd >= endDate);
      
      console.log(`Event "${event.title}" (${eventStart.toDateString()}) in range:`, isInRange);
      return isInRange;
    });
    console.log('Filtered events for date range:', filteredEvents);
    return filteredEvents;
  }, [events]);

  const getUpcomingEvents = useCallback((limit: number = 5) => {
    const now = new Date();
    return events
      .filter(event => new Date(event.start_date) >= now)
      .slice(0, limit);
  }, [events]);

  useEffect(() => {
    fetchEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('calendar-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events'
        },
        (payload) => {
          console.log('Calendar event change:', payload);
          fetchEvents(); // Refetch events on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  return {
    events,
    loading,
    fetchEvents,
    createReminder,
    getEventsByDateRange,
    getUpcomingEvents
  };
}
