CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES public.farms(id) NOT NULL,
    action TEXT NOT NULL,
    reason TEXT NOT NULL,
    water_saved_estimate DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view recommendations for own farms" ON public.recommendations;
CREATE POLICY "Users can view recommendations for own farms"
    ON public.recommendations FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.farms WHERE farms.id = recommendations.farm_id AND farms.user_id = auth.uid()
    ));
