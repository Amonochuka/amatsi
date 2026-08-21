ALTER TABLE public.users
ADD COLUMN is_premium BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE public.farms
ADD COLUMN device_id TEXT;
