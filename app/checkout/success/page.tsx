import { getOrderByOrderNumber } from "@/lib/db";
import TrackPurchase from "@/components/TrackPurchase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gracias por tu pedido — Velle",
};

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
      <h1 className="text-3xl font-medium">¡Gracias por tu pedido!</h1>
      <p className="mt-4 text-muted">
        {isPaid && order
          ? `Tu pedido ${order.order_number} está confirmado. Lo preparamos y te llega en 24–72 h.`
          : "Estamos confirmando tu pago. Puede tardar unos segundos; recarga la página en un momento."}
      </p>
      <p className="mt-3 text-sm text-muted">
        ¿Alguna duda? Escríbenos a <span className="font-medium text-foreground">info@velle.es</span>.
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
