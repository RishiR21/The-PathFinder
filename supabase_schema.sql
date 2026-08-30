-- ==============================================================================
-- PathFinder - Supabase PostgreSQL Schema & Row Level Security (RLS)
-- Run this script in your Supabase Project's SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Create Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_emoji text default '🌲',
  home_state text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create User Saved Parks Table (Favorites, Visited Logs, Notes)
create table if not exists public.user_saved_data (
  user_id uuid references auth.users on delete cascade primary key,
  favorites jsonb default '[]'::jsonb,
  visited jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.user_saved_data enable row level security;

-- 4. RLS Policies for Profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- 5. RLS Policies for User Saved Data
drop policy if exists "Users can view own saved data" on public.user_saved_data;
create policy "Users can view own saved data" on public.user_saved_data
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own saved data" on public.user_saved_data;
create policy "Users can insert own saved data" on public.user_saved_data
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own saved data" on public.user_saved_data;
create policy "Users can update own saved data" on public.user_saved_data
  for update using (auth.uid() = user_id);

-- 6. Trigger to automatically create a profile when a new user signs up via Email OTP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_emoji)
  values (new.id, new.email, split_part(new.email, '@', 1), '🌲')
  on conflict (id) do nothing;
  
  insert into public.user_saved_data (user_id, favorites, visited)
  values (new.id, '[]'::jsonb, '{}'::jsonb)
  on conflict (user_id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
