
-- Create sequence for certificate numbering first
CREATE SEQUENCE IF NOT EXISTS certificate_sequence START 1;

-- Create a certificates table for controlled certificate issuance
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL,
  issued_by UUID NOT NULL, -- Teacher/admin who issued the certificate
  certificate_number TEXT UNIQUE NOT NULL DEFAULT 'CERT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('certificate_sequence')::text, 6, '0'),
  final_grade NUMERIC(5,2),
  completion_date TIMESTAMP WITH TIME ZONE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  certificate_template TEXT DEFAULT 'standard',
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE public.certificates 
ADD CONSTRAINT certificates_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE public.certificates 
ADD CONSTRAINT certificates_course_id_fkey 
FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE public.certificates 
ADD CONSTRAINT certificates_issued_by_fkey 
FOREIGN KEY (issued_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Students can view their own certificates
CREATE POLICY "Students can view their own certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = student_id);

-- Teachers can view certificates for their courses
CREATE POLICY "Teachers can view certificates for their courses" 
ON public.certificates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = certificates.course_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- Teachers can issue certificates for their courses
CREATE POLICY "Teachers can issue certificates for their courses" 
ON public.certificates 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = certificates.course_id 
    AND courses.instructor_id = auth.uid()
  )
  AND auth.uid() = issued_by
);

-- Teachers can update certificates for their courses
CREATE POLICY "Teachers can update certificates for their courses" 
ON public.certificates 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM courses 
    WHERE courses.id = certificates.course_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- Admins can view, create, and update all certificates
CREATE POLICY "Admins have full access to certificates" 
ON public.certificates 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- Create an index for better performance
CREATE INDEX idx_certificates_student_id ON public.certificates(student_id);
CREATE INDEX idx_certificates_course_id ON public.certificates(course_id);
CREATE INDEX idx_certificates_issued_by ON public.certificates(issued_by);
