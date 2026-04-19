-- Enable PostGIS for geographical queries
create extension if not exists postgis;

-- Create lawyers table
create table if not exists lawyers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null unique,
  email text not null unique,
  bar_council_id text not null unique,
  practice_areas text[] not null default '{}',
  experience_years int not null,
  office_address text not null,
  city text not null,
  pincode text not null,
  availability text not null check (availability in ('Online', 'Offline', 'Both')),
  consultation_fee decimal(10,2),
  location geography(point) not null, -- Stores Longitude + Latitude
  status text not null default 'Pending' check (status in ('Pending', 'Approved', 'Rejected')),
  email_verified boolean default false,
  id_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create OTPs table for verification
create table if not exists otps (
  id uuid primary key default gen_random_uuid(),
  identifier text not null,
  code text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast lookup by identifier (email)
create index if not exists idx_otps_identifier on otps(identifier);

-- Turn on Row Level Security (RLS) but allow service_role to bypass it
alter table lawyers enable row level security;

-- Create contact logs table for analytics
create table if not exists contact_logs (
  id uuid primary key default gen_random_uuid(),
  lawyer_id uuid references lawyers(id) on delete cascade,
  user_phone text, -- optional if anon
  contact_method text not null check (contact_method in ('Call', 'WhatsApp', 'In-App')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table contact_logs enable row level security;

-- Create spatial matching RPC
create or replace function find_nearby_lawyers(
  u_lat float,
  u_lng float,
  r_km float,
  c_type text
)
returns table (
  id uuid,
  full_name text,
  phone text,
  email text,
  practice_areas text[],
  experience_years int,
  office_address text,
  city text,
  availability text,
  consultation_fee decimal(10,2),
  status text,
  distance_km float
)
language sql stable
as $$
  select
    l.id,
    l.full_name,
    l.phone,
    l.email,
    l.practice_areas,
    l.experience_years,
    l.office_address,
    l.city,
    l.availability,
    l.consultation_fee,
    l.status,
    -- Calculate distance in kilometers using PostGIS
    ST_Distance(l.location, ST_SetSRID(ST_MakePoint(u_lng, u_lat), 4326)::geography) / 1000.0 as distance_km
  from lawyers l
  where 
    -- Filter by status: Approved or Pending for dev
    l.status in ('Approved', 'Pending')
    -- Filter by distance
    and ST_DWithin(l.location, ST_SetSRID(ST_MakePoint(u_lng, u_lat), 4326)::geography, r_km * 1000)
    -- If c_type is 'All' or empty, ignore filter, otherwise check array (case-insensitive)
    and (
      c_type = 'All' 
      or c_type = '' 
      or exists (
        select 1 from unnest(l.practice_areas) p 
        where lower(p) = lower(c_type)
      )
    )
  order by distance_km asc;
$$;
