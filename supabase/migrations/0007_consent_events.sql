-- Anonymous count of cookie-banner answers, added 18 Nov 2026, to measure how
-- many visitors accept Meta's pixel (the rest are invisible to the ads).
-- One row per event, no identifiers: no IP, no cookie, no user agent, no URL.
--   shown   = the banner opened by itself on a page load (visitor hasn't chosen)
--   granted / denied = the visitor answered that banner
-- from_ad = the landing URL had Meta's fbclid (they came from an ad).
-- Run this in the Supabase SQL editor after 0006.

create table if not exists consent_events (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  event       text not null check (event in ('shown','granted','denied')),
  from_ad     boolean not null default false
);

create index if not exists consent_events_created_at_idx on consent_events(created_at);

-- Only the server (service role) reads or writes it.
alter table consent_events enable row level security;
