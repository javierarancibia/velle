import { NextResponse } from "next/server";
import { createCodOrder, getProductBySlug, getVariantById } from "@/lib/db";
import { notifyOperatorOfCodOrder, sendCustomerEmail } from "@/lib/notify";
import { codOrderRequestSchema, normalizeSpanishPhone } from "@/lib/validation";

// Cash on delivery (contrareembolso) for the cuadro, Spain only. No payment
// here: the order is saved as 'cod_pending', the customer gets the
// "pago al recibir" email and the operator gets a WhatsApp link to confirm.
export async function POST(req: Request) {
  const parsed = codOrderRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const input = parsed.data;
  // Honeypot filled: pretend it worked so the bot moves on.
  if (input.website) return NextResponse.json({ orderNumber: null });

  const product = await getProductBySlug("cuadro-jesus");
  const variant = await getVariantById(input.variantId);
  if (!product || !variant || variant.product_id !== product.id || !variant.active) {
    return NextResponse.json({ error: "Variant not found" }, { status: 404 });
  }

  const phone = normalizeSpanishPhone(input.phone)!;
  const order = await createCodOrder({
    productId: product.id,
    variantId: variant.id,
    customerName: input.name,
    customerEmail: input.email.toLowerCase(),
    customerPhone: phone,
    // Same shape Stripe gives card orders, so the admin and emails read both.
    shippingAddress: {
      name: input.name,
      line1: input.line1,
      line2: input.line2 || null,
      postal_code: input.postalCode,
      city: input.city,
      state: input.province || null,
      country: "ES",
      phone,
    },
    amountTotalCents: variant.price_cents,
    currency: variant.currency,
    upgradedInForm: input.upgraded === true,
  });

  // The order is saved either way; a failed email must not lose the sale.
  await Promise.all([
    sendCustomerEmail(order, "confirmation", { idempotencyKey: `order-confirmation/${order.id}` }).catch((err) =>
      console.error(`COD confirmation email failed for ${order.order_number}`, err)
    ),
    notifyOperatorOfCodOrder(order, variant.label).catch((err) =>
      console.error(`COD operator email failed for ${order.order_number}`, err)
    ),
  ]);

  return NextResponse.json({ orderNumber: order.order_number });
}
