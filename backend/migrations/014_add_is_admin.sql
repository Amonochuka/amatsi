-- Admin role flag. Users with is_admin = true are allowed to call the
-- admin-only endpoints (e.g. manually granting the premium tier). Defaults to
-- false; promote an operator by UPDATE ... SET is_admin = true.
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;
