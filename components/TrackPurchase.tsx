"use client";

import { useEffect } from "react";
import { trackMetaPixelEvent } from "@/lib/metaPixel";

interface Props {
  orderId: string;
  orderNumber: string;
  valueCents: number;
  currency: string;
}

// Fires once per order, guarded by sessionStorage so a page refresh (or the
// user hitting back/forward) doesn't double-count the same purchase in Meta.
export default function TrackPurchase({ orderId, orderNumber, valueCents, currency }: Props) {
  useEffect(() => {
    const key = `meta_pixel_purchase_tracked_${orderNumber}`;
    if (sessionStorage.getItem(key)) return;
    trackMetaPixelEvent("Purchase", {
      content_ids: [orderId],
      content_type: "product",
      value: valueCents / 100,
      currency: currency.toUpperCase(),
    });
    sessionStorage.setItem(key, "1");
  }, [orderId, orderNumber, valueCents, currency]);

  return null;
}
