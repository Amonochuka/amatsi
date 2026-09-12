-- ================================================================
-- AMATSI — Demo Seed Data
--
-- ONE demo user:  Peter Pana  (+254700000000 / qwerty1234@#)
--   - premium (NOT admin)
--   - 6 farms across Kenya with different crops & conditions so
--     every page (dashboard, farms, irrigation, planner, alerts,
--     settings) is fully populated from a single login.
-- Plus 5 lightweight farmers (1 farm each) so admin/premium
-- features and switch-accounts still have something to work with.
--
-- All users share the same password: qwerty1234@#
--
-- The operator/admin account is a SEPARATE user created at backend
-- startup from ADMIN_BOOTSTRAP_PHONE / ADMIN_BOOTSTRAP_PASSWORD
-- (see internal/services/admin_service.go BootstrapAdmin). Use that
-- account to call POST /api/admin/reseed; it is never part of the seed.
-- ================================================================

-- Password bcrypt hash for qwerty1234@# (same for every demo user)
-- $2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy

-- ────────────────────────────────────────────────────────────────
-- 1. AUTH SCHEMA SHIM (safe to re-run)
-- ────────────────────────────────────────────────────────────────
INSERT INTO auth.users (id, email) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@amatsi.com'),
  ('00000000-0000-0000-0000-000000000002', 'grace@amatsi.com'),
  ('00000000-0000-0000-0000-000000000003', 'daniel@amatsi.com'),
  ('00000000-0000-0000-0000-000000000004', 'faith@amatsi.com'),
  ('00000000-0000-0000-0000-000000000005', 'joseph@amatsi.com'),
  ('00000000-0000-0000-0000-000000000006', 'mary@amatsi.com')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────
-- 2. USERS
--    Peter is find-or-created by phone number, so an already-existing
--    Peter account (e.g. in your hosted DB) gets upgraded instead of
--    being duplicated and farms attach to his real id (looked up by
--    phone below). Secondary users use fixed ids + on-conflict update.
-- ────────────────────────────────────────────────────────────────
-- Peter Pana — the super user (find-or-create by phone)
INSERT INTO public.users (id, full_name, phone_number, email, password_hash, language, sms_enabled, is_premium, is_admin)
SELECT '00000000-0000-0000-0000-000000000001', 'Peter Pana', '+254700000000', 'demo@amatsi.com',
       '$2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy',
       'en', true, true, false
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE phone_number = '+254700000000');

UPDATE public.users
   SET full_name = 'Peter Pana',
       email = 'demo@amatsi.com',
       password_hash = '$2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy',
       language = 'en',
       sms_enabled = true,
       is_premium = true,
       is_admin = false
 WHERE phone_number = '+254700000000';

-- ────────────────────────────────────────────────────────────────
-- 2b. RESET LEGACY DEMO DATA
--     Earlier versions of this seed created users with fixed ids
--     0002…0020 and farms sharing the a000… ids. Delete those rows so
--     this script always converges to exactly the dataset below.
--     Only demo rows (fixed demo UUIDs) are touched — real accounts
--     are never matched.
--     Also cleans up the very first seed farm (11111111-...) under
--     Peter's own user id so re-seeds don't leave stale rows.
-- ────────────────────────────────────────────────────────────────
-- Clean old Peter farm (11111111-...) from earliest seed versions
DELETE FROM public.alerts          WHERE farm_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.recommendations WHERE farm_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.weather         WHERE farm_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.farms           WHERE id      = '11111111-1111-1111-1111-111111111111';

-- Clean secondary users 0002…0020 (from earlier seed versions)
DELETE FROM public.alerts
 WHERE farm_id IN (SELECT id FROM public.farms WHERE user_id IN
   ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020'));
DELETE FROM public.recommendations
 WHERE farm_id IN (SELECT id FROM public.farms WHERE user_id IN
   ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020'));
DELETE FROM public.weather
 WHERE farm_id IN (SELECT id FROM public.farms WHERE user_id IN
   ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020'));
DELETE FROM public.farms WHERE user_id IN
   ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020');
DELETE FROM public.user_phones WHERE user_id IN
   ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020');
DELETE FROM public.users WHERE id IN
   ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000011',
    '00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000013',
    '00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000015',
    '00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000017',
    '00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000019',
    '00000000-0000-0000-0000-000000000020');

-- Secondary demo users
INSERT INTO public.users (id, full_name, phone_number, email, password_hash, language, sms_enabled, is_premium, is_admin) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Grace Wanjiku', '+254700000001', 'grace@amatsi.com',  '$2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy', 'en', true, false, false),
  ('00000000-0000-0000-0000-000000000003', 'Daniel Wafula', '+254700000002', 'daniel@amatsi.com', '$2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy', 'en', true, false, false),
  ('00000000-0000-0000-0000-000000000004', 'Faith Njeri',  '+254700000003', 'faith@amatsi.com',  '$2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy', 'sw', true, false, false),
  ('00000000-0000-0000-0000-000000000005', 'Joseph Kamau', '+254700000004', 'joseph@amatsi.com', '$2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy', 'en', true, false, false),
  ('00000000-0000-0000-0000-000000000006', 'Mary Akinyi',  '+254700000005', 'mary@amatsi.com',   '$2b$10$abFYy8eZnvKof.GolhGO0uiURlcykr8rGbxaF/TxsYiNZVIDEmvXy', 'sw', true, false, false)
ON CONFLICT (id) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  language = EXCLUDED.language,
  sms_enabled = EXCLUDED.sms_enabled,
  is_premium = EXCLUDED.is_premium,
  is_admin = EXCLUDED.is_admin;

-- ────────────────────────────────────────────────────────────────
-- 3. FARMS — Peter has 6 (one per crop/condition), secondaries 1 each
--    Note: user_id for Peter's farms is looked up by phone so the
--    farms attach to his real account id either way.
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.farms (
  id, user_id, name, latitude, longitude, area_hectares,
  crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date, device_id
)
SELECT v.id::uuid, u.id, v.name, v.lat, v.lon, v.area, v.crop, v.soil, v.method, v.tank::float8, v.planted::date, v.device
FROM (VALUES
-- Peter's farms
('a0000000-0000-0000-0000-000000000001', 'Green Valley Farm',    -1.2921,  36.8219, 2.5,  'Maize',    'Loam',  'Drip',      5000, '2026-05-01', 'KV-0001'),
('a0000000-0000-0000-0000-000000000002', 'Riverside Beans',      -0.7167,  36.4333, 1.5,  'Beans',    'Clay',  'Furrow',    3000, '2026-04-15', NULL),
('a0000000-0000-0000-0000-000000000003', 'Hilltop Tomatoes',     -0.4167,  36.9500, 1.0,  'Tomatoes', 'Sandy', 'Drip',      2000, '2026-06-01', 'KV-0002'),
('a0000000-0000-0000-0000-000000000004', 'Savannah Sorghum',     -1.5167,  37.2667, 3.0,  'Sorghum',  'Sandy', 'Rainfed',   NULL,  '2026-05-10', NULL),
('a0000000-0000-0000-0000-000000000005', 'Highland Tea Estate',  -0.3667,  35.2833, 3.0,  'Tea',      'Loam',  'Rainfed',   NULL,  '2026-02-01', NULL),
('a0000000-0000-0000-0000-000000000006', 'Coastal Mango Grove',  -3.6333,  39.9167, 2.0,  'Mango',    'Sandy', 'Drip',      4000, '2026-03-25', 'KV-0003')
) AS v(id, name, lat, lon, area, crop, soil, method, tank, planted, device)
JOIN public.users u ON u.phone_number = '+254700000000'
ON CONFLICT DO NOTHING;

-- Secondary users' farms
INSERT INTO public.farms (
  id, user_id, name, latitude, longitude, area_hectares,
  crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date
) VALUES
  ('a0000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'Naivasha Rose Farm',      -0.7167, 36.4333, 1.5,   'Roses',     'Loam',  'Drip',     4000, '2026-03-10'),
  ('a0000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'Bungoma Maize Belt',     0.5667,  34.5667, 4.0,   'Maize',     'Clay',  'Rainfed',  NULL, '2026-04-25'),
  ('a0000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000004', 'Kisii Banana Farm',      -0.6833, 34.7667, 2.8,   'Banana',    'Clay',  'Furrow',   5500, '2026-02-10'),
  ('a0000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000005', 'Meru Miraa Farm',        0.0500,  37.6500, 1.5,   'Khat',      'Loam',  'Drip',     4000, '2026-03-01'),
  ('a0000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000006', 'Coast Coconut Grove',    -4.0500, 39.6833, 3.5,   'Coconut',   'Sandy', 'Rainfed',  NULL, '2026-01-05')
ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────────
-- 3b. INITIAL TANK LEVELS — farms with tanks start ~60% full
-- ────────────────────────────────────────────────────────────────
UPDATE public.farms SET tank_current_liters = tank_capacity_liters * 0.6
WHERE tank_capacity_liters > 0 AND tank_current_liters IS NULL;

-- ────────────────────────────────────────────────────────────────
-- 4. WEATHER RECORDS (3 per farm — 2 days ago, yesterday, today)
-- ────────────────────────────────────────────────────────────────
-- Clean any previously-seeded rows so re-runs don't accumulate dupes.
DELETE FROM public.alerts          WHERE farm_id IN ('a0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000006','a0000000-0000-0000-0000-000000000011','a0000000-0000-0000-0000-000000000012','a0000000-0000-0000-0000-000000000013','a0000000-0000-0000-0000-000000000014','a0000000-0000-0000-0000-000000000015');
DELETE FROM public.recommendations WHERE farm_id IN ('a0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000006','a0000000-0000-0000-0000-000000000011','a0000000-0000-0000-0000-000000000012','a0000000-0000-0000-0000-000000000013','a0000000-0000-0000-0000-000000000014','a0000000-0000-0000-0000-000000000015');
DELETE FROM public.weather         WHERE farm_id IN ('a0000000-0000-0000-0000-000000000001','a0000000-0000-0000-0000-000000000002','a0000000-0000-0000-0000-000000000003','a0000000-0000-0000-0000-000000000004','a0000000-0000-0000-0000-000000000005','a0000000-0000-0000-0000-000000000006','a0000000-0000-0000-0000-000000000011','a0000000-0000-0000-0000-000000000012','a0000000-0000-0000-0000-000000000013','a0000000-0000-0000-0000-000000000014','a0000000-0000-0000-0000-000000000015');
DELETE FROM public.user_phones     WHERE user_id IN (SELECT id FROM public.users WHERE phone_number IN ('+254700000000','+254700000001','+254700000002','+254700000003','+254700000004','+254700000005'));

INSERT INTO public.weather (farm_id, temperature, rainfall_probability, soil_moisture, forecast_date) VALUES
-- Green Valley Farm (Maize) — healthy, MONITOR day
('a0000000-0000-0000-0000-000000000001', 25.5, 10.0, 48.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000001', 26.0, 15.0, 45.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000001', 27.0, 12.0, 42.0, CURRENT_DATE),
-- Riverside Beans — rain expected, WAIT day
('a0000000-0000-0000-0000-000000000002', 23.5, 35.0, 55.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000002', 24.0, 40.0, 52.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000002', 25.0, 30.0, 50.0, CURRENT_DATE),
-- Hilltop Tomatoes — dry, IRRIGATE day
('a0000000-0000-0000-0000-000000000003', 30.0,  5.0, 28.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000003', 31.0,  8.0, 23.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000003', 32.5,  3.0, 18.0, CURRENT_DATE),
-- Savannah Sorghum — drought, IRRIGATE day
('a0000000-0000-0000-0000-000000000004', 30.5,  8.0, 26.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000004', 31.5,  5.0, 23.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000004', 33.0,  3.0, 20.0, CURRENT_DATE),
-- Highland Tea Estate — wet highlands, CONSERVE day
('a0000000-0000-0000-0000-000000000005', 19.0, 55.0, 72.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000005', 18.5, 60.0, 75.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000005', 20.0, 45.0, 70.0, CURRENT_DATE),
-- Coastal Mango Grove — hot coast, IRRIGATE day
('a0000000-0000-0000-0000-000000000006', 30.5, 12.0, 36.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000006', 31.0, 10.0, 33.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000006', 32.5,  6.0, 30.0, CURRENT_DATE),
-- Naivasha Rose Farm
('a0000000-0000-0000-0000-000000000011', 24.0, 30.0, 60.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000011', 23.5, 35.0, 62.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000011', 25.0, 20.0, 55.0, CURRENT_DATE),
-- Bungoma Maize Belt
('a0000000-0000-0000-0000-000000000012', 25.0, 30.0, 55.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000012', 26.0, 28.0, 52.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000012', 27.5, 18.0, 45.0, CURRENT_DATE),
-- Kisii Banana Farm
('a0000000-0000-0000-0000-000000000013', 24.0, 35.0, 58.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000013', 23.5, 38.0, 60.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000013', 25.0, 25.0, 52.0, CURRENT_DATE),
-- Meru Miraa Farm
('a0000000-0000-0000-0000-000000000014', 22.0, 35.0, 55.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000014', 21.5, 40.0, 58.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000014', 23.0, 25.0, 48.0, CURRENT_DATE),
-- Coast Coconut Grove
('a0000000-0000-0000-0000-000000000015', 31.0, 10.0, 35.0, CURRENT_DATE - 2),
('a0000000-0000-0000-0000-000000000015', 32.0,  8.0, 32.0, CURRENT_DATE - 1),
('a0000000-0000-0000-0000-000000000015', 33.0,  5.0, 28.0, CURRENT_DATE);

-- ────────────────────────────────────────────────────────────────
-- 5. RECOMMENDATIONS (2-3 per farm, latest = today's state)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.recommendations (farm_id, action, reason, water_saved_estimate, created_at) VALUES
-- Green Valley Farm — latest MONITOR
('a0000000-0000-0000-0000-000000000001', 'IRRIGATE', 'Moisture dropped to 45% while temperatures stayed high. Drip cycle recommended.', 1200.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('a0000000-0000-0000-0000-000000000001', 'WAIT',     'Rain expected in the next 2 days. Hold irrigation to save water.', 2000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000001', 'MONITOR',  'Soil moisture is adequate at 42%. No irrigation needed today.', 0.0, CURRENT_TIMESTAMP),
-- Riverside Beans — latest WAIT
('a0000000-0000-0000-0000-000000000002', 'MONITOR',  'Soil moisture is healthy at 55%. Continue monitoring.', 0.0, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('a0000000-0000-0000-0000-000000000002', 'WAIT',     'Rainfall probability at 40%. Hold off on furrow irrigation.', 2500.0, CURRENT_TIMESTAMP),
-- Hilltop Tomatoes — latest IRRIGATE (critical)
('a0000000-0000-0000-0000-000000000003', 'IRRIGATE', 'Soil moisture at 23%. Tomatoes need water during fruit development.', 2600.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000003', 'IRRIGATE', 'CRITICAL: moisture at 18% in 32°C heat. Immediate drip irrigation recommended.', 3000.0, CURRENT_TIMESTAMP),
-- Savannah Sorghum — latest IRRIGATE (drought)
('a0000000-0000-0000-0000-000000000004', 'IRRIGATE', 'Moisture at 23%. Sorghum is drought-tolerant but needs water to set grain.', 2200.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000004', 'IRRIGATE', 'Continued dry spell at 20% moisture. Irrigation required.', 2500.0, CURRENT_TIMESTAMP),
-- Highland Tea Estate — latest CONSERVE
('a0000000-0000-0000-0000-000000000005', 'CONSERVE', 'Highland rain keeps soil at 72%. No irrigation needed — conserve tank water.', 5000.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000005', 'CONSERVE', 'Soil moisture excellent at 70%. Hold irrigation entirely.', 0.0, CURRENT_TIMESTAMP),
-- Coastal Mango Grove — latest IRRIGATE
('a0000000-0000-0000-0000-000000000006', 'MONITOR',  'Mango trees are deep-rooted. Moisture at 36% is borderline but acceptable.', 0.0, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000006', 'IRRIGATE', 'Coastal heat drying soil. Moisture at 30%. Drip irrigation recommended.', 2800.0, CURRENT_TIMESTAMP),
-- Naivasha Rose Farm
('a0000000-0000-0000-0000-000000000011', 'MONITOR',  'Roses well hydrated at 55%. Monitor through the day.', 0.0, CURRENT_TIMESTAMP),
-- Bungoma Maize Belt
('a0000000-0000-0000-0000-000000000012', 'IRRIGATE', 'Maize at 45% moisture in the vegetative stage. Water needed.', 3000.0, CURRENT_TIMESTAMP),
-- Kisii Banana Farm
('a0000000-0000-0000-0000-000000000013', 'CONSERVE', 'Consistent Kisii rainfall. Bananas well watered — conserve tank.', 4000.0, CURRENT_TIMESTAMP),
-- Meru Miraa Farm
('a0000000-0000-0000-0000-000000000014', 'IRRIGATE', 'Miraa benefits from steady moisture. At 48%, a light drip cycle is due.', 1800.0, CURRENT_TIMESTAMP),
-- Coast Coconut Grove
('a0000000-0000-0000-0000-000000000015', 'MONITOR',  'Coconuts are drought-hardy. Moisture at 32% is acceptable.', 0.0, CURRENT_TIMESTAMP);

-- ────────────────────────────────────────────────────────────────
-- 6. ALERTS (mix of SENT / PENDING / FAILED)
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.alerts (farm_id, message, status, sent_at, created_at) VALUES
('a0000000-0000-0000-0000-000000000001', 'AMATSI Alert: Rain expected. Holding irrigation for Green Valley Farm.',                              'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000001', 'AMATSI Alert: Soil moisture adequate — no irrigation needed at Green Valley Farm.',                  'SENT',    CURRENT_TIMESTAMP,                   CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000002', 'AMATSI Alert: 40% chance of rain at Riverside Beans. Irrigation paused.',                             'SENT',    CURRENT_TIMESTAMP,                   CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000003', 'AMATSI Alert: CRITICAL — Tomatoes at 18% moisture, 32°C. Irrigate immediately.',                     'SENT',    CURRENT_TIMESTAMP,                   CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000003', 'AMATSI Alert: Irrigate Hilltop Tomatoes — drip cycle advised.',                                      'PENDING', NULL,                                CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('a0000000-0000-0000-0000-000000000004', 'AMATSI Alert: Continued drought in Machakos. Sorghum field needs water.',                            'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',  CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000004', 'AMATSI Alert: Dry spell persists — irrigate Savannah Sorghum.',                                       'PENDING', NULL,                                CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
('a0000000-0000-0000-0000-000000000005', 'AMATSI Alert: Highland rains robust — conserving water at Highland Tea Estate.',                      'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',  CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000006', 'AMATSI Alert: Coastal heat wave. Mango grove needs drip irrigation.',                                 'SENT',    CURRENT_TIMESTAMP,                   CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000006', 'AMATSI Alert: Drip cycle scheduled for Coastal Mango Grove.',                                         'FAILED',  NULL,                                CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('a0000000-0000-0000-0000-000000000011', 'AMATSI Alert: Rain expected at Naivasha Rose Farm. Holding irrigation.',                               'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',  CURRENT_TIMESTAMP - INTERVAL '1 day'),
('a0000000-0000-0000-0000-000000000012', 'AMATSI Alert: Bungoma maize needs water at 45% moisture.',                                            'SENT',    CURRENT_TIMESTAMP,                   CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000013', 'AMATSI Alert: Conserving water — Kisii banana farm is well watered.',                                 'SENT',    CURRENT_TIMESTAMP,                   CURRENT_TIMESTAMP),
('a0000000-0000-0000-0000-000000000014', 'AMATSI Alert: Light drip irrigation advised for Meru Miraa Farm.',                                     'PENDING', NULL,                                CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
('a0000000-0000-0000-0000-000000000015', 'AMATSI Alert: Moisture acceptable for Coast Coconut Grove — no action.',                              'SENT',    CURRENT_TIMESTAMP - INTERVAL '1 day',  CURRENT_TIMESTAMP - INTERVAL '1 day');

-- ────────────────────────────────────────────────────────────────
-- 7. USER PHONES — additional SMS recipients for Peter
-- ────────────────────────────────────────────────────────────────
INSERT INTO public.user_phones (user_id, phone_number, label, is_primary)
SELECT u.id, v.phone, v.label, v.is_primary
FROM (VALUES
  ('+254710000000', 'Spouse', false),
  ('+254720000000', 'Worker', false),
  ('+254730000000', 'Family', false)
) AS v(phone, label, is_primary)
JOIN public.users u ON u.phone_number = '+254700000000'
ON CONFLICT DO NOTHING;

-- ================================================================
-- SUMMARY
--   1 super user (Peter Pana) with 6 farms + full weather,
--   recommendations, alerts, SMS recipients — everything populated.
--   5 secondary farmers with 1 farm each.
--   Login: 0700000000 / qwerty1234@#
-- ================================================================