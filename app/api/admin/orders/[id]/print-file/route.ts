import { NextResponse } from "next/server";
import { getOrderById, setOrderPrintFileUrl } from "@/lib/db";
import { uploadPrintFile } from "@/lib/uploads";

// Manual upload of a print-ready file for an order — used for pet portraits,
// where the operator stylizes the raw uploaded photo themselves (see
// lib/gelato.ts) before this order can be sent to Gelato. Star map orders
// get this set automatically by the Stripe webhook and shouldn't need it.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const contentType = req.headers.get("content-type") ?? "application/octet-stream";
  const buffer = Buffer.from(await req.arrayBuffer());
  const extension = contentType.includes("png") ? "png" : contentType.includes("pdf") ? "pdf" : "jpg";

  const url = await uploadPrintFile(`${order.order_number}-manual.${extension}`, buffer, contentType);
  await setOrderPrintFileUrl(id, url);

  return NextResponse.json({ ok: true, url });
}
