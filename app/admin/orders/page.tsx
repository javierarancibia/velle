import Link from "next/link";
import { listOrders } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: (OrderStatus | "all")[] = [
  "paid",
  "sent_to_gelato",
  "fulfilled",
  "pending_payment",
  "payment_failed",
  "canceled",
  "all",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const status = (statusParam as OrderStatus | undefined) ?? "paid";
  const orders = await listOrders(status === ("all" as never) ? undefined : status);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-medium">Orders</h1>

      <div className="mt-4 flex gap-2 flex-wrap text-sm">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1 rounded-full border ${
              status === s ? "border-accent text-accent" : "border-border text-muted"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      <table className="mt-8 w-full text-sm">
        <thead>
          <tr className="text-left text-muted border-b border-border">
            <th className="py-2 pr-4">Order</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Customer</th>
            <th className="py-2 pr-4">Amount</th>
            <th className="py-2 pr-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border">
              <td className="py-2 pr-4">
                <Link href={`/admin/orders/${o.id}`} className="text-accent hover:underline">
                  {o.order_number}
                </Link>
              </td>
              <td className="py-2 pr-4">{o.status}</td>
              <td className="py-2 pr-4">{o.customer_email ?? "—"}</td>
              <td className="py-2 pr-4">
                {o.amount_total_cents ? formatPrice(o.amount_total_cents, o.currency ?? "eur") : "—"}
              </td>
              <td className="py-2 pr-4">{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {orders.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-muted">
                No orders with this status.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
