-- Supabase SQL to create attendance table for Uthan Senior Home Care
-- Fields: id, user_id, user_name, role, check_in_time, check_out_time, date, location, created_at

create table if not exists attendance (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null,
  user_name text not null,
  role text not null check (role in ('member', 'employee', 'admin')),
  check_in_time timestamptz not null,
  check_out_time timestamptz,
  date date not null,
  location text not null,
  created_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table attendance enable row level security;

-- Policy: Users can insert their own attendance records
create policy "Users can insert own attendance" on attendance
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own attendance records (for check-out)
create policy "Users can update own attendance" on attendance
  for update using (auth.uid() = user_id);

-- Policy: Users can select their own attendance records
create policy "Users can select own attendance" on attendance
  for select using (auth.uid() = user_id);

-- User role assignments table for admin user management
create table if not exists user_roles (
  email text primary key,
  user_id uuid,
  full_name text,
  role text not null check (role in ('member', 'employee', 'admin')) default 'member',
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table user_roles enable row level security;

-- Helper: determine whether the current authenticated user is an admin
create or replace function is_admin()
  returns boolean
  security definer
  stable
  language sql
as $$
  select exists (
    select 1 from user_roles
    where email = auth.jwt()->>'email'
      and role = 'admin'
  );
$$;

-- Policy: Admins can select all attendance records
create policy "Admins can select all attendance" on attendance
  for select using (is_admin());

create index if not exists attendance_user_id_idx on attendance(user_id);
create index if not exists attendance_date_idx on attendance(date);
create index if not exists attendance_check_out_time_idx on attendance(check_out_time);

-- Policy: Users can select their own role row
create policy "Users can select own role" on user_roles
  for select using (email = auth.jwt()->>'email');

-- Policy: Users can insert their own role row
create policy "Users can insert own role" on user_roles
  for insert with check (email = auth.jwt()->>'email');

-- Policy: Admins can select all roles
create policy "Admins can select all roles" on user_roles
  for select using (is_admin());

-- Policy: Admins can manage all roles
create policy "Admins can manage all roles" on user_roles
  for all using (is_admin());

create index if not exists user_roles_role_idx on user_roles(role);
create index if not exists user_roles_updated_at_idx on user_roles(updated_at);
