-- Seed Data for AMATSI Backend Demonstration

-- 1. Insert a mock user (assuming auth.users exists and has this ID, or we just insert it for local testing if foreign keys are relaxed)
-- Note: In a real Supabase environment, you create users via the Auth API. 
-- For seeding local DB, we can just insert a dummy user.

INSERT INTO auth.users (id, email) VALUES 
('00000000-0000-0000-0000-000000000001', 'demo@amatsi.com') ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, full_name, phone_number) VALUES 
('00000000-0000-0000-0000-000000000001', 'John Doe Farmer', '+254700000000') 
ON CONFLICT DO NOTHING;

-- 2. Insert a Farm
INSERT INTO public.farms (id, user_id, name, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date) VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Green Valley Farm', -1.2921, 36.8219, 2.5, 'Maize', 'Loam', 'Drip', 5000, '2026-05-01')
ON CONFLICT DO NOTHING;

-- 3. Insert recent Weather records
INSERT INTO public.weather (farm_id, temperature, rainfall_probability, soil_moisture, forecast_date) VALUES 
('11111111-1111-1111-1111-111111111111', 25.5, 10.0, 45.0, CURRENT_DATE - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 26.0, 15.0, 42.0, CURRENT_DATE - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 28.5, 5.0, 30.0, CURRENT_DATE);

-- 4. Insert Recommendations
INSERT INTO public.recommendations (farm_id, action, reason, water_saved_estimate) VALUES 
('11111111-1111-1111-1111-111111111111', 'MONITOR', 'Soil moisture is adequate at 45%. No irrigation needed.', 0.0),
('11111111-1111-1111-1111-111111111111', 'IRRIGATE', 'Soil moisture dropped to 30% with high temperatures. Drip irrigation recommended.', 1500.0);

-- 5. Insert Alerts
INSERT INTO public.alerts (farm_id, message, status, sent_at) VALUES 
('11111111-1111-1111-1111-111111111111', 'AMATSI Alert: Moisture is low. Recommended to irrigate your Maize field.', 'SENT', CURRENT_DATE);
