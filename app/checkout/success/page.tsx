import { getOrderByOrderNumber } from "@/lib/db";
import TrackPurchase from "@/components/TrackPurchase";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByOrderNumber(orderNumber) : null;

  // The webhook that flips an order to "paid" can lag slightly behind
  // Stripe's redirect back here, so a still-"pending_payment" order on this
  // page isn't necessarily an error — but we only fire the Meta Purchase
  // event (and only show a firm confirmation) once it's actually paid.
  const isPaid = order?.status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-medium">Thank you</h1>
      <p className="mt-4 text-muted">
        {isPaid && order
          ? `Your order ${order.order_number} is confirmed. We'll email you once it's on its way.`
          : "We're confirming your payment — this can take a few seconds. We'll email you once it's on its way."}
      </p>
      {isPaid && order && order.amount_total_cents !== null && order.currency ? (
        <TrackPurchase
          orderId={order.id}
          orderNumber={order.order_number}
          valueCents={order.amount_total_cents}
          currency={order.currency}
        />
      ) : null}
    </div>
  );
}
