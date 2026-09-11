# Velle Storefront

Minimalist storefront for Velle — custom star map posters + custom pet portraits, printed
on demand via Gelato. Built as a standalone Next.js + Vercel + Stripe + Supabase project,
separate from the `content-generator` admin tool (see that repo's `brands/velle/` for the
brand/economics context this was built from — that folder was originally called `kindred`
during planning, before the brand name settled on Velle; this repo's directory name
(`kindred-storefront`) is a leftover from the same period and purely cosmetic, safe to
ignore or rename later).

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS v4 · Supabase (Postgres + Storage) · Stripe
Checkout · Gelato (print-on-demand fulfillment, triggered manually for now) · Resend (order
notification email).

## First-time setup

1. `npm install`
2. Create a Supabase project. Run `supabase/migrations/0001_init.sql` in its SQL editor.
   Create two **public-read** Storage buckets: `uploads` (customer photo uploads) and
   `print-files` (rendered star maps + manually-uploaded stylized pet portraits).
3. Copy `.env.local.example` to `.env.local` and fill in Supabase, Stripe (test mode to
   start), and `ADMIN_USER`/`ADMIN_PASSWORD`. Leave `GELATO_DRY_RUN=true` until Gelato is set
   up (step 5).
4. `npm run dev`, and in a second terminal: `stripe listen --forward-to
   localhost:3000/api/webhooks/stripe` — paste the printed webhook secret into
   `STRIPE_WEBHOOK_SECRET`.
5. In the Gelato dashboard, find the exact product (size/material) to fulfill each variant
   with, and set `product_variants.gelato_product_uid` for both rows (SQL editor or a Supabase
   table view). Set a real `GELATO_API_KEY` and flip `GELATO_DRY_RUN=false` once ready to test
   real order creation.
6. Optionally set `stripe_price_id` on each variant once real Stripe Price objects are created
   in the Dashboard — checkout works without this too (falls back to inline pricing), but a
   real Price object is what Stripe Tax needs for reporting.

## How an order flows

`pending_payment` → (Stripe webhook) → `paid` → (operator reviews `/admin/orders`, uploads a
stylized print file for pet portraits — star maps render automatically — then clicks **Send to
Gelato**) → `sent_to_gelato` → (operator marks it once shipped) → `fulfilled`.

This is deliberately semi-manual for the first weeks of testing — see
`content-generator/brands/velle/README.md` for why. Flipping to fully automatic later means
wiring `createGelatoOrder` (in `lib/gelato.ts`) into the webhook instead of the admin action —
no restructuring needed.

## Meta ads reuse

This brand reuses an existing Meta ad account, Pixel, and Facebook Page (previously used for
Velle's earlier, unrelated product) rather than starting from zero — clean history, no
penalties, and the `velle.es` domain is already verified in the Business Manager. Install the
same Pixel ID here once deploying; see `content-generator/brands/velle/campaign-log.md` for the
full reasoning.

## What's out of scope for v1

Multi-language, multi-item cart, customer accounts, automated Gelato fulfillment, automated
photo stylization, marketing pages beyond home + the 2 product pages, discount codes, refund UI
(use the Stripe Dashboard), Gelato fulfillment-status polling. See the implementation plan this
was built from for the full reasoning.

## Deploying

Deploy to Vercel under the `velle.es` domain (already verified in the Meta Business Manager —
no need to add a new domain), set the same env vars there (live keys once ready), register the
production webhook endpoint in the Stripe Dashboard pointed at
`https://velle.es/api/webhooks/stripe`, and enable Stripe Tax with the correct origin address.
