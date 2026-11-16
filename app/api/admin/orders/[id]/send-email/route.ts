import { NextResponse } from "next/server";
import { isCustomerEmailKind } from "@/lib/customerEmails";
import { getOrderById } from "@/lib/db";
import { sendCustomerEmail } from "@/lib/notify";

// POST { kind: "confirmation" | "processing" | "shipped" } — sends that
// customer email for the order now (a resend if it went out before).
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // JSON only: a cross-site HTML form can't send this content type, so a
  // browser holding the admin password can't be made to send emails.
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
  }
  const { id } = await params;
  const body = (await req.json().catch(() => null)) as { kind?: unknown } | null;
  if (!isCustomerEmailKind(body?.kind)) {
    return NextResponse.json({ error: "Tipo de email no válido" }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });

  try {
    const { sentAt } = await sendCustomerEmail(order, body.kind);
    return NextResponse.json({
      ok: true,
      sentAt,
      warning: sentAt ? undefined : "Enviado, pero no se pudo guardar la fecha (¿falta la migración 0004?)",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
