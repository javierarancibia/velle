import { NextResponse } from "next/server";
import { getOrderById, getVariantById, markSentToGelato } from "@/lib/db";
import { createGelatoOrder } from "@/lib/gelato";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "paid") {
    return NextResponse.json({ error: `Order status is ${order.status}, expected paid` }, { status: 400 });
  }

  const variant = await getVariantById(order.variant_id);
  if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

  try {
    const { gelatoOrderId } = await createGelatoOrder(order, variant);
    await markSentToGelato(order.id, gelatoOrderId);
    return NextResponse.json({ ok: true, gelatoOrderId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Gelato error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
