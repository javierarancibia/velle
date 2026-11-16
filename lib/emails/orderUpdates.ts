import type { OrderRow } from "../types";
import { addressLines, emailLayout, esc, firstName, H1, H2, LABEL, P, signOff, SITE, step } from "./shared";

// The two follow-up emails the operator sends by hand from /admin/clients:
// "we're preparing your order" and "your order has left our warehouse and is
// on its way". Same design
// as the confirmation (lib/emails/orderConfirmation.ts).

type Email = { subject: string; html: string; text: string };

export function buildOrderProcessingEmail(order: OrderRow): Email {
  const name = firstName(order);
  const address = addressLines(order);
  const heading = name ? `${name}, ya estamos preparando tu pedido` : "Ya estamos preparando tu pedido";
  const subject = `Estamos preparando tu pedido ${order.order_number}`;

  const html = emailLayout(
    subject,
    `
  <tr><td style="padding:16px 32px 0;">
    <h1 style="${H1}">${esc(heading)}</h1>
    <p style="margin:14px 0 0;font-size:16px;line-height:1.6;color:#201d1a;">Queríamos contarte que ya estamos trabajando en tu pedido <strong>${esc(order.order_number)}</strong>. Estamos revisando tu cuadro y embalándolo con mucho cuidado para que llegue perfecto a tu casa.</p>
  </td></tr>
  <tr><td style="padding:28px 32px 0;">
    <h2 style="${H2}">Cómo va tu pedido</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:1.55;color:#201d1a;">${step(
      1,
      "Pedido confirmado y pagado. ✓"
    )}${step(2, "<strong>Ahora:</strong> preparamos y embalamos tu cuadro.")}${step(
      3,
      "Sale de nuestro almacén y lo recibes en casa, normalmente en 24–72 h."
    )}
    </table>
  </td></tr>${
    address.length
      ? `
  <tr><td style="padding:24px 32px 0;">
    <p style="${LABEL}">Lo enviamos a</p>
    <p style="${P}">${address.map(esc).join("<br>")}</p>
    <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#7a746b;">¿Hay que cambiar algo de la dirección? Responde a este email cuanto antes y lo corregimos.</p>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:24px 32px 32px;">
    <p style="${P}">¿Tienes alguna pregunta? Responde a este email y te ayudamos encantados.</p>
    ${signOff()}
  </td></tr>`
  );

  const text = [
    heading,
    "",
    `Queríamos contarte que ya estamos trabajando en tu pedido ${order.order_number}. Estamos revisando tu cuadro y embalándolo con mucho cuidado para que llegue perfecto a tu casa.`,
    "",
    "Cómo va tu pedido:",
    "1. Pedido confirmado y pagado. ✓",
    "2. Ahora: preparamos y embalamos tu cuadro.",
    "3. Sale de nuestro almacén y lo recibes en casa, normalmente en 24–72 h.",
    ...(address.length
      ? ["", "Lo enviamos a:", ...address, "", "¿Hay que cambiar algo de la dirección? Responde a este email cuanto antes y lo corregimos."]
      : []),
    "",
    "¿Tienes alguna pregunta? Responde a este email y te ayudamos encantados.",
    "",
    "Un abrazo,",
    "El equipo de Velle",
    "",
    "velle.es · info@velle.es",
  ].join("\n");

  return { subject, html, text };
}

export function buildOrderShippedEmail(order: OrderRow): Email {
  const name = firstName(order);
  const address = addressLines(order);
  const heading = name ? `¡Tu cuadro ya está en camino, ${name}!` : "¡Tu cuadro ya está en camino!";
  const subject = `Tu pedido ${order.order_number} ya está en camino`;

  const html = emailLayout(
    subject,
    `
  <tr><td style="padding:16px 32px 0;">
    <h1 style="${H1}">${esc(heading)}</h1>
    <p style="margin:14px 0 0;font-size:16px;line-height:1.6;color:#201d1a;">Tu pedido <strong>${esc(order.order_number)}</strong> ha salido de nuestro almacén y ya va de camino a tu casa. Normalmente llega en 24–72 h.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 0;">
    <img src="${SITE}/products/jesus-frame/email-hero.jpg" alt="La luz que da paz a tu hogar. La Luz de Cristo" width="496" style="display:block;width:100%;max-width:496px;height:auto;border:0;border-radius:8px;">
  </td></tr>
  <tr><td style="padding:28px 32px 0;">
    <h2 style="${H2}">Cómo va tu pedido</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:15px;line-height:1.55;color:#201d1a;">${step(
      1,
      "Pedido confirmado y pagado. ✓"
    )}${step(2, "Cuadro preparado y embalado con cuidado. ✓")}${step(
      3,
      "<strong>Ahora:</strong> en camino a tu casa. Llega normalmente en 24–72 h."
    )}
    </table>
  </td></tr>${
    address.length
      ? `
  <tr><td style="padding:24px 32px 0;">
    <p style="${LABEL}">Lo enviamos a</p>
    <p style="${P}">${address.map(esc).join("<br>")}</p>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:24px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;border:1px solid #e4ddd2;border-radius:8px;">
      <tr><td style="padding:18px 20px;">
        <p style="${LABEL}">Cuando lo recibas</p>
        <p style="${P}">Si llega dañado, mándanos una foto respondiendo a este email y te enviamos otro sin coste. Además tienes 14 días desde la entrega para devolverlo. <a href="${SITE}/devoluciones" style="color:#c98b4f;">Ver garantía y devoluciones</a>.</p>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:24px 32px 32px;">
    <p style="${P}">¿Tienes alguna pregunta sobre el envío? Responde a este email y te ayudamos encantados.</p>
    ${signOff()}
  </td></tr>`
  );

  const text = [
    heading,
    "",
    `Tu pedido ${order.order_number} ha salido de nuestro almacén y ya va de camino a tu casa. Normalmente llega en 24–72 h.`,
    "",
    "Cómo va tu pedido:",
    "1. Pedido confirmado y pagado. ✓",
    "2. Cuadro preparado y embalado con cuidado. ✓",
    "3. Ahora: en camino a tu casa. Llega normalmente en 24–72 h.",
    ...(address.length ? ["", "Lo enviamos a:", ...address] : []),
    "",
    "Cuando lo recibas: si llega dañado, mándanos una foto respondiendo a este email y te enviamos otro sin coste. Tienes 14 días desde la entrega para devolverlo: " +
      `${SITE}/devoluciones`,
    "",
    "¿Tienes alguna pregunta sobre el envío? Responde a este email y te ayudamos encantados.",
    "",
    "Un abrazo,",
    "El equipo de Velle",
    "",
    "velle.es · info@velle.es",
  ].join("\n");

  return { subject, html, text };
}
