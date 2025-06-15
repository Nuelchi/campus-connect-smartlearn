
-- Create calendar events table
CREATE TABLE public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('academic', 'holiday', 'celebration', 'exam', 'deadline', 'break')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_all_day BOOLEAN DEFAULT false,
  location TEXT,
  is_global BOOLEAN DEFAULT true,
  created_by UUID,
  color TEXT DEFAULT '#3b82f6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event reminders table for notifications
CREATE TABLE public.event_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  reminder_type TEXT DEFAULT 'notification' CHECK (reminder_type IN ('notification', 'email')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies for calendar_events (all users can read global events)
CREATE POLICY "Anyone can view global calendar events" 
  ON public.calendar_events 
  FOR SELECT 
  USING (is_global = true AND is_active = true);

CREATE POLICY "Authenticated users can view all events" 
  ON public.calendar_events 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- RLS policies for event_reminders (users can only manage their own reminders)
CREATE POLICY "Users can view their own reminders" 
  ON public.event_reminders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reminders" 
  ON public.event_reminders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" 
  ON public.event_reminders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" 
  ON public.event_reminders 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_calendar_events_date_range ON public.calendar_events(start_date, end_date);
CREATE INDEX idx_calendar_events_type ON public.calendar_events(event_type);
CREATE INDEX idx_event_reminders_remind_at ON public.event_reminders(remind_at) WHERE is_sent = false;

-- Enable realtime for notifications
ALTER TABLE public.calendar_events REPLICA IDENTITY FULL;
ALTER TABLE public.event_reminders REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_reminders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Insert some sample global academic events and holidays
INSERT INTO public.calendar_events (title, description, event_type, start_date, end_date, is_all_day, color) VALUES
  ('New Year''s Day', 'Global holiday celebrating the start of the new year', 'holiday', '2025-01-01', '2025-01-01', true, '#ef4444'),
  ('Martin Luther King Jr. Day', 'Federal holiday honoring civil rights leader', 'holiday', '2025-01-20', '2025-01-20', true, '#8b5cf6'),
  ('Presidents'' Day', 'Federal holiday honoring past presidents', 'holiday', '2025-02-17', '2025-02-17', true, '#3b82f6'),
  ('Spring Break', 'Academic break period for students', 'break', '2025-03-10', '2025-03-14', true, '#10b981'),
  ('Easter Sunday', 'Christian holiday celebrating resurrection', 'celebration', '2025-04-20', '2025-04-20', true, '#f59e0b'),
  ('Memorial Day', 'Federal holiday honoring military personnel', 'holiday', '2025-05-26', '2025-05-26', true, '#ef4444'),
  ('Independence Day', 'Celebration of American independence', 'celebration', '2025-07-04', '2025-07-04', true, '#dc2626'),
  ('Labor Day', 'Federal holiday celebrating workers', 'holiday', '2025-09-01', '2025-09-01', true, '#059669'),
  ('Halloween', 'Fun celebration and costume holiday', 'celebration', '2025-10-31', '2025-10-31', true, '#f97316'),
  ('Thanksgiving', 'Holiday of gratitude and family gathering', 'holiday', '2025-11-27', '2025-11-27', true, '#d97706'),
  ('Christmas Day', 'Christian holiday celebrating birth of Jesus', 'holiday', '2025-12-25', '2025-12-25', true, '#dc2626'),
  ('Fall Semester Begins', 'Start of fall academic semester', 'academic', '2025-08-25', '2025-08-25', true, '#3b82f6'),
  ('Spring Semester Begins', 'Start of spring academic semester', 'academic', '2025-01-15', '2025-01-15', true, '#3b82f6'),
  ('Final Exams Week', 'Final examination period', 'exam', '2025-05-05', '2025-05-09', true, '#dc2626'),
  ('Graduation Ceremony', 'Commencement celebration for graduates', 'celebration', '2025-05-15', '2025-05-15', true, '#059669');

-- Function to automatically create notifications for upcoming events
CREATE OR REPLACE FUNCTION create_event_notifications()
RETURNS void AS $$
DECLARE
  event_record RECORD;
  user_record RECORD;
BEGIN
  -- Get events starting in the next 24 hours that don't have notifications yet
  FOR event_record IN 
    SELECT * FROM calendar_events 
    WHERE start_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
    AND is_active = true
    AND is_global = true
  LOOP
    -- Create notifications for all users with student role
    FOR user_record IN 
      SELECT ur.user_id FROM user_roles ur WHERE ur.role = 'student'
    LOOP
      -- Check if notification already exists
      IF NOT EXISTS (
        SELECT 1 FROM notifications 
        WHERE user_id = user_record.user_id 
        AND related_id = event_record.id
        AND type = 'calendar_event'
      ) THEN
        INSERT INTO notifications (user_id, title, message, type, related_id)
        VALUES (
          user_record.user_id,
          '📅 Upcoming: ' || event_record.title,
          CASE 
            WHEN event_record.event_type = 'holiday' THEN '🎉 Don''t forget about this holiday!'
            WHEN event_record.event_type = 'celebration' THEN '🎊 Join the celebration!'
            WHEN event_record.event_type = 'exam' THEN '📚 Prepare for your exams!'
            WHEN event_record.event_type = 'academic' THEN '🎓 Important academic event coming up!'
            WHEN event_record.event_type = 'deadline' THEN '⏰ Deadline approaching!'
            ELSE '📌 Don''t miss this event!'
          END || ' ' || event_record.description,
          'calendar_event',
          event_record.id
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
