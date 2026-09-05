-- SMS opt-out support for additional recipients. When a phone number replies
-- STOP, the matching user_phones row is flagged so it is excluded from future
-- alert sends (the carrier-side opt-out is handled by Africa's Talking).
ALTER TABLE public.user_phones
    ADD COLUMN IF NOT EXISTS opted_out BOOLEAN NOT NULL DEFAULT false;