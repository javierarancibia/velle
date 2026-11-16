import type { OrderRow } from "../types";

// Helpers and the outer layout shared by every customer email (confirmation,
// processing, shipped). Email clients ignore <style> blocks and CSS
// variables, so every style is inline and the layout is tables.

export const SITE = "https://velle.es";

const COUNTRY_NAMES: Record<string, string> = { ES: "España", PT: "Portugal" };

export const P = "margin:0;font-size:15px;line-height:1.6;color:#201d1a;";
export const LABEL = "margin:0 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#7a746b;";
export const H1 =
  "margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:normal;line-height:1.3;color:#201d1a;";
export const H2 =
  "margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:normal;color:#201d1a;";

export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function euros(cents: number | null, currency: string | null): string {
  if (cents === null) return "";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: (currency ?? "eur").toUpperCase() }).format(
    cents / 100
  );
}

export function spanishDate(iso: string | null): string {
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(
    iso ? new Date(iso) : new Date()
  );
}

export function addressLines(order: OrderRow): string[] {
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

export function firstName(order: OrderRow): string | null {
  const full = order.customer_name ?? (order.shipping_address as { name?: string } | null)?.name ?? null;
  return full?.trim().split(/\s+/)[0] || null;
}

export function step(n: number, text: string): string {
  return `
      <tr>
        <td valign="top" width="30" style="padding:4px 0;color:#c98b4f;font-weight:bold;">${n}</td>
        <td style="padding:4px 0;">${text}</td>
      </tr>`;
}

export function signOff(): string {
  return `<p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#201d1a;">Un abrazo,<br><span style="font-family:Georgia,'Times New Roman',serif;font-size:17px;">El equipo de Velle</span></p>`;
}

// Logo on top, the email's own <tr> rows in the white card, then the footer.
export function emailLayout(subject: string, rows: string): string {
  return `<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#faf7f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border:1px solid #e4ddd2;border-radius:12px;font-family:Helvetica,Arial,sans-serif;color:#201d1a;">
  <tr><td align="center" style="padding:28px 24px 8px;">
    <a href="${SITE}" style="text-decoration:none;"><img src="${SITE}/logo.png" alt="Velle" width="110" style="display:block;width:110px;height:auto;border:0;"></a>
  </td></tr>${rows}
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
}
