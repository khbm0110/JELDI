-- Jeldi — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push` if using the CLI),
-- on a fresh project, in order. See supabase/README.md for setup notes.

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- Shared trigger: keep updated_at current on every row update.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================
-- products
-- One row per sellable item. Phase 1 has exactly one row
-- (the Fez Bifold), but the shape supports the roadmap's
-- Phase 2/3 expansion (belt, additional colors, etc.).
-- =========================================================
create table products (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  description    text not null default '',
  -- Price is nullable on purpose: Phase 1 launches with the
  -- artisan price still under negotiation (see 01-business-plan.md).
  -- A null price means "pending" — the storefront must handle this,
  -- never fall back to a fake number.
  price_cents    integer check (price_cents is null or price_cents >= 0),
  currency       text not null default 'USD',
  images         text[] not null default '{}',
  stock_status   text not null default 'coming_soon'
                   check (stock_status in ('coming_soon', 'available', 'limited', 'sold_out')),
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

create index products_slug_idx on products (slug);

-- =========================================================
-- orders
-- Written server-side only (API route / webhook handler using
-- the service role key), never directly from the browser —
-- see the RLS notes below. Keeps enough shipping/customs
-- context for the US-facing sale described in 03-payments-legal.md.
-- =========================================================
create table orders (
  id                    uuid primary key default gen_random_uuid(),
  product_id            uuid not null references products (id),
  customer_email        text not null,
  customer_name         text,
  shipping_address      jsonb,
  quantity              integer not null default 1 check (quantity > 0),
  total_cents           integer not null check (total_cents >= 0),
  currency              text not null default 'USD',
  status                text not null default 'pending'
                          check (status in ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded')),
  paypal_order_id       text,
  paypal_transaction_id text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger orders_set_updated_at
  before update on orders
  for each row execute function set_updated_at();

create index orders_product_id_idx on orders (product_id);
create index orders_status_idx on orders (status);
create unique index orders_paypal_order_id_idx on orders (paypal_order_id) where paypal_order_id is not null;

-- =========================================================
-- story_content
-- Editable blocks for /our-story, keyed by section so the
-- page can pull real copy without a code deploy. See
-- supabase/seed.sql for the initial values matching the
-- current hardcoded page.
-- =========================================================
create table story_content (
  id           uuid primary key default gen_random_uuid(),
  section_key  text not null unique,
  content_type text not null default 'text' check (content_type in ('text', 'markdown', 'image_url')),
  content      text not null,
  sort_order   integer not null default 0,
  updated_at   timestamptz not null default now()
);

create trigger story_content_set_updated_at
  before update on story_content
  for each row execute function set_updated_at();

-- =========================================================
-- Row Level Security
-- =========================================================
alter table products enable row level security;
alter table orders enable row level security;
alter table story_content enable row level security;

-- products: anyone can read; only the service role (server) can write.
create policy "products are publicly readable"
  on products for select
  using (true);

-- story_content: anyone can read; only the service role can write.
create policy "story_content is publicly readable"
  on story_content for select
  using (true);

-- orders: no public policies at all — orders are only ever created
-- or read from a trusted server context (API route/webhook) using
-- the service role key, which bypasses RLS entirely. This keeps
-- customer email/address data out of reach of the anon key.
