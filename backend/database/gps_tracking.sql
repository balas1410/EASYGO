-- Run in Supabase SQL Editor. GPS packets are written by the trusted backend only.
create table if not exists public.gps_locations (
  id bigint generated always as identity primary key,
  device_id text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  altitude_m double precision,
  speed_kmh double precision,
  heading_deg double precision,
  accuracy_m double precision,
  satellites integer,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists gps_locations_device_time_idx on public.gps_locations(device_id, recorded_at desc);
alter table public.gps_locations enable row level security;
-- Do not add anon write policies. The backend uses DATABASE_URL and device-token validation.
