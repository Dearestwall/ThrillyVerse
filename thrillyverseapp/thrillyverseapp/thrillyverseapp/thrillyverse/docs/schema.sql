create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'user',
  created_at timestamptz default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text not null,
  logo_url text,
  category text,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists materials (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  title text not null,
  description text,
  drive_url text not null,
  category text,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists movies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  language text,
  type text,
  poster_url text,
  status text,
  description text,
  release_year int,
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_url text,
  category text,
  published boolean default false,
  created_at timestamptz default now()
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists homepage_settings (
  id uuid primary key default gen_random_uuid(),
  hero_title text,
  hero_subtitle text,
  hero_cta_text text,
  hero_cta_url text,
  announcement text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table projects enable row level security;
alter table materials enable row level security;
alter table movies enable row level security;
alter table blogs enable row level security;
alter table contact_submissions enable row level security;
alter table homepage_settings enable row level security;

create policy "public read projects" on projects for select using (true);
create policy "public read materials" on materials for select using (true);
create policy "public read movies" on movies for select using (true);
create policy "public read blogs" on blogs for select using (published = true);
create policy "public insert contact_submissions" on contact_submissions for insert with check (true);
create policy "public read homepage_settings" on homepage_settings for select using (true);