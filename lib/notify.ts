import { Resend } from "resend";
import type { OrderRow } from "./types";

export async function notifyOperatorOfPaidOrder(order: OrderRow): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OPERATOR_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.warn("RESEND_API_KEY or OPERATOR_NOTIFY_EMAIL not set — skipping order email");
    return;
  }

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const adminUrl = `${siteUrl}/admin/orders/${order.id}`;

  await resend.emails.send({
    // Placeholder sender — replace with a real address on a domain verified
    // in Resend (e.g. orders@velle.es) before this actually sends.
    from: "Velle Orders <orders@velle.es>",
    to,
    subject: `New paid order ${order.order_number}`,
    text: `A new order was paid.\n\nOrder: ${order.order_number}\nAmount: ${
      order.amount_total_cents ? (order.amount_total_cents / 100).toFixed(2) : "?"
    } ${order.currency?.toUpperCase() ?? ""}\n\nReview and send to Gelato: ${adminUrl}`,
  });
}
