
-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  syllabus TEXT,
  image_url TEXT,
  instructor_id UUID REFERENCES auth.users NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course modules table for organizing content
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course materials table
CREATE TABLE public.course_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.course_modules ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  content_type TEXT CHECK (content_type IN ('pdf', 'video', 'audio', 'presentation', 'document', 'link')),
  external_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(student_id, course_id)
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  max_file_size INTEGER DEFAULT 10485760, -- 10MB default
  allowed_file_types TEXT[] DEFAULT ARRAY['pdf', 'doc', 'docx', 'jpg', 'png'],
  max_submissions INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignment submissions table
CREATE TABLE public.assignment_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users NOT NULL,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  grade DECIMAL(5,2),
  feedback TEXT,
  graded_at TIMESTAMP WITH TIME ZONE,
  graded_by UUID REFERENCES auth.users
);

-- Create course discussions table
CREATE TABLE public.course_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_announcement BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES public.course_discussions,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('assignment', 'grade', 'material', 'announcement', 'enrollment')),
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- Can reference course_id, assignment_id, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Everyone can view active courses" ON public.courses FOR SELECT USING (is_active = true);
CREATE POLICY "Teachers can manage their own courses" ON public.courses FOR ALL USING (instructor_id = auth.uid());
CREATE POLICY "Admins can manage all courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for course modules
CREATE POLICY "Users can view modules of accessible courses" ON public.course_modules FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND (c.is_active = true OR c.instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "Teachers can manage modules of their courses" ON public.course_modules FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND (c.instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- RLS Policies for course materials
CREATE POLICY "Users can view materials of accessible courses" ON public.course_materials FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND (c.is_active = true OR c.instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "Teachers can manage materials of their courses" ON public.course_materials FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND (c.instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- RLS Policies for enrollments
CREATE POLICY "Students can view their own enrollments" ON public.enrollments FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can enroll themselves" ON public.enrollments FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can view enrollments in their courses" ON public.enrollments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND c.instructor_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all enrollments" ON public.enrollments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for assignments
CREATE POLICY "Users can view assignments of accessible courses" ON public.assignments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND (c.is_active = true OR c.instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "Teachers can manage assignments of their courses" ON public.assignments FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND (c.instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

-- RLS Policies for assignment submissions
CREATE POLICY "Students can view their own submissions" ON public.assignment_submissions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can create their own submissions" ON public.assignment_submissions FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Teachers can view submissions for their assignments" ON public.assignment_submissions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.courses c ON c.id = a.course_id 
    WHERE a.id = assignment_id 
    AND c.instructor_id = auth.uid()
  )
);
CREATE POLICY "Teachers can grade submissions for their assignments" ON public.assignment_submissions FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.assignments a
    JOIN public.courses c ON c.id = a.course_id 
    WHERE a.id = assignment_id 
    AND c.instructor_id = auth.uid()
  )
);
CREATE POLICY "Admins can manage all submissions" ON public.assignment_submissions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for course discussions
CREATE POLICY "Users can view discussions of accessible courses" ON public.course_discussions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND (c.is_active = true OR c.instructor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);
CREATE POLICY "Authenticated users can create discussions" ON public.course_discussions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own discussions" ON public.course_discussions FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Teachers can manage discussions in their courses" ON public.course_discussions FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.courses c 
    WHERE c.id = course_id 
    AND c.instructor_id = auth.uid()
  )
);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications for users" ON public.notifications FOR INSERT WITH CHECK (true);

-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public) VALUES ('course-materials', 'course-materials', true);

-- Create storage policies for course materials
CREATE POLICY "Anyone can view course materials" ON storage.objects FOR SELECT USING (bucket_id = 'course-materials');
CREATE POLICY "Authenticated users can upload course materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course-materials' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'course-materials' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'course-materials' AND auth.uid()::text = (storage.foldername(name))[1]);
