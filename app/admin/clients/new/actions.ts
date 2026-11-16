"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createManualPaidOrder, getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";
import { sendCustomerEmail } from "@/lib/notify";

// Behind the /admin password (middleware.ts), including this action's POST.

export type NewClientState = { error: string | null; values: Record<string, string> };

const schema = z.object({
  name: z.string().trim().min(1, "Falta el nombre"),
  email: z.string().trim().toLowerCase().pipe(z.email("Email no válido")),
  phone: z.string().trim(),
  line1: z.string().trim(),
  line2: z.string().trim(),
  postal_code: z.string().trim(),
  city: z.string().trim(),
  country: z.string().trim().toUpperCase(),
  variant_id: z.string().min(1, "Elige el pack"),
  amount: z.string().trim(),
  paid_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida"),
});

export async function createClient(_prev: NewClientState, formData: FormData): Promise<NewClientState> {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, String(v)])
  );
  const fail = (error: string): NewClientState => ({ error, values });

  const parsed = schema.safeParse(values);
  if (!parsed.success) return fail(parsed.error.issues[0].message);
  const f = parsed.data;

  const product = await getProductBySlug("cuadro-jesus");
  if (!product) return fail("No se encuentra el producto del cuadro");
  const variant = (await getActiveVariantsByProduct(product.id)).find((v) => v.id === f.variant_id);
  if (!variant) return fail("Pack no válido");

  let amountCents = variant.price_cents;
  if (f.amount) {
    const euros = Number(f.amount.replace(/\s|€/g, "").replace(",", "."));
    if (!Number.isFinite(euros) || euros < 0) return fail("Importe no válido (ej. 44,90)");
    amountCents = Math.round(euros * 100);
  }

  // Midday in Spain, so the date reads the same in every timezone.
  const paidAt = new Date(`${f.paid_on}T12:00:00+01:00`);
  if (paidAt.getTime() > Date.now() + 24 * 3600 * 1000) return fail("La fecha de compra está en el futuro");

  const hasAddress = f.line1 || f.city || f.postal_code;
  const order = await createManualPaidOrder({
    productId: product.id,
    variantId: variant.id,
    personalization: { kind: "cuadro-jesus" },
    customerName: f.name,
    customerEmail: f.email,
    shippingAddress: hasAddress
      ? {
          name: f.name,
          line1: f.line1 || null,
          line2: f.line2 || null,
          city: f.city || null,
          postal_code: f.postal_code || null,
          country: f.country || "ES",
          phone: f.phone || null,
        }
      : f.phone
        ? { name: f.name, phone: f.phone }
        : null,
    amountTotalCents: amountCents,
    paidAt,
  });

  let note = "";
  if (formData.get("send_confirmation") === "on") {
    try {
      await sendCustomerEmail(order, "confirmation");
      note = "&sent=1";
    } catch (err) {
      note = `&send_error=${encodeURIComponent(err instanceof Error ? err.message : "Error desconocido")}`;
    }
  }
  redirect(`/admin/clients?added=${encodeURIComponent(order.order_number)}${note}`);
}
