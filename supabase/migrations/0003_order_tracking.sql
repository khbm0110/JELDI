-- Jeldi — order shipment tracking
-- Run this after 0001_init.sql and 0002_contact_messages.sql, in
-- order, in the Supabase SQL editor (or `supabase db push`).

-- =========================================================
-- orders: tracking fields
-- Filled in by hand from /admin/orders/[id]/edit once a package
-- ships. Nullable — most orders sit at "paid" for a while before
-- any of this exists, and the public /track page and admin UI both
-- treat null as "not shipped yet", not an error.
-- =========================================================
alter table orders
  add column tracking_number text,
  add column carrier text,
  add column tracking_url text;

-- Add "shipped" between "paid" and "fulfilled" — the gap this whole
-- feature exists to fill. Postgres auto-named the original inline
-- check constraint "orders_status_check" (table_column_check), so
-- that's the name to drop here.
alter table orders drop constraint orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pending', 'paid', 'shipped', 'fulfilled', 'cancelled', 'refunded'));

-- =========================================================
-- Public order lookup (the /track page)
--
-- No new RLS policy here on purpose: orders keeps its "service role
-- only" posture from 0001_init.sql. The /track page never queries
-- Supabase from the browser — it calls POST /api/track, a server
-- route that uses supabaseAdmin and checks paypal_order_id + email
-- together before returning anything. Letting the anon key read
-- orders directly (even filtered) would risk exposing shipping
-- addresses/emails to a broad client-side policy; funneling through
-- one server route keeps that data server-side always.
-- =========================================================
