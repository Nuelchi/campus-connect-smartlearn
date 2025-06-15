
-- Create storage bucket for course materials if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Authenticated users can view course materials" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload course materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own course materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own course materials" ON storage.objects;

-- Create storage policies for course materials bucket
-- Allow authenticated users to view all files
CREATE POLICY "Authenticated users can view course materials" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'course-materials' AND auth.role() = 'authenticated');

-- Allow authenticated users to upload files (for teachers/admins)
CREATE POLICY "Authenticated users can upload course materials" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'course-materials' AND auth.role() = 'authenticated');

-- Allow users to update their own uploads
CREATE POLICY "Users can update their own course materials" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'course-materials' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete their own course materials" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'course-materials' AND auth.uid()::text = (storage.foldername(name))[1]);
