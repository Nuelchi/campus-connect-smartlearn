
-- Remove the old storage bucket and its policies
DROP POLICY IF EXISTS "Authenticated users can view course materials" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload course materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own course materials" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own course materials" ON storage.objects;

-- Delete the storage bucket
DELETE FROM storage.buckets WHERE id = 'course-materials';
