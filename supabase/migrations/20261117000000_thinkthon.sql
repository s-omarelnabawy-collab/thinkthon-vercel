begin;
create table public.thinkthon_applications (
  id uuid primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  student_id text not null unique,
  batch text not null,
  major text not null,
  linkedin text,
  created_at timestamptz not null default now()
);
alter table public.thinkthon_applications enable row level security;
revoke all on public.thinkthon_applications from anon, authenticated;
grant select, insert on public.thinkthon_applications to service_role;
commit;
