import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  getOrderByStripeSessionId,
  hasProcessedWebhookEvent,
  markOrderPaid,
  recordWebhookEvent,
  setOrderPrintFileUrl,
} from "@/lib/db";
import { notifyOperatorOfPaidOrder } from "@/lib/notify";
import { renderStarMapPng } from "@/lib/starMap/render";
import { stripe } from "@/lib/stripe";
import { uploadPrintFile } from "@/lib/uploads";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (await hasProcessedWebhookEvent(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (!orderId) {
      console.error("checkout.session.completed with no order_id in metadata", session.id);
    } else {
      const order = await getOrderByStripeSessionId(session.id);
      if (!order) {
        console.error("No matching order for stripe session", session.id);
      } else {
        // Shipping details live under collected_information as of the
        // Stripe API version this project pins (moved here from a
        // top-level session.shipping_details in older versions) — confirm
        // this hasn't shifted again if upgrading the stripe package.
        const shippingDetails = session.collected_information?.shipping_details;
        const customerAddress = session.customer_details?.address;
        await markOrderPaid(order.id, {
          stripe_payment_intent_id:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
          customer_email: session.customer_details?.email ?? null,
          customer_name: session.customer_details?.name ?? null,
          shipping_address: shippingDetails
            ? {
                name: shippingDetails.name ?? null,
                line1: shippingDetails.address.line1,
                line2: shippingDetails.address.line2,
                city: shippingDetails.address.city,
                postal_code: shippingDetails.address.postal_code,
                country: shippingDetails.address.country,
              }
            : customerAddress
              ? {
                  name: session.customer_details?.name ?? null,
                  line1: customerAddress.line1,
                  line2: customerAddress.line2,
                  city: customerAddress.city,
                  postal_code: customerAddress.postal_code,
                  country: customerAddress.country,
                }
              : null,
          amount_total_cents: session.amount_total ?? null,
          currency: session.currency ?? null,
        });

        // Star map print files render automatically — no manual step needed.
        // Pet portraits are stylized + uploaded manually in the admin order
        // page before being sent to Gelato (see lib/gelato.ts).
        if (order.personalization.kind === "star-map") {
          try {
            const png = await renderStarMapPng(order.personalization, { width: 3000, height: 3750 });
            const url = await uploadPrintFile(`${order.order_number}.png`, png, "image/png");
            await setOrderPrintFileUrl(order.id, url);
          } catch (err) {
            console.error("Star map render/upload failed for order", order.order_number, err);
            // Non-fatal: the operator can re-trigger this manually later;
            // don't fail the webhook over a rendering problem.
          }
        }

        const updated = await getOrderByStripeSessionId(session.id);
        if (updated) {
          await notifyOperatorOfPaidOrder(updated).catch((err) =>
            console.error("Failed to send operator notification email", err)
          );
        }
      }
    }
  }

  await recordWebhookEvent(event.id, event.type);
  return NextResponse.json({ received: true });
}
