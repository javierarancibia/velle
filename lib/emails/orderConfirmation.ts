import type { OrderRow } from "../types";

// Customer order confirmation for the cuadro. Same design as the manual
// template in docs/emails/confirmacion-pedido.html: keep both in step.
// Email clients ignore <style> blocks and CSS variables, so every style is
// inline and the layout is tables.

const SITE = "https://velle.es";

const COUNTRY_NAMES: Record<string, string> = { ES: "España", PT: "Portugal" };

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function euros(cents: number | null, currency: string | null): string {
  if (cents === null) return "";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: (currency ?? "eur").toUpperCase() }).format(
    cents / 100
  );
}

function spanishDate(iso: string | null): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(
    iso ? new Date(iso) : new Date()
  );
}

function addressLines(order: OrderRow): string[] {
  const a = (order.shipping_address ?? {}) as Record<string, string | null | undefined>;
  const country = a.country ? (COUNTRY_NAMES[a.country] ?? a.country) : null;
  return [
    a.name ?? order.customer_name,
    a.line1,
    a.line2,
    [a.postal_code, a.city].filter(Boolean).join(" "),
    country,
  ].filter((line): line is string => Boolean(line && line.trim()));
}

function firstName(order: OrderRow): string | null {
  const full = order.customer_name ?? (order.shipping_address as { name?: string } | null)?.name ?? null;
  return full?.trim().split(/\s+/)[0] || null;
}

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

  const p = "margin:0;font-size:15px;line-height:1.6;color:#201d1a;";
  const label = "margin:0 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#7a746b;";
  const step = (n: number, text: string) => `
      <tr>
        <td valign="top" width="30" style="padding:4px 0;color:#c98b4f;font-weight:bold;">${n}</td>
        <td style="padding:4px 0;">${text}</td>
      </tr>`;

  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#faf7f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid #e4ddd2;border-radius:12px;font-family:Helvetica,Arial,sans-serif;color:#201d1a;">
  <tr><td align="center" style="padding:28px 24px 8px;">
    <a href="${SITE}" style="text-decoration:none;"><img src="${SITE}/logo.png" alt="Velle" width="110" style="display:block;width:110px;height:auto;border:0;"></a>
  </td></tr>
  <tr><td style="padding:16px 32px 0;">
    <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;line-height:1.3;color:#201d1a;">${esc(greeting)}</h1>
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
    <p style="${label}">Lo enviamos a</p>
    <p style="${p}">${address.map(esc).join("<br>")}</p>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:28px 32px 0;">
    <h2 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:normal;color:#201d1a;">¿Y ahora qué?</h2>
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
    <p style="${p}"><strong>Compras con tranquilidad:</strong> si tu cuadro llega dañado, mándanos una foto respondiendo a este email y te enviamos otro sin coste. Además tienes 14 días desde la entrega para devolverlo. <a href="${SITE}/devoluciones" style="color:#c98b4f;">Ver garantía y devoluciones</a>.</p>
  </td></tr>
  <tr><td style="padding:24px 32px 32px;">
    <p style="${p}">¿Tienes alguna pregunta o quieres cambiar algo del pedido? Responde a este email y te ayudamos encantados.</p>
    <p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#201d1a;">Un abrazo,<br><span style="font-family:Georgia,'Times New Roman',serif;font-size:17px;">El equipo de Velle</span></p>
  </td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:Helvetica,Arial,sans-serif;">
  <tr><td align="center" style="padding:18px 24px;font-size:12px;line-height:1.6;color:#7a746b;">
    <a href="${SITE}" style="color:#7a746b;">velle.es</a> · <a href="mailto:info@velle.es" style="color:#7a746b;">info@velle.es</a>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

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
