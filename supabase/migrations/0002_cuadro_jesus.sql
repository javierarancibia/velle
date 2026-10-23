-- Cuadro 'La Luz de Jesús' — Spanish-market lit frame (not a Gelato print).
-- Run this in the Supabase SQL editor after 0001_init.sql.
--
-- One size (17,5 x 23,5 cm), sold as 1 / 2 / 3-frame packs. The leading
-- number of each label is the quantity -- components/CuadroJesusProductClient.tsx
-- parses it, and shows N x the single price as the struck-through "before"
-- price on the 2- and 3-packs.

insert into products (slug, name, description) values
  ('cuadro-jesus', 'Cuadro ''La Luz de Jesús''',
   'Un cuadro pintado a mano que se ilumina con una luz cálida y regulable. "Siempre estaré contigo" — Salmo 73:23.');

insert into product_variants (product_id, label, price_cents, currency)
select id, v.label, v.price_cents, 'eur'
from products,
  (values
    ('1 cuadro', 4490),
    ('2 cuadros', 7990),  -- "Más popular": 9,90 € off 2 x 44,90
    ('3 cuadros', 8980)   -- "Paga 2 y recibe 3": exactly 2 x 44,90
  ) as v(label, price_cents)
where slug = 'cuadro-jesus';
