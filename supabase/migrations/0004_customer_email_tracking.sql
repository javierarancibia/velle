-- When each customer email went out for an order, shown as a check in
-- /admin/clients. Null = never sent. Run this in the Supabase SQL editor
-- after 0003. (Already applied to the live database on 16 Nov 2026.)

alter table orders
  add column if not exists confirmation_email_sent_at timestamptz,
  add column if not exists processing_email_sent_at   timestamptz,
  add column if not exists delivered_email_sent_at    timestamptz;
