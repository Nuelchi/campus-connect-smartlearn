
-- First, let's check what constraint exists and drop it
ALTER TABLE course_materials DROP CONSTRAINT IF EXISTS course_materials_content_type_check;

-- Add a new constraint that allows the content types used in the upload form
ALTER TABLE course_materials ADD CONSTRAINT course_materials_content_type_check 
CHECK (content_type IN ('video', 'PDF', 'document', 'image', 'audio', 'text'));
