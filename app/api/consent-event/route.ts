import { NextResponse } from "next/server";
import { insertConsentEvent, type ConsentEventKind } from "@/lib/db";

// Anonymous cookie-banner counter: shown / granted / denied, and whether the
// visitor came from a Meta ad. Nothing identifying is read or stored, and no
// cookie is set, so it needs no consent itself.
const EVENTS: ConsentEventKind[] = ["shown", "granted", "denied"];

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { event?: unknown; fromAd?: unknown } | null;
  const event = body?.event as ConsentEventKind;
  if (!EVENTS.includes(event)) return new NextResponse(null, { status: 400 });

  try {
    await insertConsentEvent(event, body?.fromAd === true);
  } catch (err) {
    // A lost count must never break the page.
    console.error("consent event insert failed", err);
  }
  return new NextResponse(null, { status: 204 });
}
