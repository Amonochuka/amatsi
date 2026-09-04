CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    name TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    area_hectares DOUBLE PRECISION NOT NULL,
    crop_type TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    irrigation_method TEXT NOT NULL,
    tank_capacity_liters DOUBLE PRECISION,
    planting_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own farms" ON public.farms;
CREATE POLICY "Users can view own farms"
    ON public.farms FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own farms" ON public.farms;
CREATE POLICY "Users can insert own farms"
    ON public.farms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own farms" ON public.farms;
CREATE POLICY "Users can update own farms"
    ON public.farms FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own farms" ON public.farms;
CREATE POLICY "Users can delete own farms"
    ON public.farms FOR DELETE
    USING (auth.uid() = user_id);
