import { NextResponse } from "next/server";
import { attachStripeSession, createPendingOrder, getProductBySlug, getVariantById } from "@/lib/db";
import { SHIP_COUNTRIES, SHIP_COUNTRIES_CUADRO_JESUS, stripe } from "@/lib/stripe";
import { checkoutRequestSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { productSlug, variantId, personalization } = parsed.data;

  const product = await getProductBySlug(productSlug);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const variant = await getVariantById(variantId);
  if (!variant || variant.product_id !== product.id || !variant.active) {
    return NextResponse.json({ error: "Variant not found for this product" }, { status: 404 });
  }

  if (personalization.kind !== productSlug) {
    return NextResponse.json({ error: "Personalization does not match product" }, { status: 400 });
  }

  const order = await createPendingOrder({ productId: product.id, variantId: variant.id, personalization });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Prices are re-fetched from our own DB above (never trusted from the
  // client). Prefer a pre-created Stripe Price (variant.stripe_price_id,
  // set manually in the Stripe dashboard); fall back to inline price_data
  // so checkout still works before that manual setup step is done.
  const lineItem = variant.stripe_price_id
    ? { price: variant.stripe_price_id, quantity: 1 }
    : {
        price_data: {
          currency: variant.currency,
          unit_amount: variant.price_cents,
          product_data: { name: `${product.name} — ${variant.label}` },
        },
        quantity: 1,
      };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [lineItem],
    metadata: { order_id: order.id, order_number: order.order_number },
    success_url: `${siteUrl}/checkout/success?order=${order.order_number}`,
    cancel_url: `${siteUrl}/products/${productSlug}`,
    shipping_address_collection: {
      allowed_countries: productSlug === "cuadro-jesus" ? SHIP_COUNTRIES_CUADRO_JESUS : SHIP_COUNTRIES,
    },
    // The cuadro page is in Spanish; keep Stripe's own page in the same language.
    locale: productSlug === "cuadro-jesus" ? "es" : undefined,
    automatic_tax: { enabled: true },
    customer_email: undefined,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 502 });
  }

  await attachStripeSession(order.id, session.id);

  return NextResponse.json({ url: session.url });
}
