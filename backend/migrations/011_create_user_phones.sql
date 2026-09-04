CREATE TABLE IF NOT EXISTS public.user_phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    phone_number TEXT NOT NULL,
    label TEXT NOT NULL DEFAULT 'Worker',
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS user_phones_user_phone_unique
    ON public.user_phones (user_id, phone_number);

ALTER TABLE public.user_phones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own phones" ON public.user_phones;
CREATE POLICY "Users manage own phones"
    ON public.user_phones FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());