
-- Add lecturer name fields to assignments table
ALTER TABLE assignments 
ADD COLUMN lecturer_first_name TEXT,
ADD COLUMN lecturer_last_name TEXT;

-- Add category field to assignment_submissions table if it doesn't exist
ALTER TABLE assignment_submissions 
ADD COLUMN submission_type TEXT DEFAULT 'file',
ADD COLUMN submission_url TEXT;

-- Update the assignment_submissions table to better handle different submission types
ALTER TABLE assignment_submissions 
ALTER COLUMN file_url DROP NOT NULL;
