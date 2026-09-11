import type { OrderRow, ProductVariantRow } from "./types";

// Gelato order-creation client. IMPORTANT: the payload shape below is based
// on Gelato's published v3 Orders API as of the last time this was checked
// (POST {base}/orders, X-API-KEY auth, items[].productUid + a print-file
// reference + shippingAddress). Confirm the exact field names — including
// whether to use v3's `fileUrl` or v4's `files: [...]` array — against
// Gelato's current docs before relying on this in production; APIs like this
// do shift between versions. Set GELATO_API_BASE_URL accordingly.
//
// Every product_variants.gelato_product_uid must be filled in manually by
// browsing Gelato's catalog in their dashboard and picking the exact
// product+size+material combination to fulfill with — this can't be
// inferred from our own data.

interface GelatoShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postCode: string;
  country: string; // ISO 3166-1 alpha-2
  email?: string;
  phone?: string;
}

interface CreateGelatoOrderResult {
  gelatoOrderId: string;
}

function isDryRun(): boolean {
  return process.env.GELATO_DRY_RUN === "true";
}

function shippingAddressFromOrder(order: OrderRow): GelatoShippingAddress {
  const addr = (order.shipping_address ?? {}) as Record<string, unknown>;
  const name = (addr.name as string | undefined) ?? order.customer_name ?? "";
  const [firstName, ...rest] = name.split(" ");
  const line = (addr.line1 as string | undefined) ?? "";
  const line2 = addr.line2 as string | undefined;
  const city = (addr.city as string | undefined) ?? "";
  const postalCode = (addr.postal_code as string | undefined) ?? "";
  const country = (addr.country as string | undefined) ?? "";

  return {
    firstName: firstName || "",
    lastName: rest.join(" ") || "",
    addressLine1: line,
    addressLine2: line2,
    city,
    postCode: postalCode,
    country,
    email: order.customer_email ?? undefined,
  };
}

export async function createGelatoOrder(
  order: OrderRow,
  variant: ProductVariantRow
): Promise<CreateGelatoOrderResult> {
  if (!variant.gelato_product_uid) {
    throw new Error(
      `Variant ${variant.id} (${variant.label}) has no gelato_product_uid set — pick the ` +
        "matching product in the Gelato dashboard catalog and set it on the variant first."
    );
  }
  if (!order.print_file_url) {
    throw new Error(
      `Order ${order.order_number} has no print_file_url set — for pet portraits this must ` +
        "be uploaded manually in the admin order page before sending to Gelato."
    );
  }

  const payload = {
    orderReferenceId: order.order_number,
    currency: order.currency ?? "EUR",
    items: [
      {
        itemReferenceId: order.order_number,
        productUid: variant.gelato_product_uid,
        fileUrl: order.print_file_url,
        quantity: 1,
      },
    ],
    shippingAddress: shippingAddressFromOrder(order),
  };

  if (isDryRun()) {
    console.log("[GELATO_DRY_RUN] would POST /orders with payload:", JSON.stringify(payload, null, 2));
    return { gelatoOrderId: `dry-run-${order.order_number}` };
  }

  const baseUrl = process.env.GELATO_API_BASE_URL ?? "https://order.gelatoapis.com/v3";
  const res = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "X-API-KEY": process.env.GELATO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gelato order creation failed (${res.status}): ${body}`);
  }

  const json = (await res.json()) as { id?: string; orderId?: string };
  const gelatoOrderId = json.id ?? json.orderId;
  if (!gelatoOrderId) {
    throw new Error(`Gelato response did not include an order id: ${JSON.stringify(json)}`);
  }
  return { gelatoOrderId };
}
