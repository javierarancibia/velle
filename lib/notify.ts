import { Resend } from "resend";
import { customerEmailBlocker } from "./customerEmails";
import { getProductById, getVariantById, markCustomerEmailSent } from "./db";
import { buildCodOrderEmail, codConfirmationWhatsAppText, displayPhone, whatsAppLink } from "./emails/codOrder";
import { addressLines, euros } from "./emails/shared";
import { buildOrderConfirmationEmail } from "./emails/orderConfirmation";
import { buildOrderShippedEmail, buildOrderProcessingEmail } from "./emails/orderUpdates";
import type { CustomerEmailKind, OrderRow } from "./types";

// Both senders need velle.es verified in Resend (Domains). Replies go to the
// Zoho inbox at info@velle.es.
const FROM = process.env.ORDER_EMAIL_FROM ?? "Velle <info@velle.es>";
const REPLY_TO = "info@velle.es";

function resendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return null;
  }
  return new Resend(apiKey);
}

export async function notifyOperatorOfPaidOrder(order: OrderRow): Promise<void> {
  const resend = resendClient();
  const to = process.env.OPERATOR_NOTIFY_EMAIL;
  if (!resend || !to) {
    console.warn("OPERATOR_NOTIFY_EMAIL not set — skipping operator email");
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const adminUrl = `${siteUrl}/admin/orders/${order.id}`;

  const { error } = await resend.emails.send(
    {
      from: FROM,
      to,
      subject: `Nuevo pedido pagado ${order.order_number}`,
      text: `Se ha pagado un pedido nuevo.\n\nPedido: ${order.order_number}\nImporte: ${
        order.amount_total_cents ? (order.amount_total_cents / 100).toFixed(2).replace(".", ",") : "?"
      } ${order.currency?.toUpperCase() ?? ""}\n\nVer el pedido: ${adminUrl}`,
    },
    { idempotencyKey: `operator-paid/${order.id}` }
  );
  if (error) throw new Error(`Resend: ${error.message}`);
}

// New cash-on-delivery order: everything needed to confirm it on WhatsApp
// and enter it on the warehouse page, plus a one-tap link that opens a chat
// with the customer with the confirmation message already written.
export async function notifyOperatorOfCodOrder(order: OrderRow, variantLabel: string): Promise<void> {
  const resend = resendClient();
  const to = process.env.OPERATOR_NOTIFY_EMAIL;
  if (!resend || !to) {
    console.warn("OPERATOR_NOTIFY_EMAIL not set — skipping operator email");
    return;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const wa = order.customer_phone ? whatsAppLink(order.customer_phone, codConfirmationWhatsAppText(order, variantLabel)) : null;
  const total = euros(order.amount_total_cents, order.currency);

  const { error } = await resend.emails.send(
    {
      from: FROM,
      to,
      subject: `🚚 Contrareembolso ${order.order_number}: ${variantLabel}, ${total}`,
      text: [
        "Nuevo pedido con pago al recibir. Confírmalo por WhatsApp y pásalo al almacén.",
        "",
        wa ? `Escribir al cliente por WhatsApp (mensaje ya escrito):\n${wa}` : "Sin teléfono.",
        "",
        `Pedido: ${order.order_number}`,
        `Pack: ${variantLabel}`,
        `A cobrar al entregar: ${total}`,
        `Teléfono: ${displayPhone(order.customer_phone)}`,
        `Email: ${order.customer_email ?? "—"}`,
        "",
        "Dirección:",
        ...addressLines(order),
        "",
        `Ver en el admin: ${siteUrl}/admin/orders/${order.id}`,
      ].join("\n"),
    },
    { idempotencyKey: `operator-cod/${order.id}` }
  );
  if (error) throw new Error(`Resend: ${error.message}`);
}

// For /admin/test-email: the real customer template, filled with a sample
// order, so deliverability can be checked per inbox (Hotmail, Gmail…).
export async function sendTestOrderConfirmation(to: string): Promise<string> {
  const resend = resendClient();
  if (!resend) throw new Error("RESEND_API_KEY no está configurada");

  const sample = {
    order_number: "VEL-PRUEBA",
    customer_name: "Prueba",
    customer_email: to,
    shipping_address: { name: "Nombre de prueba", line1: "Calle Mayor 1", city: "Madrid", postal_code: "28013", country: "ES" },
    amount_total_cents: 4490,
    currency: "eur",
    paid_at: new Date().toISOString(),
  } as Partial<OrderRow> as OrderRow; // the template only reads these fields
  const { subject, html, text } = buildOrderConfirmationEmail(sample, {
    productName: "Cuadro 'La Luz de Jesús'",
    variantLabel: "1 cuadro",
  });

  const { data, error } = await resend.emails.send({
    from: FROM,
    to,
    replyTo: REPLY_TO,
    subject: `[PRUEBA] ${subject}`,
    html,
    text,
  });
  if (error) throw new Error(error.message);
  return data?.id ?? "";
}

async function buildCustomerEmail(order: OrderRow, kind: CustomerEmailKind) {
  if (kind === "processing") return buildOrderProcessingEmail(order);
  if (kind === "shipped") return buildOrderShippedEmail(order);
  const [product, variant] = await Promise.all([getProductById(order.product_id), getVariantById(order.variant_id)]);
  const item = {
    productName: product?.name ?? "Cuadro 'La Luz de Jesús'",
    variantLabel: variant?.label ?? "1 cuadro",
  };
  return order.payment_method === "cod" ? buildCodOrderEmail(order, item) : buildOrderConfirmationEmail(order, item);
}

// Sends one of the customer emails and records when it went out, which is
// the check shown in /admin/clients. Throws with a reason the admin can read.
export async function sendCustomerEmail(
  order: OrderRow,
  kind: CustomerEmailKind,
  options?: { idempotencyKey?: string }
): Promise<{ sentAt: string | null }> {
  const blocker = customerEmailBlocker(order);
  if (blocker) throw new Error(blocker);
  const resend = resendClient();
  if (!resend) throw new Error("RESEND_API_KEY no está configurada");

  const { subject, html, text } = await buildCustomerEmail(order, kind);
  const { error } = await resend.emails.send(
    { from: FROM, to: order.customer_email!, replyTo: REPLY_TO, subject, html, text },
    options?.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined
  );
  if (error) throw new Error(`Resend: ${error.message}`);

  // The email is out at this point; a failed stamp must not read as a failed
  // send (it happens if migration 0004 hasn't been run).
  try {
    return { sentAt: await markCustomerEmailSent(order.id, kind) };
  } catch (err) {
    console.error(`Sent ${kind} email for ${order.order_number} but could not record it`, err);
    return { sentAt: null };
  }
}

// Sent automatically once per order from the Stripe webhook: the idempotency
// key stops a duplicate if Stripe retries the webhook within 24 h.
export async function sendOrderConfirmationToCustomer(order: OrderRow): Promise<void> {
  const blocker = customerEmailBlocker(order);
  if (blocker) {
    if (order.personalization.kind === "cuadro-jesus") {
      console.warn(`Skipping confirmation for ${order.order_number}: ${blocker}`);
    }
    return;
  }
  if (!resendClient()) return;
  await sendCustomerEmail(order, "confirmation", { idempotencyKey: `order-confirmation/${order.id}` });
}
