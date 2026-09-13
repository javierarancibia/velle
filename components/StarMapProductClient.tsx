"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { trackMetaPixelEvent } from "@/lib/metaPixel";
import type { ProductRow, ProductVariantRow, StarMapTheme } from "@/lib/types";
import { STAR_MAP_THEMES } from "@/lib/types";

interface Props {
  product: ProductRow;
  variants: ProductVariantRow[]; // ordered by price_cents ascending (S, M, L)
}

// Pixel bounding boxes of each mockup's frame opening, measured by detecting
// the frame's edge color in the source image. Expressed as % of the image so
// the overlay stays correctly placed at any rendered size -- but only if the
// image is displayed at its native aspect ratio (see aspectRatio below);
// object-fit: cover on a differently-shaped box would crop unevenly and
// throw this percentage math off.
const MOBILE_MOCKUP = {
  src: "/mockups/star-map-livingroom.png",
  aspectRatio: "896 / 1152",
  frame: { left: 31.8, top: 25.2, width: 36.8, height: 36.5 },
};
// Desktop hero: fills 75% of the viewport width x the full viewport height
// (minus the 69px header) rather than being sized off the image's own aspect
// ratio, so it matches the requested layout regardless of the image's shape.
// The mockup was composed at 4:3 (75vw / 100vh works out to exactly 4:3 on a
// 16:9 screen) to keep object-fit: cover's crop small on typical monitors,
// but shorter/unusual viewports still crop more -- so unlike the mobile
// mockup (aspect-ratio-locked, pure % overlay is exact), the desktop overlay
// position is computed at runtime from the image's actual rendered box (see
// the ResizeObserver effect below), replicating object-fit: cover's own math
// so it stays pixel-accurate regardless of how much cropping occurs.
const DESKTOP_MOCKUP = {
  src: "/mockups/star-map-livingroom-wide-v3.png",
  naturalWidth: 1184,
  naturalHeight: 1014,
  frame: { left: 40.54, top: 21.89, width: 25.59, height: 39.94 },
};
// The table's real (photographed, not the synthetic bottom padding) front
// edge is visible by this Y in the original image -- the scale is clamped
// so this line is never cropped off, guaranteeing the table stays visible.
const MUST_SHOW_UNTIL_Y = 830;

const THEME_SWATCHES: Record<StarMapTheme, { label: string; swatch: string }> = {
  midnight: { label: "Midnight", swatch: "#0b0e1a" },
  "deep-blue": { label: "Deep Blue", swatch: "#0a1636" },
  black: { label: "Black", swatch: "#000000" },
  ivory: { label: "Ivory", swatch: "#f6f1e7" },
  galaxy: { label: "Galaxy", swatch: "linear-gradient(135deg, #3a1c5c, #1c2f6b)" },
};

// Real physical area per size, used only to compute the honest "at Small's
// rate this would cost €X" value line on the M/L cards -- never a fabricated
// reference price, just Small's own €/cm² rate applied to the bigger sheet.
const SIZE_ORDER = ["30x40cm", "45x60cm", "60x90cm"];
const SIZE_AREA_CM2: Record<string, number> = {
  "30x40cm": 1200,
  "45x60cm": 2700,
  "60x90cm": 5400,
};

// product_variants.label is e.g. "30x40cm poster" or "30x40cm framed poster"
// -- six variants total (3 sizes x unframed/framed), matched back to a
// (size, framed) pair here rather than adding another DB column for it.
function parseVariantLabel(label: string): { sizeKey: string; framed: boolean } {
  const framed = /framed/i.test(label);
  const sizeKey = label.replace(/\s*(framed\s*)?poster$/i, "").trim();
  return { sizeKey, framed };
}

export default function StarMapProductClient({ product, variants }: Props) {
  const [step, setStep] = useState<"details" | "size">("details");
  const [sizeKey, setSizeKey] = useState(() => parseVariantLabel(variants[0].label).sizeKey);
  const [framed, setFramed] = useState(false);

  function variantFor(size: string, isFramed: boolean): ProductVariantRow {
    return (
      variants.find((v) => {
        const p = parseVariantLabel(v.label);
        return p.sizeKey === size && p.framed === isFramed;
      }) ?? variants[0]
    );
  }
  const variant = variantFor(sizeKey, framed);

  // Small's own unframed €/cm² rate -- the baseline the M/L "honest value"
  // line is computed from. Only meaningful unframed (framing has its own,
  // much steeper cost curve -- see the value line's guard below).
  const baseRatePerCm2 = variantFor(SIZE_ORDER[0], false).price_cents / SIZE_AREA_CM2[SIZE_ORDER[0]];

  useEffect(() => {
    trackMetaPixelEvent("ViewContent", {
      content_ids: [variant.id],
      content_name: product.name,
      content_type: "product",
      value: variant.price_cents / 100,
      currency: variant.currency.toUpperCase(),
    });
    // Re-fire when the size selection changes -- each size is a distinct
    // variant worth its own ViewContent signal for ad optimization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant.id]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [locationInput, setLocationInput] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<StarMapTheme>("galaxy");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [placeSuggestions, setPlaceSuggestions] = useState<{ lat: number; lon: number; label: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeLoading, setPlaceLoading] = useState(false);

  // Guards against re-searching immediately after picking a suggestion (the
  // input change that follows selection shouldn't reopen the dropdown for
  // the text the customer just chose). A ref, not state: it's read inside
  // the effect below but should never itself trigger a re-run.
  const justSelectedRef = useRef<string | null>(null);

  // Live autocomplete as the customer types, via Komoot's public Photon API
  // (OSM-derived, same underlying data as Nominatim, but built for
  // prefix/partial-word matching -- Nominatim's own /search endpoint returns
  // nothing for a partial word like "Amsterd", only complete-ish names, which
  // makes it unusable for real autocomplete). No API key needed; fine for
  // this store's testing-mode volume, revisit for real traffic.
  useEffect(() => {
    if (!locationInput.trim() || locationInput === justSelectedRef.current) {
      setPlaceSuggestions([]);
      return;
    }
    setPlaceLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://photon.komoot.io/api/?limit=5&q=${encodeURIComponent(locationInput)}`);
        const data = (await res.json()) as {
          features: { geometry: { coordinates: [number, number] }; properties: Record<string, string> }[];
        };
        const results = data.features.map((f) => {
          const p = f.properties;
          const label = [p.name, p.state, p.country].filter((v, i, a) => v && a.indexOf(v) === i).join(", ");
          return { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], label };
        });
        // Different OSM entities (e.g. a city + its administrative boundary)
        // can collapse to the same label once trimmed down to name/state/
        // country -- dedupe so the dropdown doesn't show visual duplicates.
        const deduped = results.filter((r, i, a) => a.findIndex((x) => x.label === r.label) === i);
        setPlaceSuggestions(deduped);
        setShowSuggestions(true);
      } catch {
        setPlaceSuggestions([]);
      } finally {
        setPlaceLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [locationInput]);

  function selectPlace(s: { lat: number; lon: number; label: string }) {
    setLat(s.lat);
    setLon(s.lon);
    justSelectedRef.current = s.label;
    setLocationInput(s.label);
    setPlaceSuggestions([]);
    setShowSuggestions(false);
  }

  // Once a place is resolved, further hand-edits to the text (e.g.
  // shortening "Amsterdam, Noord-Holland, Nederland" to "Amsterdam,
  // Netherlands") keep the resolved lat/lon -- the coordinates are still the
  // right ones for that place, and the customer should be free to type
  // whatever caption they actually want on the print. Only clearing the
  // field entirely drops the resolved location.
  function handlePlaceInputChange(value: string) {
    setLocationInput(value);
    if (!value.trim()) {
      setLat(null);
      setLon(null);
    }
  }

  const canPreview = Boolean(date && lat !== null && lon !== null && title);
  const canSubmit = Boolean(date && lat !== null && lon !== null && title.trim());

  // Automatic, debounced live preview once there's enough to render
  // something -- fires on every relevant change rather than needing an
  // explicit button press.
  useEffect(() => {
    if (!canPreview) return;
    setPreviewLoading(true);
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
            locationLabel: locationInput,
            title,
            message: message || undefined,
            theme,
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
      } finally {
        setPreviewLoading(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [canPreview, date, time, lat, lon, locationInput, title, message, theme]);

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
            locationLabel: locationInput,
            title,
            message: message || undefined,
            theme,
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

  const desktopBoxRef = useRef<HTMLDivElement>(null);
  const [desktopImageRect, setDesktopImageRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const [desktopOverlayRect, setDesktopOverlayRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  // Sizes and positions the mockup image (and the live-preview overlay inside
  // it) by hand instead of relying on CSS object-fit: cover, because plain
  // cover has no concept of "never crop past this point" -- on a short
  // viewport it will happily crop the table clean off the bottom to satisfy
  // full-width coverage. Clamping the scale to MUST_SHOW_UNTIL_Y guarantees
  // the table stays visible; the tradeoff is a possible small gap on the
  // right/bottom on very short viewports rather than a photo missing its
  // key styling element.
  useEffect(() => {
    const el = desktopBoxRef.current;
    if (!el) return;
    const recompute = () => {
      const boxW = el.clientWidth;
      const boxH = el.clientHeight;
      if (!boxW || !boxH) return;
      const coverScale = Math.max(boxW / DESKTOP_MOCKUP.naturalWidth, boxH / DESKTOP_MOCKUP.naturalHeight);
      const maxScaleToKeepTableVisible = boxH / MUST_SHOW_UNTIL_Y;
      const scale = Math.min(coverScale, maxScaleToKeepTableVisible);
      const renderedW = DESKTOP_MOCKUP.naturalWidth * scale;
      const renderedH = DESKTOP_MOCKUP.naturalHeight * scale;
      const offsetX = (boxW - renderedW) / 2; // center horizontally, incl. when clamp leaves a gap
      const offsetY = 0; // anchor to top

      setDesktopImageRect({ left: offsetX, top: offsetY, width: renderedW, height: renderedH });
      setDesktopOverlayRect({
        left: offsetX + (DESKTOP_MOCKUP.frame.left / 100) * renderedW,
        top: offsetY + (DESKTOP_MOCKUP.frame.top / 100) * renderedH,
        width: (DESKTOP_MOCKUP.frame.width / 100) * renderedW,
        height: (DESKTOP_MOCKUP.frame.height / 100) * renderedH,
      });
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const previewOverlay = (style: { left: number | string; top: number | string; width: number | string; height: number | string }) => (
    <div
      className="absolute overflow-hidden"
      style={{
        left: typeof style.left === "number" ? `${style.left}px` : style.left,
        top: typeof style.top === "number" ? `${style.top}px` : style.top,
        width: typeof style.width === "number" ? `${style.width}px` : style.width,
        height: typeof style.height === "number" ? `${style.height}px` : style.height,
      }}
    >
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="Your star map preview" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#0b0e1a]">
          <p className="text-white/40 text-[10px] px-3 text-center leading-snug">
            {previewLoading ? "Generating preview..." : "Fill in the title, date, time and place to see it here"}
          </p>
        </div>
      )}
    </div>
  );

  // Step 1: Title, Date, Time, Place, Message, Background, then Continue.
  // The preview updates automatically as this is filled in -- no explicit
  // Preview action. Size/framing moved to their own step (below) so those
  // cards have real room instead of being squeezed above the fold.
  const detailsStep = (
    <>
      <h1 className="text-2xl font-medium">{product.name}</h1>
      <p className="mt-2 text-muted">{product.description}</p>

      <div className="mt-8 space-y-5">
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

        <div className="relative">
          <label className="block text-sm mb-1">Place</label>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => handlePlaceInputChange(e.target.value)}
            onFocus={() => {
              if (placeSuggestions.length) setShowSuggestions(true);
            }}
            onBlur={() => {
              // Delay so a click on a suggestion registers before the list unmounts.
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            placeholder="e.g. Amsterdam, Netherlands"
            autoComplete="off"
            className="w-full border border-border rounded-md px-3 py-2 bg-white"
          />
          {lat !== null && lon !== null ? (
            <p className="mt-1 text-xs text-muted">
              ✓ Location set ({lat.toFixed(4)}, {lon.toFixed(4)})
            </p>
          ) : placeLoading ? (
            <p className="mt-1 text-xs text-muted">Searching...</p>
          ) : null}
          {showSuggestions && placeSuggestions.length > 0 ? (
            <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-sm max-h-48 overflow-y-auto">
              {placeSuggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => selectPlace(s)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-background"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
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

        <div>
          <label className="block text-sm mb-2">Background</label>
          <div className="flex gap-3">
            {STAR_MAP_THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                title={THEME_SWATCHES[t].label}
                className="w-9 h-9 rounded-full border-2 transition-colors"
                style={{
                  background: THEME_SWATCHES[t].swatch,
                  borderColor: theme === t ? "var(--accent)" : "transparent",
                }}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">{THEME_SWATCHES[theme].label}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStep("size")}
        disabled={!canSubmit}
        className="mt-6 w-full bg-accent text-white rounded-md py-3 disabled:opacity-40"
      >
        Continue
      </button>
    </>
  );

  // Step 2: size (bigger cards, real room to show the honest per-size value
  // line) + the framing upsell + Buy Now.
  const sizeStep = (
    <>
      <button
        type="button"
        onClick={() => setStep("details")}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        ← Back
      </button>

      <h1 className="mt-4 text-2xl font-medium">Choose your size</h1>
      <p className="mt-2 text-muted">Prices include VAT and shipping.</p>

      <div className="mt-6 space-y-3">
        {SIZE_ORDER.map((size) => {
          const v = variantFor(size, framed);
          const linearValueCents = baseRatePerCm2 * SIZE_AREA_CM2[size];
          const showValueLine = !framed && size !== SIZE_ORDER[0] && linearValueCents > v.price_cents * 1.15;
          const isSelected = size === sizeKey;
          return (
            <button
              key={size}
              type="button"
              onClick={() => setSizeKey(size)}
              className="w-full border rounded-lg px-5 py-4 text-left transition-colors flex items-center justify-between"
              style={{
                borderColor: isSelected ? "var(--accent)" : "var(--border)",
                borderWidth: isSelected ? 2 : 1,
              }}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-lg">{size}</span>
                  {size === SIZE_ORDER[1] ? (
                    <span
                      className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      Most popular
                    </span>
                  ) : null}
                </div>
                {showValueLine ? (
                  <p className="mt-1 text-xs text-muted">
                    At our smallest size&apos;s rate this would be {formatPrice(linearValueCents, v.currency)}
                  </p>
                ) : null}
              </div>
              <span className="font-medium text-lg whitespace-nowrap ml-4">
                {formatPrice(v.price_cents, v.currency)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Framing upsell banner -- real product, real Gelato-verified pricing,
          not a placeholder. Uses an actual render composited into our own
          black-frame mockup photo, not a stock image. */}
      <button
        type="button"
        onClick={() => setFramed((f) => !f)}
        className="mt-6 w-full border rounded-lg p-4 flex items-center gap-4 text-left transition-colors"
        style={{ borderColor: framed ? "var(--accent)" : "var(--border)", borderWidth: framed ? 2 : 1 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mockups/framed-banner-thumb.png"
          alt="Framed star map example"
          className="w-14 h-auto rounded flex-shrink-0"
        />
        <div className="flex-1">
          <p className="font-medium text-sm">Add a black frame</p>
          <p className="mt-0.5 text-xs text-muted">Ready to hang, no assembly needed</p>
        </div>
        <span
          className="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center"
          style={{ borderColor: framed ? "var(--accent)" : "var(--border)", background: framed ? "var(--accent)" : "transparent" }}
        >
          {framed ? <span className="text-white text-xs">✓</span> : null}
        </span>
      </button>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={handleBuyNow}
        disabled={!canSubmit || submitting}
        className="mt-6 w-full bg-accent text-white rounded-md py-3 disabled:opacity-40"
      >
        {submitting ? "Redirecting to checkout..." : `Buy Now — ${formatPrice(variant.price_cents, variant.currency)}`}
      </button>
    </>
  );

  const formPanel = step === "details" ? detailsStep : sizeStep;

  return (
    <div className="w-full">
      {/* Desktop: the photo fills the full viewport height (minus the 69px header)
          and exactly 75% of the width; the form takes the remaining 25%. Fixed
          proportions, not image-aspect-ratio-driven, per Javier's request. */}
      <div className="hidden md:flex w-full" style={{ height: "calc(100vh - 69px)" }}>
        <div ref={desktopBoxRef} className="relative h-full w-3/4 overflow-hidden bg-background">
          {desktopImageRect ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={DESKTOP_MOCKUP.src}
              alt="Living room preview"
              className="absolute"
              style={{
                left: desktopImageRect.left,
                top: desktopImageRect.top,
                width: desktopImageRect.width,
                height: desktopImageRect.height,
                maxWidth: "none",
              }}
            />
          ) : null}
          {desktopOverlayRect ? previewOverlay(desktopOverlayRect) : null}
          {/* Softens the photo's right edge into the form panel's solid background
              right before the hard flex seam, so the two don't meet as a hard line. */}
          <div
            className="absolute right-0 top-0 bottom-0 w-20 pointer-events-none"
            style={{ background: "linear-gradient(to right, transparent, var(--background))" }}
          />
        </div>

        <div className="relative w-1/4 min-w-[320px] overflow-y-auto bg-background">
          <div className="px-8 py-8">{formPanel}</div>
        </div>
      </div>

      {/* Mobile: stacked preview, then form in normal flow below it */}
      <div className="md:hidden">
        <div className="relative w-full" style={{ aspectRatio: MOBILE_MOCKUP.aspectRatio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MOBILE_MOCKUP.src} alt="Living room preview" className="absolute inset-0 w-full h-full" />
          {previewOverlay({
            left: `${MOBILE_MOCKUP.frame.left}%`,
            top: `${MOBILE_MOCKUP.frame.top}%`,
            width: `${MOBILE_MOCKUP.frame.width}%`,
            height: `${MOBILE_MOCKUP.frame.height}%`,
          })}
        </div>
        <div className="px-6 py-10">{formPanel}</div>
      </div>
    </div>
  );
}
