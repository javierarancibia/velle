-- The third customer email became "your order has left the warehouse and is
-- on its way" instead of "delivered". Run this in the Supabase SQL editor
-- after 0004.

alter table orders rename column delivered_email_sent_at to shipped_email_sent_at;
