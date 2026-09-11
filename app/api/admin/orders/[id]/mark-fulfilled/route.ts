import { NextResponse } from "next/server";
import { getOrderById, markFulfilled } from "@/lib/db";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  await markFulfilled(id);
  return NextResponse.json({ ok: true });
}
