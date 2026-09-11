import { supabase } from "./supabase";
import type {
  OrderRow,
  OrderStatus,
  Personalization,
  ProductRow,
  ProductVariantRow,
} from "./types";

// Query helpers over Supabase/Postgres, mirroring the typed-row-+-plain-
// functions convention used by content-generator's lib/pipelineDb.ts and
// lib/adsDb.ts, adapted to the Supabase client instead of raw SQL. No ORM;
// errors bubble up to the caller (API route / server component) rather than
// being swallowed here.

// ─── Products ──────────────────────────────────────────────

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getActiveVariantsByProduct(
  productId: string
): Promise<ProductVariantRow[]> {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("active", true)
    .order("price_cents", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getVariantById(id: string): Promise<ProductVariantRow | null> {
  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ─── Orders ──────────────────────────────────────────────

function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KIN-${datePart}-${randomPart}`;
}

export async function createPendingOrder(input: {
  productId: string;
  variantId: string;
  personalization: Personalization;
}): Promise<OrderRow> {
  // Order numbers include a random suffix so collisions are effectively
  // impossible at this store's volume; retry once just in case.
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: generateOrderNumber(),
        product_id: input.productId,
        variant_id: input.variantId,
        personalization: input.personalization,
        status: "pending_payment",
      })
      .select("*")
      .single();
    if (!error) return data;
    if (error.code !== "23505") throw error; // not a unique-violation, don't retry
  }
  throw new Error("Failed to allocate a unique order number after 3 attempts");
}

export async function getOrderById(id: string): Promise<OrderRow | null> {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<OrderRow | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function attachStripeSession(
  orderId: string,
  stripeCheckoutSessionId: string
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ stripe_checkout_session_id: stripeCheckoutSessionId })
    .eq("id", orderId);
  if (error) throw error;
}

export async function getOrderByStripeSessionId(
  sessionId: string
): Promise<OrderRow | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function markOrderPaid(
  orderId: string,
  fields: {
    stripe_payment_intent_id: string | null;
    customer_email: string | null;
    customer_name: string | null;
    shipping_address: Record<string, unknown> | null;
    amount_total_cents: number | null;
    currency: string | null;
  }
): Promise<void> {
  await transitionOrderStatus(orderId, "paid", "Stripe checkout completed");
  const { error } = await supabase
    .from("orders")
    .update({ ...fields, paid_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}

export async function setOrderPrintFileUrl(orderId: string, url: string): Promise<void> {
  const { error } = await supabase.from("orders").update({ print_file_url: url }).eq("id", orderId);
  if (error) throw error;
}

export async function markSentToGelato(orderId: string, gelatoOrderId: string): Promise<void> {
  await transitionOrderStatus(orderId, "sent_to_gelato", "Sent to Gelato");
  const { error } = await supabase
    .from("orders")
    .update({ gelato_order_id: gelatoOrderId, sent_to_gelato_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}

export async function markFulfilled(orderId: string): Promise<void> {
  await transitionOrderStatus(orderId, "fulfilled", "Marked fulfilled by operator");
  const { error } = await supabase
    .from("orders")
    .update({ fulfilled_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}

export async function transitionOrderStatus(
  orderId: string,
  toStatus: OrderStatus,
  note?: string
): Promise<void> {
  const current = await getOrderById(orderId);
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: toStatus })
    .eq("id", orderId);
  if (updateError) throw updateError;

  const { error: eventError } = await supabase.from("order_status_events").insert({
    order_id: orderId,
    from_status: current?.status ?? null,
    to_status: toStatus,
    note: note ?? null,
  });
  if (eventError) throw eventError;
}

export async function listOrders(status?: OrderStatus): Promise<OrderRow[]> {
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ─── Stripe webhook idempotency ──────────────────────────────────────────

export async function hasProcessedWebhookEvent(eventId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("stripe_webhook_events")
    .select("id")
    .eq("id", eventId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function recordWebhookEvent(eventId: string, type: string): Promise<void> {
  const { error } = await supabase.from("stripe_webhook_events").insert({ id: eventId, type });
  if (error) throw error;
}
