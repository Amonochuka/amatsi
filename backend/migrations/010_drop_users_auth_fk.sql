-- Drop the FK to auth.users since we manage our own JWT auth
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
