
-- Function to search for users by email address
CREATE OR REPLACE FUNCTION public.search_user_by_email(search_email text, requesting_user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  first_name text,
  last_name text,
  department text,
  role text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Return user data if email exists and is not the requesting user
  RETURN QUERY
  SELECT 
    p.id,
    au.email,
    p.first_name,
    p.last_name,
    p.department,
    COALESCE(ur.role::text, 'user') as role
  FROM auth.users au
  JOIN public.profiles p ON au.id = p.id
  LEFT JOIN public.user_roles ur ON p.id = ur.user_id
  WHERE au.email = search_email
  AND au.id != requesting_user_id
  LIMIT 1;
END;
$$;
