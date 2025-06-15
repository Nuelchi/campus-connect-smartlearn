
-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username text;

-- Add a unique constraint to ensure usernames are unique
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_username_unique UNIQUE (username);
