# Velle — TODO

## Abandoned carts (by hand, no discount)

Decided 16 Nov 2026: build it, but after the Navidad campaign analysis.

- In Stripe Checkout (`app/api/checkout/route.ts`), turn on `consent_collection.promotions: "auto"` and `after_expiration.recovery` (`enabled: true`, `allow_promotion_codes: false`). Stripe then shows the marketing-consent checkbox, which Spanish law requires before a reminder email.
- Shorten the session expiry (`expires_at`, 30 min–24 h; e.g. 1 h) so an abandoned cart is known quickly.
- Handle `checkout.session.expired` in the Stripe webhook: store the email (only present if they consented), the recovery URL and the pack they chose, on the `pending_payment` order.
- New admin page "Carritos abandonados": one row per expired checkout with an email, a "Enviar recordatorio" button and a ✓ with the time sent, like `/admin/clients`.
- Reminder email in the same design as the others: "tu cuadro te está esperando" with the recovery link. **No discount code.**
- Sent by hand from the admin for now; consider automating after seeing real cases.

Note: only customers who tick the consent box can be contacted.
