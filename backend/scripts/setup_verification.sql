-- 1. Create Users Table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text unique,
  email text unique,
  phone_verified boolean default false,
  email_verified boolean default false,
  id_verified boolean default false,
  government_id_url text, -- For uploaded ID
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table users enable row level security;

-- 2. Create OTP Storage (Simple version for Hackathon)
create table if not exists otps (
  id bigserial primary key,
  identifier text not null, -- phone or email
  code text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_otps_identifier on otps(identifier);

-- 3. Update Lawyers Table with Verification Fields
alter table lawyers add column if not exists state_bar_council text;
alter table lawyers add column if not exists government_id_url text;
alter table lawyers add column if not exists bar_id_card_url text;
alter table lawyers add column if not exists phone_verified boolean default false;
alter table lawyers add column if not exists email_verified boolean default false;
alter table lawyers add column if not exists id_verified boolean default false;
alter table lawyers add column if not exists bar_verified boolean default false;

-- Update status check constraint for lawyers
alter table lawyers drop constraint if exists lawyers_status_check;
alter table lawyers add constraint lawyers_status_check check (status in ('pending', 'verified', 'rejected'));

-- Update spatial matching RPC to only return 'verified' lawyers
create or replace function find_nearby_lawyers(
  user_lat float,
  user_lng float,
  radius_km float,
  case_type text
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
    ST_Distance(l.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography) / 1000.0 as distance_km
  from lawyers l
  where 
    l.status = 'verified'
    and ST_DWithin(l.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_km * 1000)
    and (case_type = 'All' or case_type = '' or case_type = any(l.practice_areas))
  order by distance_km asc;
$$;
