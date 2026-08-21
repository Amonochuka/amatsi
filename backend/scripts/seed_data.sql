-- Demo/dev seed data for AMATSI
-- Demo login: phone +254700000000 / password DemoPass123!

INSERT INTO auth.users (id, email) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@amatsi.com')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (id, full_name, phone_number, email, password_hash, language, sms_enabled)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'John Doe Farmer',
  '+254700000000',
  'demo@amatsi.com',
  '$2a$10$nBb2QmRKxhH9YgTCM43P8.T3dv/mq8s.5bOfOp4AYl2j/C/aqLlYe',
  'en',
  true
)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  language = EXCLUDED.language,
  sms_enabled = EXCLUDED.sms_enabled;

INSERT INTO public.farms (
  id, user_id, name, latitude, longitude, area_hectares, crop_type, soil_type,
  irrigation_method, tank_capacity_liters, planting_date
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000001',
  'Green Valley Farm',
  -1.2921, 36.8219, 2.5, 'Maize', 'Loam', 'Drip', 5000, '2026-05-01'
),
(
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000001',
  'Riverside Beans',
  -1.3000, 36.8000, 1.2, 'Beans', 'Clay', 'Furrow', 2000, '2026-04-15'
),
(
  '33333333-3333-3333-3333-333333333333',
  '00000000-0000-0000-0000-000000000001',
  'Hilltop Tomatoes',
  -1.2800, 36.8500, 0.8, 'Tomatoes', 'Sandy', 'Drip', 1500, '2026-06-01'
)
ON CONFLICT DO NOTHING;

INSERT INTO public.weather (farm_id, temperature, rainfall_probability, soil_moisture, forecast_date) VALUES
('11111111-1111-1111-1111-111111111111', 25.5, 10.0, 45.0, CURRENT_DATE - INTERVAL '2 days'),
('11111111-1111-1111-1111-111111111111', 26.0, 15.0, 42.0, CURRENT_DATE - INTERVAL '1 day'),
('11111111-1111-1111-1111-111111111111', 28.5, 5.0, 30.0, CURRENT_DATE),
('22222222-2222-2222-2222-222222222222', 27.0, 20.0, 38.0, CURRENT_DATE);

INSERT INTO public.recommendations (farm_id, action, reason, water_saved_estimate) VALUES
('11111111-1111-1111-1111-111111111111', 'MONITOR', 'Soil moisture is adequate at 45%. No irrigation needed.', 0.0),
('11111111-1111-1111-1111-111111111111', 'IRRIGATE', 'Soil moisture dropped to 30% with high temperatures. Drip irrigation recommended.', 1500.0);

INSERT INTO public.alerts (farm_id, message, status, sent_at) VALUES
('11111111-1111-1111-1111-111111111111', 'AMATSI Alert: Moisture is low. Recommended to irrigate your Maize field.', 'SENT', CURRENT_DATE);
