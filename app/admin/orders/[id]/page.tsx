import { notFound } from "next/navigation";
import AdminOrderActions from "@/components/AdminOrderActions";
import { getOrderById } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-medium">{order.order_number}</h1>
      <p className="mt-1 text-muted">Status: {order.status}</p>

      <div className="mt-8 grid sm:grid-cols-2 gap-8 text-sm">
        <div>
          <h2 className="font-medium mb-2">Customer</h2>
          <p>{order.customer_name ?? "—"}</p>
          <p>{order.customer_email ?? "—"}</p>
          <p className="mt-2 whitespace-pre-line text-muted">
            {order.shipping_address ? JSON.stringify(order.shipping_address, null, 2) : "No shipping address yet"}
          </p>
        </div>

        <div>
          <h2 className="font-medium mb-2">Order</h2>
          <p>
            {order.amount_total_cents ? formatPrice(order.amount_total_cents, order.currency ?? "eur") : "—"}
          </p>
          <p className="text-muted">Created {new Date(order.created_at).toLocaleString()}</p>
          {order.paid_at ? <p className="text-muted">Paid {new Date(order.paid_at).toLocaleString()}</p> : null}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-medium mb-2">Personalization</h2>
        {order.personalization.kind === "star-map" ? (
          <ul className="text-sm space-y-1">
            <li>Date: {order.personalization.date}</li>
            <li>Time: {order.personalization.time ?? "—"}</li>
            <li>Location: {order.personalization.locationLabel}</li>
            <li>Title: {order.personalization.title}</li>
            {order.personalization.message ? <li>Message: {order.personalization.message}</li> : null}
          </ul>
        ) : (
          <div className="text-sm space-y-2">
            <p>Pet name: {order.personalization.petName}</p>
            {order.personalization.note ? <p>Note: {order.personalization.note}</p> : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={order.personalization.photoUrl}
              alt="Uploaded pet photo"
              className="max-w-xs rounded-md border border-border"
            />
          </div>
        )}
      </div>

      <AdminOrderActions order={order} />
    </div>
  );
}
