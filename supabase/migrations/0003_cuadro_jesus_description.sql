-- The cuadro is not hand-painted: drop "pintado a mano" from the stored
-- product description. Run this in the Supabase SQL editor after 0002.
-- (Already applied to the live database on 12 Nov 2026.)

update products
set description = 'Un cuadro con marco de madera que se ilumina con una luz cálida y regulable. "Siempre estaré contigo" — Salmo 73:23.'
where slug = 'cuadro-jesus';
