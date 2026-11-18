# Velle — TODO

## Cash on delivery (contrareembolso) — live 17 Nov 2026

Built a day early (user's call, 17 Nov). "Pagar al recibir" is the main button; card/Bizum is the white button under it. No surcharge (same price as card). Orders are confirmed by WhatsApp and entered by hand on the warehouse page.

- [ ] Fully automatic WhatsApp message via the WhatsApp Business API (needs Meta business verification + an approved template, 1–5 days). For now the customer can confirm from the thank-you page, and the operator email has a one-tap link with the message already written.
- [ ] Admin button to mark a COD order delivered/paid (or refused) once the courier collects. Today it stays "cod_pending".
- [ ] Meta counts every COD order as a Purchase, refused ones too: compare against WhatsApp-confirmed orders when reading results.

## Abandoned carts (by hand, no discount)

Decided 16 Nov 2026: build it, but after the Navidad campaign analysis.

- In Stripe Checkout (`app/api/checkout/route.ts`), turn on `consent_collection.promotions: "auto"` and `after_expiration.recovery` (`enabled: true`, `allow_promotion_codes: false`). Stripe then shows the marketing-consent checkbox, which Spanish law requires before a reminder email.
- Shorten the session expiry (`expires_at`, 30 min–24 h; e.g. 1 h) so an abandoned cart is known quickly.
- Handle `checkout.session.expired` in the Stripe webhook: store the email (only present if they consented), the recovery URL and the pack they chose, on the `pending_payment` order.
- New admin page "Carritos abandonados": one row per expired checkout with an email, a "Enviar recordatorio" button and a ✓ with the time sent, like `/admin/clients`.
- Reminder email in the same design as the others: "tu cuadro te está esperando" with the recovery link. **No discount code.**
- Sent by hand from the admin for now; consider automating after seeing real cases.

Note: only customers who tick the consent box can be contacted.

## Server-side purchases to Meta (Conversions API) — parked 18 Nov 2026

Decided 18 Nov 2026: build it ourselves instead of buying a tool like wetracked.io (Shopify-oriented, ~$49–149/month, and "recover 100%" tools usually ignore cookie consent, which isn't legal in Spain).

- Send `Purchase` from the server: in the Stripe webhook (`checkout.session.completed` / `async_payment_succeeded`) and in `app/api/cod/route.ts`.
- **Only for visitors who accepted cookies**: pass the consent choice plus `_fbp`/`_fbc` from the browser at checkout and store them on the order. Nothing is sent for visitors who rejected.
- Same `event_id` as the browser Purchase (e.g. the order number) so Meta dedupes the two.
- Hashed email/phone (SHA-256) for match quality; needs a Conversions API token (Events Manager → dataset 769834309094276 → Settings).
- Worth doing before budgets go up for Black Friday/Navidad: catches purchases the browser misses (ad blockers, Safari, page closed early).
