-- Kindred storefront — initial schema
-- Run this in the Supabase SQL editor (or `supabase db push`) once the project exists.

create extension if not exists pgcrypto;

create table products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table product_variants (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid not null references products(id),
  label               text not null,
  price_cents         integer not null,
  currency            text not null default 'eur',
  stripe_price_id     text,
  gelato_product_uid  text,
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);

create table orders (
  id                          uuid primary key default gen_random_uuid(),
  order_number                text unique not null,
  product_id                  uuid not null references products(id),
  variant_id                  uuid not null references product_variants(id),
  status                      text not null default 'pending_payment'
                                check (status in ('pending_payment','paid','payment_failed',
                                                   'sent_to_gelato','fulfilled','canceled')),
  personalization             jsonb not null,
  print_file_url              text,
  customer_email              text,
  customer_name               text,
  shipping_address            jsonb,
  amount_total_cents          integer,
  currency                    text,
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  gelato_order_id             text,
  gelato_status               text,
  notes                       text,
  created_at                  timestamptz not null default now(),
  paid_at                     timestamptz,
  sent_to_gelato_at           timestamptz,
  fulfilled_at                timestamptz
);

create index orders_status_idx on orders(status);

create table order_status_events (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id),
  from_status text,
  to_status   text not null,
  note        text,
  created_at  timestamptz not null default now()
);

create table stripe_webhook_events (
  id           text primary key,
  type         text not null,
  processed_at timestamptz not null default now()
);

-- Seed the two launch products. Variant prices are the draft numbers from
-- brands/kindred/viability-assessment.md — confirm against real Gelato COGS
-- before going live, and fill in stripe_price_id / gelato_product_uid once
-- those are created in each provider's dashboard (not guessable, see README).
insert into products (slug, name, description) values
  ('star-map', 'Star Map', 'A custom star chart of the sky at a date, time, and place that matters to you.'),
  ('pet-portrait', 'Pet Portrait', 'A custom portrait of your dog, cat, or bunny, printed as a keepsake canvas.');

insert into product_variants (product_id, label, price_cents, currency)
select id, '30x40cm poster', 3500, 'eur' from products where slug = 'star-map';

insert into product_variants (product_id, label, price_cents, currency)
select id, '20x25cm canvas', 4500, 'eur' from products where slug = 'pet-portrait';
