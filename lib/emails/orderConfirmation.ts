import type { OrderRow } from "../types";
import { addressLines, emailLayout, esc, euros, firstName, H1, H2, LABEL, P, signOff, SITE, spanishDate, step } from "./shared";

// Customer order confirmation for the cuadro. Same design as the manual
// template in docs/emails/confirmacion-pedido.html: keep both in step.

export function buildOrderConfirmationEmail(
  order: OrderRow,
  item: { productName: string; variantLabel: string }
): { subject: string; html: string; text: string } {
  const name = firstName(order);
  const total = euros(order.amount_total_cents, order.currency);
  const date = spanishDate(order.paid_at);
  const address = addressLines(order);
  const itemLine = `${item.productName} — ${item.variantLabel}`;
  const greeting = name ? `¡Gracias, ${name}!` : "¡Gracias por tu pedido!";

  const subject = `¡Gracias por tu pedido! Tu pedido ${order.order_number} está confirmado`;

  const html = emailLayout(
    subject,
    `
  <tr><td style="padding:16px 32px 0;">
    <h1 style="${H1}">${esc(greeting)}</h1>
    <p style="margin:14px 0 0;font-size:16px;line-height:1.6;color:#201d1a;">Hemos recibido tu pedido y ya lo estamos preparando con mucho cariño. Aquí tienes el resumen.</p>
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
            <td style="padding:10px 0 0;border-top:1px solid #e4ddd2;font-weight:bold;">Total pagado</td>
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
  <tr><td style="padding:28px 32px 0;">
    <h2 style="${H2}">¿Y ahora qué?</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:1.55;color:#201d1a;">${step(
      1,
      "Preparamos y embalamos tu cuadro con cuidado."
    )}${step(2, "En cuanto salga de nuestro almacén te enviamos un email con el número de seguimiento.")}${step(
      3,
      "Lo recibes en casa, normalmente en 24–72 h."
    )}
    </table>
  </td></tr>
  <tr><td style="padding:24px 32px 0;">
    <p style="${P}"><strong>Compras con tranquilidad:</strong> si tu cuadro llega dañado, mándanos una foto respondiendo a este email y te enviamos otro sin coste. Además tienes 14 días desde la entrega para devolverlo. <a href="${SITE}/devoluciones" style="color:#c98b4f;">Ver garantía y devoluciones</a>.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 32px;">
    <p style="${P}">¿Tienes alguna pregunta o quieres cambiar algo del pedido? Responde a este email y te ayudamos encantados.</p>
    ${signOff()}
  </td></tr>`
  );

  const text = [
    greeting,
    "",
    "Hemos recibido tu pedido y ya lo estamos preparando con mucho cariño.",
    "",
    `Pedido ${order.order_number} · ${date}`,
    `${itemLine}: ${total}`,
    "Envío: Gratis",
    `Total pagado: ${total}`,
    ...(address.length ? ["", "Lo enviamos a:", ...address] : []),
    "",
    "¿Y ahora qué?",
    "1. Preparamos y embalamos tu cuadro con cuidado.",
    "2. En cuanto salga de nuestro almacén te enviamos un email con el número de seguimiento.",
    "3. Lo recibes en casa, normalmente en 24–72 h.",
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
