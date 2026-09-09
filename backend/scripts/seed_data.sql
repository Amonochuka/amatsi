-- ================================================================
-- AMATSI — Comprehensive Demo Seed Data
-- 20 users · ~40 farms · weather · recommendations · alerts · phones
-- All passwords: DemoPass123!
-- ================================================================

-- Password bcrypt hash for DemoPass123!
-- (same hash used for every demo user)
-- $2a$10$nBb2QmRKxhH9YgTCM43P8.T3dv/mq8s.5bOfOp4AYl2j/C/aqLlYe

-- ────────────────────────────────────────────────────────────────
-- 1. AUTH SCHEMA SHIM (safe to re-run)
-- ────────────────────────────────────────────────────────────────
INSERT INTO auth.users (id, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@amatsi.com'),
  ('00000000-0000-0000-0000-000000000002', 'grace@demo.com'),
  ('00000000-0000-0000-0000-000000000003', 'peter@demo.com'),
  ('00000000-0000-0000-0000-000000000004', 'mary@demo.com'),
  ('00000000-0000-0000-0000-000000000005', 'joseph@demo.com'),
  ('00000000-0000-0000-0000-000000000006', 'faith@demo.com'),
  ('00000000-0000-0000-0000-000000000007', 'david@demo.com'),
  ('00000000-0000-0000-0000-000000000008', 'ruth@demo.com'),
  ('00000000-0000-0000-0000-000000000009', 'samuel@demo.com'),
  ('00000000-0000-0000-0000-000000000010', 'esther@demo.com'),
  ('00000000-0000-0000-0000-000000000011', 'james@demo.com'),
  ('00000000-0000-0000-0000-000000000012', 'agnes@demo.com'),
  ('00000000-0000-0000-0000-000000000013', 'daniel@demo.com'),
  ('00000000-0000-0000-0000-000000000014', 'joyce@demo.com'),
  ('00000000-0000-0000-0000-000000000015', 'michael@demo.com'),
  ('00000000-0000-0000-0000-000000000016', 'sarah@demo.com'),
  ('00000000-0000-0000-0000-000000000017', 'patrick@demo.com'),
  ('00000000-0000-0000-0000-000000000018', 'lilian@demo.com'),
  ('00000000-0000-0000-0000-000000000019', 'evans@demo.com'),
  ('00000000-0000-0000-0000-000000000020', 'catherine@demo.com')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────
-- 2. USERS
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.users (id, full_name, phone_number, email, password_hash, language, sms_enabled, is_premium, is_admin) VALUES
  ('00000000-0000-0000-0000-000000000001', 'John Doe Farmer',    '+254700000000', 'demo@amatsi.com',  :'pw_hash', 'en',  true,  true,  true),
  ('00000000-0000-0000-0000-000000000002', 'Grace Wanjiku',      '+254700000001', 'grace@demo.com',   :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000003', 'Peter Ochieng',      '+254700000002', 'peter@demo.com',   :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000004', 'Mary Akinyi',        '+254700000003', 'mary@demo.com',    :'pw_hash', 'sw',  true,  true,  false),
  ('00000000-0000-0000-0000-000000000005', 'Joseph Kamau',       '+254700000004', 'joseph@demo.com',  :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000006', 'Faith Njeri',        '+254700000005', 'faith@demo.com',   :'pw_hash', 'sw',  true,  false, false),
  ('00000000-0000-0000-0000-000000000007', 'David Otieno',       '+254700000006', 'david@demo.com',   :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000008', 'Ruth Wambui',        '+254700000007', 'ruth@demo.com',    :'pw_hash', 'en',  true,  true,  false),
  ('00000000-0000-0000-0000-000000000009', 'Samuel Kipchoge',    '+254700000008', 'samuel@demo.com',  :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000010', 'Esther Muthoni',     '+254700000009', 'esther@demo.com',  :'pw_hash', 'sw',  true,  false, false),
  ('00000000-0000-0000-0000-000000000011', 'James Odhiambo',     '+254700000010', 'james@demo.com',   :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000012', 'Agnes Nyambura',     '+254700000011', 'agnes@demo.com',   :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000013', 'Daniel Wafula',      '+254700000012', 'daniel@demo.com',  :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000014', 'Joyce Atieno',       '+254700000013', 'joyce@demo.com',   :'pw_hash', 'sw',  true,  false, false),
  ('00000000-0000-0000-0000-000000000015', 'Michael Njoroge',    '+254700000014', 'michael@demo.com', :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000016', 'Sarah Chebet',       '+254700000015', 'sarah@demo.com',   :'pw_hash', 'en',  true,  true,  false),
  ('00000000-0000-0000-0000-000000000017', 'Patrick Mugambi',    '+254700000016', 'patrick@demo.com', :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000018', 'Lilian Wairimu',     '+254700000017', 'lilian@demo.com',  :'pw_hash', 'sw',  true,  false, false),
  ('00000000-0000-0000-0000-000000000019', 'Evans Mutua',        '+254700000018', 'evans@demo.com',   :'pw_hash', 'en',  true,  false, false),
  ('00000000-0000-0000-0000-000000000020', 'Catherine Auma',     '+254700000019', 'catherine@demo.com','pw_hash', 'en',  true,  false, false)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  language = EXCLUDED.language,
  sms_enabled = EXCLUDED.sms_enabled,
  is_premium = EXCLUDED.is_premium,
  is_admin = EXCLUDED.is_admin;

-- ────────────────────────────────────────────────────────────────
-- 3. FARMS (1–3 per user, ~40 total, spread across Kenya)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.farms (
  id, user_id, name, latitude, longitude, area_hectares,
  crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date
) VALUES
-- User 1 — John (Nakuru area)
('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Green Valley Farm',    -1.2921, 36.8219, 2.5,  'Maize',    'Loam',  'Drip',     5000, '2026-05-01'),
('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Riverside Beans',      -1.3000, 36.8000, 1.2,  'Beans',    'Clay',  'Furrow',   2000, '2026-04-15'),
('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Hilltop Tomatoes',     -1.2800, 36.8500, 0.8,  'Tomatoes', 'Sandy', 'Drip',     1500, '2026-06-01'),

-- User 2 — Grace (Naivasha)
('a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Naivasha Rose Farm',  -0.7167, 36.4333, 3.0,  'Roses',    'Loam',  'Drip',     8000, '2026-03-10'),
('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'Lake View Vegetables', -0.7200, 36.4400, 1.5,  'Kale',     'Clay',  'Sprinkler',3000, '2026-05-20'),

-- User 3 — Peter (Eldoret)
('a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000003', 'Eldoret Wheat Fields', 0.5167, 35.2667, 5.0,  'Wheat',    'Loam',  'Rainfed',  NULL,  '2026-04-01'),
('a0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000003', 'Rift Valley Maize',    0.5200, 35.2700, 3.5,  'Maize',    'Clay',  'Furrow',   4000, '2026-05-15'),

-- User 4 — Mary (Kisumu)
('a0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', 'Lakeside Cassava',     -0.1000, 34.7500, 2.0,  'Cassava',  'Sandy', 'Rainfed',  NULL,  '2026-03-20'),
('a0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000004', 'Nyando Sugarcane',     -0.1100, 34.7600, 4.0,  'Sugarcane','Clay',  'Furrow',   6000, '2026-02-15'),

-- User 5 — Joseph (Nyeri)
('a0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', 'Mt Kenya Tea Estate',  -0.4167, 36.9500, 2.8,  'Tea',      'Loam',  'Drip',     7000, '2026-01-10'),
('a0000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000005', 'Highland Coffee Plot', -0.4200, 36.9600, 1.0,  'Coffee',   'Loam',  'Drip',     3000, '2026-04-20'),

-- User 6 — Faith (Kericho)
('a0000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000006', 'Kericho Green Tea',    -0.3667, 35.2833, 3.2,  'Tea',      'Loam',  'Rainfed',  NULL,  '2026-02-01'),
('a0000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000006', 'Kipkelion Pyrethrum',  -0.3700, 35.2900, 1.8,  'Pyrethrum','Clay',  'Sprinkler',2500, '2026-05-10'),

-- User 7 — David (Meru)
('a0000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000007', 'Meru Miraa Farm',      0.0500,  37.6500, 1.5,  'Khat',     'Loam',  'Drip',     4000, '2026-03-01'),
('a0000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000007', 'Imenti Banana Block',  0.0600,  37.6600, 2.2,  'Banana',   'Clay',  'Furrow',   5000, '2026-04-05'),

-- User 8 — Ruth (Machakos)
('a0000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000008', 'Machakos Sorghum',     -1.5167, 37.2667, 3.0,  'Sorghum',  'Sandy', 'Rainfed',  NULL,  '2026-05-01'),
('a0000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000008', 'Athi River Poultry Fodder',-1.5200,37.2700, 1.0,  'Napier',   'Loam',  'Drip',     2000, '2026-06-10'),

-- User 9 — Samuel (Kitale)
('a0000000-0000-0000-0000-000000000018', '00000000-0000-0000-0000-000000000009', 'Kitale Grain Farm',    1.0167,  35.0000, 4.5,  'Maize',    'Loam',  'Rainfed',  NULL,  '2026-04-10'),
('a0000000-0000-0000-0000-000000000019', '00000000-0000-0000-0000-000000000009', 'Trans-Nzoia Beans',    1.0200,  35.0100, 2.0,  'Beans',    'Clay',  'Furrow',   3000, '2026-05-25'),

-- User 10 — Esther (Thika)
('a0000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Thika Pineapple Farm', -1.0333, 37.0667, 2.5,  'Pineapple','Sandy', 'Drip',     4500, '2026-03-15'),
('a0000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', 'Chania Avocado Grove', -1.0400, 37.0700, 1.8,  'Avocado',  'Loam',  'Drip',     3500, '2026-02-20'),

-- User 11 — James (Kakamega)
('a0000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000011', 'Kakamega Sugarcane',   0.2833,  34.7500, 5.5,  'Sugarcane','Clay',  'Furrow',   7000, '2026-01-20'),
('a0000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000011', 'Mumias Bean Plot',     0.2900,  34.7600, 1.2,  'Beans',    'Loam',  'Sprinkler',2000, '2026-06-01'),

-- User 12 — Agnes (Bungoma)
('a0000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000012', 'Bungoma Maize Belt',   0.5667,  34.5667, 4.0,  'Maize',    'Clay',  'Rainfed',  NULL,  '2026-04-25'),

-- User 13 — Daniel (Embu)
('a0000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000013', 'Embu Hillside Farm',   -0.5333, 37.4500, 2.0,  'Maize',    'Loam',  'Drip',     3500, '2026-05-05'),
('a0000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000013', 'Runyejes Cassava',     -0.5400, 37.4600, 1.5,  'Cassava',  'Sandy', 'Rainfed',  NULL,  '2026-03-30'),

-- User 14 — Joyce (Kisii)
('a0000000-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000014', 'Kisii Banana Farm',    -0.6833, 34.7667, 2.8,  'Banana',   'Clay',  'Furrow',   5500, '2026-02-10'),
('a0000000-0000-0000-0000-000000000028', '00000000-0000-0000-0000-000000000014', 'Tabaka Soapstone Farm',-0.6900, 34.7700, 1.0,  'Sukuma Wiki','Loam','Drip',     1800, '2026-06-15'),

-- User 15 — Michael (Mombasa)
('a0000000-0000-0000-0000-000000000029', '00000000-0000-0000-0000-000000000015', 'Coast Coconut Grove',  -4.0500, 39.6833, 3.5,  'Coconut',  'Sandy', 'Rainfed',  NULL,  '2026-01-05'),
('a0000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000015', 'Kilifi Mango Farm',    -3.6333, 39.9167, 2.0,  'Mango',    'Sandy', 'Drip',     3000, '2026-03-25'),

-- User 16 — Sarah (Nanyuki)
('a0000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000016', 'Nanyuki Livestock Farm',0.0200,  37.0700, 6.0,  'Napier',   'Loam',  'Drip',     9000, '2026-04-01'),

-- User 17 — Patrick (Voi)
('a0000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000017', 'Voi Sesame Farm',      -3.3917, 38.5625, 2.5,  'Sesame',   'Sandy', 'Rainfed',  NULL,  '2026-05-10'),

-- User 18 — Lilian (Garissa)
('a0000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000018', 'Garissa Cotton Field',  -0.4717, 39.6417, 4.0,  'Cotton',   'Sandy', 'Furrow',   5000, '2026-04-15'),

-- User 19 — Evans (Migori)
('a0000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000019', 'Migori Sugar Belt',    -1.0633, 34.4733, 3.8,  'Sugarcane','Clay',  'Furrow',   4500, '2026-03-05'),
('a0000000-0000-0000-0000-000000000035', '00000000-0000-0000-0000-000000000019', 'Rongo Maize Plot',     -1.0700, 34.4800, 1.5,  'Maize',    'Loam',  'Drip',     2500, '2026-05-30'),

-- User 20 — Catherine (Malindi)
('a0000000-0000-0000-0000-000000000036', '00000000-0000-0000-0000-000000000020', 'Malindi Cashew Farm',  -3.2167, 40.1167, 2.0,  'Cashew',   'Sandy', 'Rainfed',  NULL,  '2026-02-28'),
('a0000000-0000-0000-0000-000000000037', '00000000-0000-0000-0000-000000000020', 'Sabaki Banana Patch',  -3.2200, 40.1200, 1.2,  'Banana',   'Loam',  'Drip',     2200, '2026-06-05')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────
-- 4. WEATHER RECORDS (3 per farm — yesterday, 2 days ago, today)
--    Gives the dashboard charts and the weather card data.
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.weather (farm_id, temperature, rainfall_probability, soil_moisture, forecast_date)
SELECT farm_id, temp, rain, moist, dt
FROM (VALUES
-- Green Valley Farm
('a0000000-0000-0000-0000-000000000001', 25.5, 10.0, 45.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000001', 26.0, 15.0, 42.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000001', 28.5,  5.0, 30.0, CURRENT_DATE),
-- Riverside Beans
('a0000000-0000-0000-0000-000000000002', 27.0, 20.0, 55.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000002', 26.5, 25.0, 50.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000002', 29.0, 10.0, 38.0, CURRENT_DATE),
-- Hilltop Tomatoes
('a0000000-0000-0000-0000-000000000003', 30.0,  5.0, 25.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000003', 31.0,  8.0, 22.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000003', 32.5,  3.0, 18.0, CURRENT_DATE),
-- Naivasha Rose Farm
('a0000000-0000-0000-0000-000000000004', 24.0, 30.0, 60.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000004', 23.5, 35.0, 62.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000004', 25.0, 20.0, 55.0, CURRENT_DATE),
-- Lake View Vegetables
('a0000000-0000-0000-0000-000000000005', 23.0, 40.0, 58.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000005', 22.5, 45.0, 60.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000005', 24.0, 25.0, 52.0, CURRENT_DATE),
-- Eldoret Wheat Fields
('a0000000-0000-0000-0000-000000000006', 20.0, 50.0, 70.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000006', 19.5, 55.0, 72.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000006', 21.0, 35.0, 65.0, CURRENT_DATE),
-- Rift Valley Maize
('a0000000-0000-0000-0000-000000000007', 21.5, 45.0, 68.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000007', 20.0, 50.0, 70.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000007', 22.0, 30.0, 60.0, CURRENT_DATE),
-- Lakeside Cassava
('a0000000-0000-0000-0000-000000000008', 28.0, 15.0, 40.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000008', 29.0, 12.0, 35.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000008', 30.5,  8.0, 30.0, CURRENT_DATE),
-- Nyando Sugarcane
('a0000000-0000-0000-0000-000000000009', 27.5, 20.0, 50.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000009', 28.0, 18.0, 48.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000009', 29.5, 10.0, 42.0, CURRENT_DATE),
-- Mt Kenya Tea Estate
('a0000000-0000-0000-0000-000000000010', 18.0, 60.0, 75.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000010', 17.5, 65.0, 78.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000010', 19.0, 45.0, 70.0, CURRENT_DATE),
-- Highland Coffee Plot
('a0000000-0000-0000-0000-000000000011', 19.5, 55.0, 72.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000011', 18.0, 60.0, 75.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000011', 20.0, 40.0, 65.0, CURRENT_DATE),
-- Kericho Green Tea
('a0000000-0000-0000-0000-000000000012', 19.0, 55.0, 70.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000012', 18.5, 60.0, 72.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000012', 20.0, 42.0, 64.0, CURRENT_DATE),
-- Kipkelion Pyrethrum
('a0000000-0000-0000-0000-000000000013', 18.5, 50.0, 68.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000013', 17.0, 55.0, 70.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000013', 19.5, 38.0, 62.0, CURRENT_DATE),
-- Meru Miraa Farm
('a0000000-0000-0000-0000-000000000014', 22.0, 35.0, 55.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000014', 21.5, 40.0, 58.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000014', 23.0, 25.0, 48.0, CURRENT_DATE),
-- Imenti Banana Block
('a0000000-0000-0000-0000-000000000015', 21.0, 38.0, 52.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000015', 20.5, 42.0, 55.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000015', 22.5, 28.0, 45.0, CURRENT_DATE),
-- Machakos Sorghum
('a0000000-0000-0000-0000-000000000016', 30.0,  8.0, 28.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000016', 31.0,  5.0, 25.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000016', 32.0,  3.0, 22.0, CURRENT_DATE),
-- Athi River Poultry Fodder
('a0000000-0000-0000-0000-000000000017', 29.5, 12.0, 35.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000017', 30.0, 10.0, 32.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000017', 31.5,  6.0, 28.0, CURRENT_DATE),
-- Kitale Grain Farm
('a0000000-0000-0000-0000-000000000018', 20.5, 48.0, 65.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000018', 19.0, 52.0, 68.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000018', 21.5, 35.0, 58.0, CURRENT_DATE),
-- Trans-Nzoia Beans
('a0000000-0000-0000-0000-000000000019', 21.0, 45.0, 62.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000019', 20.0, 50.0, 65.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000019', 22.0, 32.0, 55.0, CURRENT_DATE),
-- Thika Pineapple Farm
('a0000000-0000-0000-0000-000000000020', 26.0, 18.0, 42.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000020', 27.0, 15.0, 38.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000020', 28.5, 10.0, 35.0, CURRENT_DATE),
-- Chania Avocado Grove
('a0000000-0000-0000-0000-000000000021', 25.5, 22.0, 48.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000021', 26.0, 20.0, 45.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000021', 27.5, 12.0, 40.0, CURRENT_DATE),
-- Kakamega Sugarcane
('a0000000-0000-0000-0000-000000000022', 26.5, 25.0, 52.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000022', 27.0, 22.0, 50.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000022', 28.0, 15.0, 44.0, CURRENT_DATE),
-- Mumias Bean Plot
('a0000000-0000-0000-0000-000000000023', 26.0, 28.0, 50.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000023', 27.0, 25.0, 48.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000023', 28.5, 18.0, 42.0, CURRENT_DATE),
-- Bungoma Maize Belt
('a0000000-0000-0000-0000-000000000024', 25.0, 30.0, 55.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000024', 26.0, 28.0, 52.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000024', 27.5, 18.0, 45.0, CURRENT_DATE),
-- Embu Hillside Farm
('a0000000-0000-0000-0000-000000000025', 22.0, 32.0, 52.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000025', 21.0, 38.0, 55.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000025', 23.5, 22.0, 46.0, CURRENT_DATE),
-- Runyejes Cassava
('a0000000-0000-0000-0000-000000000026', 23.0, 28.0, 48.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000026', 22.5, 32.0, 50.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000026', 24.0, 20.0, 42.0, CURRENT_DATE),
-- Kisii Banana Farm
('a0000000-0000-0000-0000-000000000027', 24.0, 35.0, 58.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000027', 23.5, 38.0, 60.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000027', 25.0, 25.0, 52.0, CURRENT_DATE),
-- Tabaka Sukuma Wiki
('a0000000-0000-0000-0000-000000000028', 23.5, 30.0, 55.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000028', 24.0, 28.0, 52.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000028', 25.5, 18.0, 46.0, CURRENT_DATE),
-- Coast Coconut Grove
('a0000000-0000-0000-0000-000000000029', 31.0, 10.0, 35.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000029', 32.0,  8.0, 32.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000029', 33.0,  5.0, 28.0, CURRENT_DATE),
-- Kilifi Mango Farm
('a0000000-0000-0000-0000-000000000030', 30.5, 12.0, 38.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000030', 31.0, 10.0, 35.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000030', 32.5,  6.0, 30.0, CURRENT_DATE),
-- Nanyuki Livestock Farm
('a0000000-0000-0000-0000-000000000031', 20.0, 40.0, 58.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000031', 19.5, 45.0, 62.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000031', 21.0, 30.0, 52.0, CURRENT_DATE),
-- Voi Sesame Farm
('a0000000-0000-0000-0000-000000000032', 33.0,  5.0, 20.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000032', 34.0,  3.0, 18.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000032', 35.0,  2.0, 15.0, CURRENT_DATE),
-- Garissa Cotton Field
('a0000000-0000-0000-0000-000000000033', 35.0,  3.0, 18.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000033', 36.0,  2.0, 15.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000033', 37.0,  1.0, 12.0, CURRENT_DATE),
-- Migori Sugar Belt
('a0000000-0000-0000-0000-000000000034', 27.0, 22.0, 48.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000034', 28.0, 18.0, 45.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000034', 29.5, 12.0, 40.0, CURRENT_DATE),
-- Rongo Maize Plot
('a0000000-0000-0000-0000-000000000035', 26.5, 25.0, 50.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000035', 27.0, 22.0, 48.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000035', 28.0, 15.0, 42.0, CURRENT_DATE),
-- Malindi Cashew Farm
('a0000000-0000-0000-0000-000000000036', 30.0, 12.0, 35.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000036', 31.0, 10.0, 32.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000036', 32.0,  8.0, 28.0, CURRENT_DATE),
-- Sabaki Banana Patch
('a0000000-0000-0000-0000-000000000037', 29.5, 15.0, 40.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000037', 30.0, 12.0, 38.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000037', 31.5,  8.0, 34.0, CURRENT_DATE)
) AS v(farm_id, temp, rain, moist, dt);

-- ────────────────────────────────────────────────────────────────
-- 5. RECOMMENDATIONS (1–2 per farm — mix of IRRIGATE/WAIT/MONITOR/CONSERVE)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.recommendations (farm_id, action, reason, water_saved_estimate, created_at)
SELECT farm_id, action, reason, water_saved, ts
FROM (VALUES
-- Green Valley Farm
('a0000000-0000-0000-0000-000000000001', 'MONITOR',  'Soil moisture is adequate at 45%. No irrigation needed today.', 0.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('a0000000-0000-0000-0000-000000000001', 'IRRIGATE', 'Soil moisture dropped to 30% with high temperatures. Drip irrigation recommended.', 1500.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Riverside Beans
('a0000000-0000-0000-0000-000000000002', 'WAIT',     'Rain expected in the next 48 hours. Hold off on irrigation.', 2000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Hilltop Tomatoes
('a0000000-0000-0000-0000-000000000003', 'IRRIGATE', 'Critical: soil moisture at 18%. Immediate drip irrigation required for tomatoes.', 3000.0, CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000003', 'IRRIGATE', 'Soil remains dry at 22%. Continue irrigation cycle.', 2800.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
-- Naivasha Rose Farm
('a0000000-0000-0000-0000-000000000004', 'MONITOR',  'Soil moisture is good at 55%. Monitor conditions.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000004', 'WAIT',     'Recent rainfall has replenished soil moisture. No action needed.', 3500.0, CURRENT_TIMESTAMP),
-- Lake View Vegetables
('a0000000-0000-0000-0000-000000000005', 'CONSERVE', 'Heavy rainfall expected. Conserve tank water for later use.', 4000.0, CURRENT_TIMESTAMP),
-- Eldoret Wheat Fields
('a0000000-0000-0000-0000-000000000006', 'CONSERVE', 'Ample rainfall forecast. Rainfed wheat needs no supplemental water.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Rift Valley Maize
('a0000000-0000-0000-0000-000000000007', 'MONITOR',  'Soil moisture adequate at 60%. Check again tomorrow.', 0.0, CURRENT_TIMESTAMP),
-- Lakeside Cassava
('a0000000-0000-0000-0000-000000000008', 'IRRIGATE', 'Moisture dropping to 30%. Cassava needs consistent water during root development.', 1800.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Nyando Sugarcane
('a0000000-0000-0000-0000-000000000009', 'MONITOR',  'Moisture at 42%. Sugarcane is resilient but monitor closely.', 0.0, CURRENT_TIMESTAMP),
-- Mt Kenya Tea Estate
('a0000000-0000-0000-0000-000000000010', 'CONSERVE', 'High elevation, cool temperatures, and good rainfall. No irrigation needed.', 7000.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('a0000000-0000-0000-0000-000000000010', 'WAIT',     'Rainfall probability is 45%. Hold irrigation until after the rain event.', 5000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Highland Coffee Plot
('a0000000-0000-0000-0000-000000000011', 'MONITOR',  'Moisture at 65%. Coffee plants are well hydrated.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000011', 'WAIT',     'Rain expected. Drip irrigation can wait.', 2500.0, CURRENT_TIMESTAMP),
-- Kericho Green Tea
('a0000000-0000-0000-0000-000000000012', 'CONSERVE', 'Kericho highlands receive consistent rainfall. Tank water conserved.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Kipkelion Pyrethrum
('a0000000-0000-0000-0000-000000000013', 'MONITOR',  'Moisture adequate at 62%. Pyrethrum is hardy.', 0.0, CURRENT_TIMESTAMP),
-- Meru Miraa Farm
('a0000000-0000-0000-0000-000000000014', 'IRRIGATE', 'Moisture at 48%. Miraa benefits from consistent moisture. Drip recommended.', 3000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Imenti Banana Block
('a0000000-0000-0000-0000-000000000015', 'IRRIGATE', 'Bananas need regular watering. Moisture dropped to 45%.', 4000.0, CURRENT_TIMESTAMP),
-- Machakos Sorghum
('a0000000-0000-0000-0000-000000000016', 'IRRIGATE', 'Critical dry conditions. Sorghum is drought-tolerant but needs water at 22%.', 2500.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000016', 'IRRIGATE', 'Still dry. Continue irrigation cycle.', 2200.0, CURRENT_TIMESTAMP),
-- Athi River Poultry Fodder
('a0000000-0000-0000-0000-000000000017', 'IRRIGATE', 'Napier grass moisture at 28%. Irrigate to maintain fodder supply.', 1500.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Kitale Grain Farm
('a0000000-0000-0000-0000-000000000018', 'MONITOR',  'Good moisture at 58%. Kitale region has reliable rainfall.', 0.0, CURRENT_TIMESTAMP),
-- Trans-Nzoia Beans
('a0000000-0000-0000-0000-000000000019', 'WAIT',     'Rain forecast at 32%. Hold irrigation for now.', 2000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Thika Pineapple Farm
('a0000000-0000-0000-0000-000000000020', 'MONITOR',  'Moisture at 38%. Pineapple is somewhat drought-tolerant but monitor.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000020', 'IRRIGATE', 'Moisture continues to drop. Light drip irrigation recommended.', 2000.0, CURRENT_TIMESTAMP),
-- Chania Avocado Grove
('a0000000-0000-0000-0000-000000000021', 'MONITOR',  'Avocado trees are deep-rooted. Moisture at 40% is acceptable.', 0.0, CURRENT_TIMESTAMP),
-- Kakamega Sugarcane
('a0000000-0000-0000-0000-000000000022', 'WAIT',     'Moderate rain expected. Hold furrow irrigation.', 5000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Mumias Bean Plot
('a0000000-0000-0000-0000-000000000023', 'MONITOR',  'Moisture adequate at 42%. Monitor through the week.', 0.0, CURRENT_TIMESTAMP),
-- Bungoma Maize Belt
('a0000000-0000-0000-0000-000000000024', 'WAIT',     'Rain probability at 18%. Hold for now, check soil again tomorrow.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Embu Hillside Farm
('a0000000-0000-0000-0000-000000000025', 'IRRIGATE', 'Maize at critical growth stage. Moisture at 46% needs boost.', 2500.0, CURRENT_TIMESTAMP),
-- Runyejes Cassava
('a0000000-0000-0000-0000-000000000026', 'CONSERVE', 'Cassava is drought-hardy. No irrigation needed in current conditions.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Kisii Banana Farm
('a0000000-0000-0000-0000-000000000027', 'IRRIGATE', 'Bananas are water-intensive. Moisture at 52% is borderline. Irrigate lightly.', 3500.0, CURRENT_TIMESTAMP),
-- Tabaka Sukuma Wiki
('a0000000-0000-0000-0000-000000000028', 'MONITOR',  'Moisture at 46%. Sukuma Wiki (collards) is fairly resilient.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Coast Coconut Grove
('a0000000-0000-0000-0000-000000000029', 'IRRIGATE', 'Coastal heat is drying soil quickly. Moisture at 28%. Drip irrigation needed.', 3000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000029', 'IRRIGATE', 'Still dry at the coast. Continue irrigation.', 2800.0, CURRENT_TIMESTAMP),
-- Kilifi Mango Farm
('a0000000-0000-0000-0000-000000000030', 'MONITOR',  'Mango trees are moderately drought-tolerant. Moisture at 32% is borderline.', 0.0, CURRENT_TIMESTAMP),
-- Nanyuki Livestock Farm
('a0000000-0000-0000-0000-000000000031', 'MONITOR',  'Napier grass moisture at 52%. Adequate for livestock feed.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Voi Sesame Farm
('a0000000-0000-0000-0000-000000000032', 'IRRIGATE', 'Extreme heat at 35°C with moisture at 15%. Urgent irrigation needed.', 4000.0, CURRENT_TIMESTAMP),
-- Garissa Cotton Field
('a0000000-0000-0000-0000-000000000033', 'IRRIGATE', 'Desert conditions. Cotton needs water despite being drought-tolerant. Moisture at 12%.', 5000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000033', 'IRRIGATE', 'Critical: moisture at 12%. Flood irrigation recommended immediately.', 5000.0, CURRENT_TIMESTAMP),
-- Migori Sugar Belt
('a0000000-0000-0000-0000-000000000034', 'MONITOR',  'Moisture at 40%. Sugarcane is fairly established.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Rongo Maize Plot
('a0000000-0000-0000-0000-000000000035', 'IRRIGATE', 'Young maize needs consistent moisture. At 42%, a light drip cycle is due.', 1800.0, CURRENT_TIMESTAMP),
-- Malindi Cashew Farm
('a0000000-0000-0000-0000-000000000036', 'IRRIGATE', 'Cashew trees suffering from dry conditions. Moisture at 28%.', 2500.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Sabaki Banana Patch
('a0000000-0000-0000-0000-000000000037', 'MONITOR',  'Moisture at 34%. Borderline for bananas. Monitor closely.', 0.0, CURRENT_TIMESTAMP)
) AS v(farm_id, action, reason, water_saved, ts);

-- ────────────────────────────────────────────────────────────────
-- 6. ALERTS (SMS logs — mix of SENT/PENDING/FAILED)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.alerts (farm_id, message, status, sent_at, created_at)
SELECT farm_id, message, status, sent, created
FROM (VALUES
('a0000000-0000-0000-0000-000000000001', 'AMATSI Alert: Moisture is low at 30%. Recommended to irrigate your Maize field (Green Valley Farm).',    'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000001', 'AMATSI Alert: Soil moisture recovered to 45%. No irrigation needed today for Green Valley Farm.',           'SENT',    CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('a0000000-0000-0000-0000-000000000003', 'AMATSI Alert: CRITICAL — Tomatoes need immediate irrigation. Moisture at 18%.',                               'SENT',    CURRENT_TIMESTAMP,                     CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000003', 'AMATSI Alert: Irrigation recommended for Hilltop Tomatoes. Drip cycle advised.',                                'PENDING', NULL,                                 CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('a0000000-0000-0000-0000-000000000004', 'AMATSI Alert: Rain expected. Hold irrigation for Naivasha Rose Farm.',                                          'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000010', 'AMATSI Alert: High rainfall expected. Conserve tank water at Mt Kenya Tea Estate.',                            'SENT',    CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('a0000000-0000-0000-0000-000000000014', 'AMATSI Alert: Moisture dropping on Miraa Farm. Drip irrigation recommended.',                                  'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000016', 'AMATSI Alert: Dry conditions in Machakos. Sorghum field needs water.',                                          'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000016', 'AMATSI Alert: Continued dry spell. Irrigate Machakos Sorghum.',                                                'PENDING', NULL,                                 CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
('a0000000-0000-0000-0000-000000000025', 'AMATSI Alert: Maize at critical stage. Embu Hillside Farm needs irrigation.',                                  'SENT',    CURRENT_TIMESTAMP,                     CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000029', 'AMATSI Alert: Coast heat wave. Coconut grove needs drip irrigation.',                                           'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000032', 'AMATSI Alert: EXTREME HEAT at Voi. Sesame farm needs urgent irrigation. Moisture at 15%.',                    'FAILED',  NULL,                                 CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('a0000000-0000-0000-0000-000000000033', 'AMATSI Alert: CRITICAL — Garissa Cotton moisture at 12%. Flood irrigation required immediately.',              'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',   CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000033', 'AMATSI Alert: Continued irrigation needed for Garissa Cotton. Moisture still critical.',                       'SENT',    CURRENT_TIMESTAMP,                     CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000035', 'AMATSI Alert: Young maize at Rongo needs water. Light drip recommended.',                                      'PENDING', NULL,                                 CURRENT_TIMESTAMP - INTERVAL '15 minutes')
) AS v(farm_id, message, status, sent, created);

-- ────────────────────────────────────────────────────────────────
-- 7. USER PHONES (additional SMS recipients for some users)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.user_phones (user_id, phone_number, label, is_primary) VALUES
  ('00000000-0000-0000-0000-000000000001', '+254710000000', 'Spouse',  false),
  ('00000000-0000-0000-0000-000000000001', '+254720000000', 'Worker',  false),
  ('00000000-0000-0000-0000-000000000004', '+254710000003', 'Worker',  false),
  ('00000000-0000-0000-0000-000000000005', '+254710000004', 'Family',  false),
  ('00000000-0000-0000-0000-000000000008', '+254710000007', 'Spouse',  false),
  ('00000000-0000-0000-0000-000000000016', '+254710000015', 'Worker',  false),
  ('00000000-0000-0000-0000-000000000016', '+254720000015', 'Spouse',  false),
  ('00000000-0000-0000-0000-000000000020', '+254710000019', 'Family',  false)
ON CONFLICT DO NOTHING;

-- ================================================================
-- SUMMARY: 20 users · 37 farms · ~111 weather records ·
--          ~45 recommendations · 15 alerts · 8 extra phones
-- ================================================================
