import { getOrderByOrderNumber } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByOrderNumber(orderNumber) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-medium">Thank you</h1>
      <p className="mt-4 text-muted">
        {order
          ? `Your order ${order.order_number} is confirmed. We'll email you once it's on its way.`
          : "Your order is confirmed. We'll email you once it's on its way."}
      </p>
    </div>
  );
}
