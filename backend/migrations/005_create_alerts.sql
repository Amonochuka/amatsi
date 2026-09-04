CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES public.farms(id) NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view alerts for own farms" ON public.alerts;
CREATE POLICY "Users can view alerts for own farms"
    ON public.alerts FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.farms WHERE farms.id = alerts.farm_id AND farms.user_id = auth.uid()
    ));
