
-- Create storage bucket for assignment submissions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assignment-submissions', 'assignment-submissions', true);

-- Create storage policy for assignment submissions - allow students to upload files
CREATE POLICY "Students can upload assignment files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assignment-submissions' AND
  auth.role() = 'authenticated'
);

-- Allow anyone to view assignment files (for teachers to review)
CREATE POLICY "Anyone can view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignment-submissions');

-- Allow file owners and teachers to delete files
CREATE POLICY "File owners and teachers can delete assignment files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assignment-submissions' AND
  (auth.uid() = owner OR 
   EXISTS (
     SELECT 1 FROM user_roles 
     WHERE user_id = auth.uid() AND role = 'teacher'
   ))
);
