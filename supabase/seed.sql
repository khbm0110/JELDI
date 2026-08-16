-- Jeldi — seed data
-- Run after 0001_init.sql. Safe to re-run (upserts on the unique key).

-- ---------------------------------------------------------
-- products: NOT seeded here anymore. Every product now enters the
-- database exclusively through the admin panel at /admin/products
-- (password-gated by the ADMIN_PASSWORD env var — see
-- .env.local.example and lib/admin-auth.ts), so there is no product
-- data left in the codebase at all, seed script included. Log in
-- there and add "The Fez Bifold" (or whatever it ends up called)
-- once the artisan price is settled.
-- ---------------------------------------------------------

-- ---------------------------------------------------------
-- story_content: mirrors the section-by-section copy currently
-- hardcoded in app/our-story/page.tsx, keyed so it can move to
-- a Supabase-backed fetch without changing the schema later.
-- ---------------------------------------------------------
insert into story_content (section_key, content_type, content, sort_order)
values
  ('hero_eyebrow', 'text', 'Our Story', 0),
  ('hero_title', 'text', 'Nearly a thousand years, in the same six vats.', 1),
  ('hero_body', 'text', 'Every Jeldi piece starts at the Chouara Tannery, in the oldest quarter of Fez — a working tannery, not a museum, where hides are still turned into leather entirely by hand.', 2),

  ('history_eyebrow', 'text', 'A Working History', 3),
  ('history_title', 'text', 'Older than the country''s modern borders.', 4),
  ('history_body', 'markdown', E'Fez el Bali, the old walled medina, has been a UNESCO World Heritage Site since 1981 — and the tanning quarter inside it predates that recognition by centuries. Chouara traces back to the 11th century, making it one of the oldest tanneries still operating anywhere in the world.\n\nAt its peak, medieval Fez held roughly 86 tannery houses. Today, three remain: Chouara, Sidi Moussa, and Ain Azliten. Chouara is the largest of the three, and the one most people picture when they think of Fez — the terraced stone vats, dyed in rings of color, seen from the leather-shop balconies above.\n\nThe tanners who work there now learned the craft the same way their predecessors did: standing next to someone who already knew it, for years, before working a vat alone.', 5),

  ('process_eyebrow', 'text', 'The Process', 6),
  ('process_title', 'text', 'Five steps. None of them shortcuts.', 7),

  ('tanning_eyebrow', 'text', 'Why It Matters', 8),
  ('tanning_title', 'text', 'Vegetable-tanned, not chrome-tanned.', 9),
  ('tanning_closing', 'text', 'Chrome tanning isn''t inherently dishonest — it''s how most of the world''s leather goods are made, and it''s faster and cheaper for a reason. We chose vegetable-tanned leather from Chouara because it''s the material this specific craft produces, and because it ages the way we wanted a piece like this to age: getting better, not just older.', 10),

  ('people_eyebrow', 'text', 'The People', 11),
  ('people_title', 'text', 'A craft under real pressure.', 12),
  ('people_body', 'markdown', E'We''re not going to pretend this trade is thriving simply because it''s beautiful to look at. Cheap machine-made leather and synthetic alternatives have squeezed traditional tanneries for years, and the work itself — standing in these vats for hours — is genuinely hard, physical labor that fewer young tanners are choosing to learn.\n\nWhat keeps Chouara running is craftsmen who kept doing it anyway, and buyers willing to pay for hides tanned the slow way instead of the cheap way. That''s the trade we''re trying to be part of: we buy directly from the workshop, with no middleman between the artisan and the price you pay, so more of it actually reaches the hands that made your piece.', 13),

  ('photo_note', 'text', 'The colors above are real — they''re the actual dye palette of the Chouara vats — but we haven''t shot documentary photos or video in Fez yet. When we do, this page gets real footage of the tannery and the workshop, not stock imagery, and any AI-assisted footage will be labeled honestly as such. No stand-ins pretending to be real.', 14)
on conflict (section_key) do update set
  content = excluded.content,
  content_type = excluded.content_type,
  sort_order = excluded.sort_order;
