"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { trackMetaPixelEvent } from "@/lib/metaPixel";
import type { ProductRow, ProductVariantRow } from "@/lib/types";

interface Props {
  product: ProductRow;
  variant: ProductVariantRow;
}

export default function StarMapProductClient({ product, variant }: Props) {
  useEffect(() => {
    trackMetaPixelEvent("ViewContent", {
      content_ids: [variant.id],
      content_name: product.name,
      content_type: "product",
      value: variant.price_cents / 100,
      currency: variant.currency.toUpperCase(),
    });
    // Fire once per product-page view — variant/product are static for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [locationInput, setLocationInput] = useState("");
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Geocode the free-text location into lat/lon via OpenStreetMap's public
  // Nominatim API. Fine for this store's testing-mode volume; Nominatim's
  // usage policy caps casual use around 1 request/sec — a paid geocoder
  // would be worth swapping in if this ever needs to handle real traffic.
  async function resolveLocation() {
    if (!locationInput.trim()) return;
    setGeocoding(true);
    setError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(locationInput)}`
      );
      const results = (await res.json()) as { lat: string; lon: string; display_name: string }[];
      if (results.length === 0) {
        setError("Couldn't find that place — try a nearby city name.");
        setLat(null);
        setLon(null);
        setLocationLabel(null);
        return;
      }
      setLat(parseFloat(results[0].lat));
      setLon(parseFloat(results[0].lon));
      setLocationLabel(results[0].display_name.split(",").slice(0, 2).join(", "));
    } catch {
      setError("Couldn't look up that location right now.");
    } finally {
      setGeocoding(false);
    }
  }

  const canPreview = Boolean(date && lat !== null && lon !== null && title);

  // Debounced live preview once we have enough to render something. Only
  // fetches a new preview; hiding a stale one when inputs become
  // insufficient is handled by the `canPreview` render guard below, so this
  // effect never needs to call setState synchronously in its body.
  useEffect(() => {
    if (!canPreview) return;
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/star-map/render", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "star-map",
            date,
            time,
            lat,
            lon,
            locationLabel: locationLabel ?? locationInput,
            title,
            message: message || undefined,
          }),
        });
        if (!res.ok) return;
        const blob = await res.blob();
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      } catch {
        // preview is best-effort; ignore failures
      }
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time, lat, lon, title, message]);

  const canSubmit = Boolean(date && lat !== null && lon !== null && title.trim());

  async function handleBuyNow() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productSlug: "star-map",
          variantId: variant.id,
          personalization: {
            kind: "star-map",
            date,
            time,
            lat,
            lon,
            locationLabel: locationLabel ?? locationInput,
            title,
            message: message || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ? JSON.stringify(json.error) : "Checkout failed");
      trackMetaPixelEvent("InitiateCheckout", {
        content_ids: [variant.id],
        content_name: product.name,
        content_type: "product",
        value: variant.price_cents / 100,
        currency: variant.currency.toUpperCase(),
      });
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-2 gap-12">
      <div className="flex items-center justify-center bg-[#0b0e1a] rounded-lg overflow-hidden min-h-[420px]">
        {canPreview && previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Star map preview" className="w-full h-full object-contain" />
        ) : (
          <p className="text-white/40 text-sm px-8 text-center">
            Your preview appears here once you add a date, place, and title.
          </p>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-medium">{product.name}</h1>
        <p className="mt-2 text-muted">{product.description}</p>
        <p className="mt-4 text-lg">
          {formatPrice(variant.price_cents, variant.currency)} — {variant.label}
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Time (optional, defaults to evening)</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-border rounded-md px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Place</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g. Amsterdam, Netherlands"
                className="flex-1 border border-border rounded-md px-3 py-2 bg-white"
              />
              <button
                type="button"
                onClick={resolveLocation}
                disabled={geocoding}
                className="px-4 py-2 border border-border rounded-md text-sm hover:border-accent"
              >
                {geocoding ? "..." : "Find"}
              </button>
            </div>
            {locationLabel ? <p className="mt-1 text-xs text-muted">✓ {locationLabel}</p> : null}
          </div>

          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The night we met"
              maxLength={80}
              className="w-full border border-border rounded-md px-3 py-2 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={300}
              rows={2}
              className="w-full border border-border rounded-md px-3 py-2 bg-white"
            />
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!canSubmit || submitting}
          className="mt-8 w-full bg-accent text-white rounded-md py-3 disabled:opacity-40"
        >
          {submitting ? "Redirecting to checkout..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
