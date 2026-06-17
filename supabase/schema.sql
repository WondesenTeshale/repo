-- ============================================================
-- BetterDose Supabase Schema
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────
-- PROJECTS TABLE
-- ─────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('completed', 'ongoing', 'university')),
  description text default '',
  technologies_used text[] default '{}',
  screenshots text[] default '{}',
  github_repository text default '',
  live_demo text default '',
  team_members text[] default '{}',
  project_start_date date,
  project_end_date date,
  status text default '',
  features text[] default '{}',
  technical_architecture text default '',
  documentation_links jsonb default '[]',
  client_type text default '',
  project_outcome text default '',
  project_challenges text default '',
  notes text default '',
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────
-- BUSINESS CONFIG TABLE (singleton, id = 1)
-- Only editable fields are stored here.
-- Legal identity (owner name, registration, address) is
-- hardcoded in the application constants — not in the DB.
-- ─────────────────────────────────────────
create table if not exists business_config (
  id int primary key default 1,
  email text default 'contact@betterdose.website',
  phone text default '+251 911 000000',
  linkedin_nebiyu text default 'https://linkedin.com/in/nebiyu-muluadam',
  github_nebiyu text default 'https://github.com/nebiyu-m',
  linkedin_eyob text default 'https://linkedin.com/in/eyob-mulugeta',
  github_eyob text default 'https://github.com/eyobcode',
  updated_at timestamptz default now()
);

-- Insert the default singleton row
insert into business_config (id) values (1)
  on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- TEAM MEMBERS TABLE
-- ─────────────────────────────────────────
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text default '',
  bio text default '',
  uni_email text default '',
  prof_email text default '',
  github text default '',
  linkedin text default '',
  skills text[] default '{}',
  profile_photo_url text default '',
  display_order int default 0,
  created_at timestamptz default now()
);

-- Seed initial team members
insert into team_members (name, role, bio, uni_email, prof_email, github, linkedin, skills, display_order)
values
  (
    'Nebiyu Muluadam',
    'Founder & Owner',
    'Software engineering student and systems architect based in Addis Ababa, Ethiopia. Focuses on full-stack web applications, database schema optimization, commercial software design, and digital service deliveries.',
    'nebiyu.muluadam@aau.edu.et',
    'contact@betterdose.website',
    'https://github.com/nebiyu-m',
    'https://linkedin.com/in/nebiyu-muluadam',
    array['JavaScript','TypeScript','React','Next.js','PostgreSQL','System Design'],
    1
  ),
  (
    'Eyob Mulugeta',
    'Senior Developer',
    'Backend developer and system administrator specializing in script automation, API aggregations, network routing, and data engineering pipelines.',
    'eyob.mulugeta@aau.edu.et',
    'eyob@betterdose.website',
    'https://github.com/eyobcode',
    'https://linkedin.com/in/eyob-mulugeta',
    array['Python','Django','FastAPI','MongoDB','Docker','Automation','Linux Bash'],
    2
  ),
  (
    'Abel Tadesse',
    'Senior Developer',
    'Full-stack developer with a strong focus on frontend architecture, UI engineering, and cross-platform application development.',
    'abel.tadesse@aau.edu.et',
    'abel@betterdose.website',
    'https://github.com/abel-tadesse',
    '',
    array['React','TypeScript','Node.js','Tailwind CSS','REST APIs','UI/UX Engineering'],
    3
  )
on conflict do nothing;

-- ─────────────────────────────────────────
-- ACTIVITY ENTRIES TABLE
-- ─────────────────────────────────────────
create table if not exists activity_entries (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  entry_type text default 'Feature' check (entry_type in ('Feature','Delivery','Deployment','Repository Update','Upgrade','Internal','Academic')),
  description text default '',
  date_label text default '',
  tech text[] default '{}',
  status text default 'Shipped',
  created_at timestamptz default now()
);

-- Seed initial activity entries
insert into activity_entries (project_name, entry_type, description, date_label, tech, status)
values
  ('Internal SaaS Dashboard','Feature','Implemented multi-tenant subscription management with Stripe billing integration. Users can now upgrade, downgrade, or cancel plans from within the dashboard.','June 2025',array['Next.js','Stripe','Supabase'],'Shipped'),
  ('Client Management API','Delivery','Delivered a fully documented REST API for a client mobile application backend. Includes JWT authentication, role-based permissions, and PostgreSQL data layer.','May 2025',array['Django','PostgreSQL','JWT'],'Delivered'),
  ('Automation Pipeline v2','Upgrade','Upgraded a business automation script to handle 10x the original data volume. Added Celery task queue and Redis for asynchronous processing.','May 2025',array['Python','Celery','Redis'],'Deployed'),
  ('Portfolio & Business Website','Internal','Built and launched BetterDose public-facing website with dynamic project management system, configurable business information, and admin dashboard.','April 2025',array['Next.js','Tailwind CSS','Framer Motion'],'Live'),
  ('University Academic System','Academic','Full-stack academic management system developed as part of Advanced Software Engineering coursework at Addis Ababa University.','March 2025',array['Django','React','PostgreSQL'],'Completed'),
  ('Data Processing Automation','Delivery','Delivered a Python-based data processing automation to a commercial client. Automated daily report generation.','February 2025',array['Python','Pandas','Celery'],'Delivered')
on conflict do nothing;

-- ─────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('portfolio-images', 'portfolio-images', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('documents', 'documents', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('team-photos', 'team-photos', true)
  on conflict (id) do nothing;

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Anon key = READ ONLY.
-- All writes go through server-side API routes
-- using SUPABASE_SERVICE_ROLE_KEY (never exposed to browser).
-- ─────────────────────────────────────────
alter table projects enable row level security;
alter table business_config enable row level security;
alter table team_members enable row level security;
alter table activity_entries enable row level security;

-- Public reads only
create policy "Public read projects" on projects for select using (true);
create policy "Public read config" on business_config for select using (true);
create policy "Public read team" on team_members for select using (true);
create policy "Public read activity" on activity_entries for select using (true);

-- NO anon write policies. Writes require service_role key (server-side only).

-- Storage: public read, no anon writes
create policy "Public read portfolio-images"
  on storage.objects for select using (bucket_id = 'portfolio-images');

create policy "Public read documents"
  on storage.objects for select using (bucket_id = 'documents');

create policy "Public read team-photos"
  on storage.objects for select using (bucket_id = 'team-photos');
