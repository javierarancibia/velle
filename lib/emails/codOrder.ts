import type { OrderRow } from "../types";
import { addressLines, emailLayout, esc, euros, firstName, H1, LABEL, P, signOff, SITE, spanishDate } from "./shared";

// "+34612345678" -> "612 345 678", for customers to recognise their number.
export function displayPhone(phone: string | null): string {
  const local = (phone ?? "").replace(/^\+34/, "");
  return /^\d{9}$/.test(local) ? local.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : (phone ?? "");
}

// Customer email for a cash-on-delivery order. Wording approved by the
// owner on 17 Nov 2026: we confirm by WhatsApp, then ship; they pay the
// courier on delivery.
export function buildCodOrderEmail(
  order: OrderRow,
  item: { productName: string; variantLabel: string }
): { subject: string; html: string; text: string } {
  const name = firstName(order);
  const total = euros(order.amount_total_cents, order.currency);
  const date = spanishDate(order.created_at);
  const address = addressLines(order);
  const phone = displayPhone(order.customer_phone);
  const itemLine = `${item.productName} — ${item.variantLabel}`;
  const greeting = name ? `Hola ${name}, ¡gracias por tu pedido!` : "¡Gracias por tu pedido!";

  const subject = `Tu pedido ${order.order_number} — pago al recibir`;

  const html = emailLayout(
    subject,
    `
  <tr><td style="padding:16px 32px 0;">
    <h1 style="${H1}">${esc(greeting)}</h1>
    <p style="margin:14px 0 0;font-size:16px;line-height:1.6;color:#201d1a;">En las próximas horas te escribiremos por WhatsApp al <strong>${esc(phone)}</strong> para confirmarlo. Cuando lo confirmes, lo enviamos y te llega en 24–72 h.</p>
    <p style="margin:12px 0 0;font-size:16px;line-height:1.6;color:#201d1a;">Pagarás <strong>${esc(total)}</strong> al repartidor cuando lo recibas.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 0;">
    <img src="${SITE}/products/jesus-frame/email-hero.jpg" alt="La luz que da paz a tu hogar. La Luz de Cristo" width="496" style="display:block;width:100%;max-width:496px;height:auto;border:0;border-radius:8px;">
  </td></tr>
  <tr><td style="padding:24px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;border:1px solid #e4ddd2;border-radius:8px;">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0 0 12px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#7a746b;">Pedido ${esc(order.order_number)} · ${esc(date)}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:1.5;color:#201d1a;">
          <tr>
            <td style="padding:6px 0;">${esc(itemLine)}</td>
            <td align="right" style="padding:6px 0;white-space:nowrap;">${esc(total)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#7a746b;">Envío</td>
            <td align="right" style="padding:6px 0;color:#7a746b;white-space:nowrap;">Gratis</td>
          </tr>
          <tr>
            <td style="padding:10px 0 0;border-top:1px solid #e4ddd2;font-weight:bold;">A pagar al recibir</td>
            <td align="right" style="padding:10px 0 0;border-top:1px solid #e4ddd2;font-weight:bold;white-space:nowrap;">${esc(total)}</td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>${
    address.length
      ? `
  <tr><td style="padding:20px 32px 0;">
    <p style="${LABEL}">Lo enviamos a</p>
    <p style="${P}">${address.map(esc).join("<br>")}</p>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:24px 32px 0;">
    <p style="${P}"><strong>Compras con tranquilidad:</strong> si tu cuadro llega dañado, mándanos una foto respondiendo a este email y te enviamos otro sin coste. Además tienes 14 días desde la entrega para devolverlo. <a href="${SITE}/devoluciones" style="color:#c98b4f;">Ver garantía y devoluciones</a>.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 32px;">
    <p style="${P}">¿Tienes alguna pregunta o quieres cambiar algo del pedido? Responde a este email o a nuestro WhatsApp y te ayudamos encantados.</p>
    ${signOff()}
  </td></tr>`
  );

  const text = [
    greeting,
    "",
    `En las próximas horas te escribiremos por WhatsApp al ${phone} para confirmarlo. Cuando lo confirmes, lo enviamos y te llega en 24–72 h.`,
    `Pagarás ${total} al repartidor cuando lo recibas.`,
    "",
    `Pedido ${order.order_number} · ${date}`,
    `${itemLine}: ${total}`,
    "Envío: Gratis",
    `A pagar al recibir: ${total}`,
    ...(address.length ? ["", "Lo enviamos a:", ...address] : []),
    "",
    "Si tu cuadro llega dañado, mándanos una foto respondiendo a este email y te enviamos otro sin coste. Tienes 14 días desde la entrega para devolverlo: " +
      `${SITE}/devoluciones`,
    "",
    "¿Alguna pregunta? Responde a este email y te ayudamos encantados.",
    "",
    "Un abrazo,",
    "El equipo de Velle",
    "",
    "velle.es · info@velle.es",
  ].join("\n");

  return { subject, html, text };
}

// What Velle sends the customer on WhatsApp to confirm (prefilled in the
// operator email's wa.me link).
export function codConfirmationWhatsAppText(order: OrderRow, variantLabel: string): string {
  const name = firstName(order);
  const total = euros(order.amount_total_cents, order.currency);
  const address = addressLines(order).slice(1, 3).join(", ");
  return [
    `¡Hola${name ? ` ${name}` : ""}! Te escribimos de Velle 😊`,
    `Hemos recibido tu pedido ${order.order_number}: ${variantLabel} de "La Luz de Jesús", ${total} a pagar al recibir.`,
    `Lo enviamos a: ${address}.`,
    "¿Nos confirmas que está todo bien para enviarlo?",
  ].join("\n");
}

// wa.me link: digits only, with country code.
export function whatsAppLink(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
