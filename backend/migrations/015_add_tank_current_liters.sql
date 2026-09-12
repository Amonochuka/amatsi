-- 015_add_tank_current_liters.sql
-- Track simulated tank water level per farm.
-- NULL = farm has no tank (rainfed). Non-null = current water in liters.
ALTER TABLE public.farms
  ADD COLUMN tank_current_liters double precision;

-- Backfill existing farms that have a tank: start them ~60% full so the
-- daily weather/irrigation simulation has a starting level to work from.
-- Farms without a tank (rainfed, NULL capacity) stay NULL and are skipped.
UPDATE public.farms
   SET tank_current_liters = tank_capacity_liters * 0.6
 WHERE tank_capacity_liters > 0
   AND tank_current_liters IS NULL;
