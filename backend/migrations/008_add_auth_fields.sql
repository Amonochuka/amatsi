-- Auth fields for Go JWT signup/login (bcrypt password, SMS prefs)
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS email TEXT,
    ADD COLUMN IF NOT EXISTS password_hash TEXT,
    ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'en',
    ADD COLUMN IF NOT EXISTS sms_enabled BOOLEAN NOT NULL DEFAULT true;
