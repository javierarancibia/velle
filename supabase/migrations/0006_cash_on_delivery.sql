-- Cash on delivery (contrareembolso) for the cuadro, added 17 Nov 2026.
-- A COD order is saved as 'cod_pending' (not paid yet: the customer pays the
-- courier), confirmed by WhatsApp and entered by hand on the warehouse page.
-- Run this in the Supabase SQL editor after 0005.

alter table orders drop constraint if exists orders_status_check;
alter table orders add constraint orders_status_check
  check (status in ('pending_payment','paid','payment_failed',
                    'sent_to_gelato','fulfilled','canceled','cod_pending'));

alter table orders add column if not exists payment_method text not null default 'card'
  check (payment_method in ('card','cod'));
alter table orders add column if not exists customer_phone text;
