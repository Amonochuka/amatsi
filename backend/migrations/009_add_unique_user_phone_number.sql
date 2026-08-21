-- Enforce one account per phone number. The partial index preserves support
-- for any legacy records where a phone number was not supplied.
CREATE UNIQUE INDEX IF NOT EXISTS users_phone_number_unique_idx
    ON public.users (phone_number)
    WHERE phone_number IS NOT NULL;
