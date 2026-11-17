import Link from "next/link";
import CustomerEmailButton from "@/components/CustomerEmailButton";
import { CUSTOMER_EMAILS } from "@/lib/customerEmails";
import { whatsAppLink } from "@/lib/emails/codOrder";
import { listPaidOrders } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import type { OrderRow } from "@/lib/types";

// Every customer who has paid, one row per order, with the three customer
// emails (confirmation, in preparation, shipped) and when each went out.

export const dynamic = "force-dynamic";

export const metadata = { title: "Clientes", robots: { index: false, follow: false } };

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Madrid",
});

function address(order: OrderRow): { phone: string | null; place: string | null } {
  const a = (order.shipping_address ?? {}) as Record<string, string | null | undefined>;
  return {
    phone: a.phone ?? null,
    place: [a.line1, [a.postal_code, a.city].filter(Boolean).join(" ")].filter(Boolean).join(", ") || null,
  };
}

function matches(order: OrderRow, q: string): boolean {
  const a = order.shipping_address ? JSON.stringify(order.shipping_address) : "";
  return [order.customer_name, order.customer_email, order.order_number, a]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(q));
}

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; added?: string; sent?: string; send_error?: string }>;
}) {
  const { q: rawQuery, added, sent, send_error: sendError } = await searchParams;
  const q = rawQuery?.trim().toLowerCase() ?? "";
  const all = await listPaidOrders();
  const orders = q ? all.filter((o) => matches(o, q)) : all;

  const ordersPerEmail = new Map<string, number>();
  for (const o of all) {
    if (o.customer_email) {
      const key = o.customer_email.toLowerCase();
      ordersPerEmail.set(key, (ordersPerEmail.get(key) ?? 0) + 1);
    }
  }
  const pending = (column: keyof OrderRow) =>
    all.filter((o) => o.personalization.kind === "cuadro-jesus" && o.customer_email && !o[column]).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium">Clientes</h1>
          <p className="mt-1 text-sm text-muted">
            {all.length} pedidos pagados · {ordersPerEmail.size} clientes. Sin enviar:{" "}
            {CUSTOMER_EMAILS.map((e) => `${e.label.toLowerCase()} ${pending(e.column)}`).join(" · ")}
          </p>
        </div>
        <form className="flex gap-2" action="/admin/clients">
          <input
            type="search"
            name="q"
            defaultValue={rawQuery ?? ""}
            placeholder="Nombre, email, ciudad, pedido…"
            className="w-64 rounded-md border border-border bg-white px-3 py-1.5 text-sm"
          />
          <button type="submit" className="rounded-md border border-border px-3 py-1.5 text-sm">
            Buscar
          </button>
          <Link href="/admin/clients/new" className="rounded-md bg-accent px-3 py-1.5 text-sm text-white">
            + Añadir cliente
          </Link>
        </form>
      </div>

      {added ? (
        <p
          className={`mt-6 rounded-md border px-4 py-3 text-sm ${
            sendError ? "border-amber-300 bg-amber-50 text-amber-900" : "border-green-300 bg-green-50 text-green-900"
          }`}
        >
          Cliente añadido con el pedido <strong>{added}</strong>.
          {sent ? " Confirmación de compra enviada." : null}
          {sendError ? ` No se pudo enviar la confirmación: ${sendError}` : null}
        </p>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-border">
              <th className="py-2 pr-4 font-normal">Cliente</th>
              <th className="py-2 pr-4 font-normal">Dirección</th>
              <th className="py-2 pr-4 font-normal">Pedido</th>
              {CUSTOMER_EMAILS.map((e) => (
                <th key={e.kind} className="py-2 pr-4 font-normal">
                  {e.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const { phone, place } = address(o);
              const count = o.customer_email ? (ordersPerEmail.get(o.customer_email.toLowerCase()) ?? 0) : 0;
              return (
                <tr key={o.id} className="border-b border-border align-top">
                  <td className="py-3 pr-4">
                    <p className="font-medium">{o.customer_name ?? "—"}</p>
                    {o.customer_email ? (
                      <a href={`mailto:${o.customer_email}`} className="text-muted hover:text-foreground">
                        {o.customer_email}
                      </a>
                    ) : (
                      <p className="text-muted">Sin email</p>
                    )}
                    {phone ? <p className="text-muted">{phone}</p> : null}
                    {o.payment_method === "cod" ? (
                      <p className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900">
                          {o.status === "cod_pending" ? "Contrareembolso · por cobrar" : "Contrareembolso"}
                        </span>
                        {o.customer_phone ? (
                          <a href={whatsAppLink(o.customer_phone)} target="_blank" rel="noreferrer" className="text-[#128C7E] hover:underline">
                            WhatsApp
                          </a>
                        ) : null}
                      </p>
                    ) : null}
                    {count > 1 ? <p className="mt-1 text-xs text-accent">{count} pedidos</p> : null}
                    {!o.stripe_checkout_session_id && o.payment_method !== "cod" ? (
                      <p className="mt-1 text-xs text-muted">Añadido a mano</p>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 text-muted max-w-56">{place ?? "—"}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <Link href={`/admin/orders/${o.id}`} className="text-accent hover:underline">
                      {o.order_number}
                    </Link>
                    <p className="text-muted">{dateFormat.format(new Date(o.paid_at ?? o.created_at))}</p>
                    <p className="text-muted">
                      {o.amount_total_cents ? formatPrice(o.amount_total_cents, o.currency ?? "eur") : "—"} · {o.status}
                    </p>
                  </td>
                  {CUSTOMER_EMAILS.map((e) => (
                    <td key={e.kind} className="py-3 pr-4">
                      <CustomerEmailButton order={o} kind={e.kind} />
                    </td>
                  ))}
                </tr>
              );
            })}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={3 + CUSTOMER_EMAILS.length} className="py-8 text-center text-muted">
                  {q ? "Ningún cliente coincide con la búsqueda." : "Todavía no hay pedidos pagados."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
