-- Run in Supabase SQL Editor before deploying the API.
create table if not exists public.gps_positions (
  id bigserial primary key,
  device_id text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  altitude_m double precision,
  speed_kph double precision,
  heading_deg double precision,
  accuracy_m double precision,
  satellites integer,
  recorded_at timestamptz not null default now(),
  received_at timestamptz not null default now()
);
create index if not exists gps_positions_device_time_idx on public.gps_positions(device_id, recorded_at desc);
-- Keep this table inaccessible to anonymous clients; the backend connects using DATABASE_URL.
alter table public.gps_positions enable row level security;
