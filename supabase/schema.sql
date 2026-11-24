-- BuildInstead — optional database for form submissions.
-- Run once in the Supabase SQL editor (Project → SQL → New query).
-- Visitors can only INSERT. Nobody can read rows with the anon key;
-- review submissions in the Supabase Table Editor.

create table if not exists public.tool_suggestions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  paid_tool     text not null check (char_length(paid_tool) between 2 and 200),
  problem       text not null check (char_length(problem) between 10 and 2000),
  wish          text not null check (char_length(wish) between 10 and 2000),
  email         text check (email is null or char_length(email) <= 254),
  status        text not null default 'new'
);

create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  topic         text not null check (topic in ('general','collaboration','suggestion','bug','feedback')),
  name          text not null check (char_length(name) between 1 and 120),
  email         text not null check (char_length(email) <= 254),
  message       text not null check (char_length(message) between 10 and 5000),
  status        text not null default 'new'
);

alter table public.tool_suggestions enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "anyone can submit suggestions" on public.tool_suggestions;
create policy "anyone can submit suggestions"
  on public.tool_suggestions for insert to anon
  with check (status = 'new');

drop policy if exists "anyone can send messages" on public.contact_messages;
create policy "anyone can send messages"
  on public.contact_messages for insert to anon
  with check (status = 'new');
