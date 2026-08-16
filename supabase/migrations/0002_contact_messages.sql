-- Jeldi — contact form submissions
-- Run this after 0001_init.sql, in order, in the Supabase SQL editor
-- (or `supabase db push`).

-- =========================================================
-- contact_messages
-- Written directly from the browser (anon key) via the
-- /contact form — unlike `orders`, there's no sensitive
-- payment data here, so a public INSERT-only policy is safe.
-- No public SELECT policy: submitters can't read other
-- people's messages, and neither can the anon key in general.
-- Read from the Supabase dashboard, or later via a service-role
-- admin view if that becomes useful.
-- =========================================================
create table contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  status      text not null default 'new'
                check (status in ('new', 'read', 'replied')),
  created_at  timestamptz not null default now()
);

create index contact_messages_created_at_idx on contact_messages (created_at desc);

alter table contact_messages enable row level security;

create policy "anyone can submit a contact message"
  on contact_messages for insert
  with check (true);
