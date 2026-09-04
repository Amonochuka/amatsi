CREATE TABLE IF NOT EXISTS public.weather (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES public.farms(id) NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,
    rainfall_probability DOUBLE PRECISION NOT NULL,
    soil_moisture DOUBLE PRECISION NOT NULL,
    forecast_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.weather ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view weather for own farms" ON public.weather;
CREATE POLICY "Users can view weather for own farms"
    ON public.weather FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.farms WHERE farms.id = weather.farm_id AND farms.user_id = auth.uid()
    ));
