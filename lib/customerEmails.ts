import type { CustomerEmailKind, OrderRow } from "./types";

// Shared by the server (lib/notify.ts) and the admin buttons, so no server
// imports here.

export const CUSTOMER_EMAILS: { kind: CustomerEmailKind; label: string; column: keyof OrderRow }[] = [
  { kind: "confirmation", label: "Confirmación de compra", column: "confirmation_email_sent_at" },
  { kind: "processing", label: "Pedido en preparación", column: "processing_email_sent_at" },
  { kind: "shipped", label: "Pedido enviado", column: "shipped_email_sent_at" },
];

export function isCustomerEmailKind(value: unknown): value is CustomerEmailKind {
  return CUSTOMER_EMAILS.some((e) => e.kind === value);
}

// Why an order can't get customer emails, or null if it can. Only the cuadro
// has customer emails so far (Spanish, cuadro photo).
export function customerEmailBlocker(order: OrderRow): string | null {
  if (order.personalization.kind !== "cuadro-jesus") return "Solo hay emails para el cuadro";
  if (!order.paid_at) return "El pedido no está pagado";
  if (!order.customer_email) return "El pedido no tiene email";
  return null;
}
