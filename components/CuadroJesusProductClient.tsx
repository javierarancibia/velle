"use client";

import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { trackMetaPixelEvent } from "@/lib/metaPixel";
import type { ProductRow, ProductVariantRow } from "@/lib/types";

interface Props {
  product: ProductRow;
  variants: ProductVariantRow[]; // ordered by price_cents ascending
}

// Optimized copies of public/web-media (the originals are ~90MB of 1080p
// video), re-encoded to 720p/no-audio H.264 + webp stills.
const MEDIA = "/products/jesus-frame";

const SIZE_LABEL = "17,5 × 23,5 cm";

type GalleryItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

const GALLERY: GalleryItem[] = [
  { type: "image", src: `${MEDIA}/hero.webp`, alt: "Cuadro Iluminado de Jesús encendido" },
  { type: "image", src: `${MEDIA}/features.webp`, alt: "Pintado a mano, 3 tonos de color y brillo ajustable" },
  { type: "image", src: `${MEDIA}/luz-apagada-encendida.webp`, alt: "Luz apagada y luz encendida, con control regulador USB" },
  { type: "image", src: `${MEDIA}/abuela.webp`, alt: "Abuela mirando el cuadro iluminado" },
  { type: "image", src: `${MEDIA}/nino.webp`, alt: "Niño junto al cuadro en su mesita de noche" },
  { type: "image", src: `${MEDIA}/joven.webp`, alt: "Joven sosteniendo el cuadro en tono frío" },
  { type: "image", src: `${MEDIA}/madre-hija.webp`, alt: "Madre e hija con el cuadro" },
  { type: "image", src: `${MEDIA}/salmo.webp`, alt: "El cuadro junto a la cama, en tono frío" },
  { type: "video", src: `${MEDIA}/encendido.mp4`, poster: `${MEDIA}/encendido.jpg`, alt: "El cuadro pasando de apagado a encendido" },
  { type: "video", src: `${MEDIA}/oferta.mp4`, poster: `${MEDIA}/oferta.jpg`, alt: "El cuadro iluminado en casa" },
];

// These clips cycle through several customers with each quote burned into
// the video itself, so they're shown as-is -- a separate caption would only
// match whichever person happens to be on screen.
const REVIEW_VIDEOS = ["resena-daniel-paula", "resena-isabel"];

const IN_ACTION_VIDEOS = ["ugc-joven", "ugc-abuela", "ugc-apagado", "ugc-pareja", "ambiente"];

const MATERIALS = [
  ["Marco", "Marco de madera"],
  ["Lámina", "Ilustración pintada a mano"],
  ["Luz", "LED con 3 tonos de color"],
  ["Control", "Regulador en el cable: encendido, brillo y color"],
  ["Alimentación", "Cable USB"],
];

const FAQ = [
  {
    q: "¿Cómo funciona?",
    a: "Conecta el cable USB que viene incluido a cualquier cargador o puerto USB y pulsa el interruptor del regulador. Desde el mismo regulador puedes subir o bajar el brillo y cambiar entre los 3 tonos de luz.",
  },
  {
    q: "¿Se ve bonito con la luz apagada?",
    a: "Sí. Con la luz apagada se ve la ilustración del niño caminando; al encenderla aparece Jesús de su mano, con la cruz al fondo. Es un detalle de fe discreto para cualquier rincón de la casa.",
  },
  {
    q: "¿Qué tamaño tiene?",
    a: `Mide ${SIZE_LABEL}: ideal para la mesita de noche, una estantería o un aparador.`,
  },
  {
    q: "¿Hacéis envíos a toda España?",
    // TODO(javier): confirm real dispatch + delivery times before going live.
    a: "Sí, enviamos a toda España. Recibirás un email con el seguimiento en cuanto tu pedido salga de nuestro almacén.",
  },
  {
    q: "¿Y si llega dañado?",
    a: "Si tu cuadro llega dañado, defectuoso o no llega, escríbenos a info@velle.es con una foto y te enviamos uno nuevo sin coste.",
  },
  {
    q: "¿Puedo devolverlo?",
    a: "Sí. Tienes 14 días desde la entrega para devolverlo si cambias de opinión. Escríbenos a info@velle.es y te indicamos cómo hacerlo.",
  },
  {
    q: "¿Cómo funcionan los packs?",
    a: "Con el pack de 2 ahorras en cada cuadro: uno para ti y otro para quien más quieres. Con el pack de 3 pagas el precio de 2 y el tercero te sale gratis.",
  },
];

// product_variants.label is "1 cuadro" / "2 cuadros" / "3 cuadros" -- the
// leading number is the quantity in that pack (one size only).
function quantityOf(v: ProductVariantRow): number {
  return parseInt(v.label, 10) || 1;
}

// Copy per pack size. The struck-through "before" price is always N x the
// single-frame price -- what the same frames really cost bought one by one.
const PACK_COPY: Record<number, { title: string; subtitle: string; badge?: string }> = {
  1: { title: "1 cuadro", subtitle: "Para ti" },
  2: { title: "2 cuadros", subtitle: "Uno para ti y otro para quien más quieres", badge: "Más popular" },
  3: { title: "3 cuadros", subtitle: "Paga 2 y recibe 3", badge: "Mejor precio" },
};

const price = (v: ProductVariantRow) => formatPrice(v.price_cents, v.currency, "es-ES");
const eur = (cents: number) => formatPrice(cents, "eur", "es-ES");

// Only plays while on screen -- the page has ~10 looping clips and playing
// them all at once wastes bandwidth and battery on phones.
function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={className}
    />
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-border">
      <summary className="flex items-center justify-between cursor-pointer list-none py-4 font-medium">
        {title}
        <span className="text-xl leading-none text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pb-5 text-sm text-muted leading-relaxed">{children}</div>
    </details>
  );
}

export default function CuadroJesusProductClient({ product, variants }: Props) {
  const packs = [...variants].sort((a, b) => quantityOf(a) - quantityOf(b));
  const single = packs[0];
  const bestPack = packs[packs.length - 1];
  // Preselect the "Más popular" pack when it exists.
  const [selectedId, setSelectedId] = useState((packs.find((v) => quantityOf(v) === 2) ?? single).id);
  const selected = packs.find((v) => v.id === selectedId) ?? single;
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackMetaPixelEvent("ViewContent", {
      content_ids: [selected.id],
      content_name: product.name,
      content_type: "product",
      value: selected.price_cents / 100,
      currency: selected.currency.toUpperCase(),
    });
    // Re-fire when the pack changes -- each pack is its own variant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.id]);

  async function handleBuy(variant: ProductVariantRow) {
    setSubmitting(variant.id);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          productSlug: "cuadro-jesus",
          variantId: variant.id,
          personalization: { kind: "cuadro-jesus" },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error("No se pudo iniciar el pago");
      trackMetaPixelEvent("InitiateCheckout", {
        content_ids: [variant.id],
        content_name: product.name,
        content_type: "product",
        value: variant.price_cents / 100,
        currency: variant.currency.toUpperCase(),
      });
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal, inténtalo de nuevo");
      setSubmitting(null);
    }
  }

  const active = GALLERY[activeIndex];
  const serif = { fontFamily: "var(--font-cuadro-serif), Georgia, serif" };

  const infoAccordions = (
    <div className="border-t border-border">
      <Accordion title="Materiales">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
          {MATERIALS.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="uppercase tracking-wide text-xs text-foreground pt-0.5">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Accordion>
      <Accordion title="Cómo funciona">
        Conecta el cable USB incluido y pulsa el interruptor: tu cuadro se ilumina con una luz cálida. Desde el
        regulador del cable puedes ajustar el brillo y elegir entre 3 tonos de color.
      </Accordion>
      <Accordion title="Envío y devoluciones sin preocupaciones">
        Si tu cuadro llega dañado, defectuoso o no llega, te enviamos uno nuevo sin coste. Y si cambias de opinión,
        tienes 14 días desde la entrega para devolverlo.
      </Accordion>
    </div>
  );

  return (
    <div lang="es" className="w-full">
      {/* ─── Gallery + buy box ─── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 md:pt-10 pb-16 grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-8 md:gap-12">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#1a1410]">
            {active.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={active.src} alt={active.alt} className="w-full h-full object-cover" />
            ) : (
              <video
                key={active.src}
                src={active.src}
                poster={active.poster}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {GALLERY.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={item.alt}
                className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-colors"
                style={{ borderColor: i === activeIndex ? "var(--accent)" : "transparent" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.type === "image" ? item.src : item.poster}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                {item.type === "video" ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="hidden md:block mt-8">{infoAccordions}</div>

          <div className="hidden md:grid mt-6 grid-cols-2 gap-3 text-sm">
            <p className="rounded-md bg-[#f3ece1] px-4 py-3 text-center">Pintado a mano</p>
            <p className="rounded-md bg-[#f3ece1] px-4 py-3 text-center">Luz cálida regulable</p>
          </div>
        </div>

        <div className="md:sticky md:top-6 self-start">
          <h1 className="text-4xl sm:text-[2.75rem] leading-tight" style={serif}>
            {product.name}
          </h1>
          <p className="mt-1 text-sm uppercase tracking-[0.15em] text-muted">Pintado a mano · Con luz LED</p>
          <p className="mt-4 text-2xl text-[#9b2c1f]">
            {price(single)} <span className="text-sm text-muted">· {SIZE_LABEL}</span>
          </p>

          <p className="mt-5 text-muted leading-relaxed">
            &ldquo;Siempre estaré contigo&rdquo; — Salmo 73:23. Con la luz apagada, un niño camina solo. Al encenderla,
            aparece Jesús llevándolo de la mano.
          </p>

          <div className="mt-7">
            <p className="text-sm mb-3 font-medium">Elige tu pack</p>
            <div className="space-y-3" role="radiogroup">
              {packs.map((v) => {
                const qty = quantityOf(v);
                const copy = PACK_COPY[qty] ?? { title: v.label, subtitle: "" };
                const isSelected = v.id === selected.id;
                const fullPriceCents = single.price_cents * qty;
                const savingCents = fullPriceCents - v.price_cents;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedId(v.id)}
                    className="relative w-full rounded-lg px-4 py-4 flex items-center gap-3 text-left transition-colors"
                    style={{
                      border: `${isSelected ? 2 : 1}px solid ${isSelected ? "#c98b4f" : "var(--border)"}`,
                      background: isSelected ? "#fbf0e4" : "white",
                    }}
                  >
                    {copy.badge ? (
                      <span
                        className="absolute -top-2.5 right-4 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
                        style={{ background: qty === 2 ? "#c98b4f" : "var(--accent)" }}
                      >
                        {copy.badge}
                      </span>
                    ) : null}
                    <span
                      className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                      style={{ borderColor: isSelected ? "#c98b4f" : "var(--border)" }}
                    >
                      {isSelected ? <span className="w-2 h-2 rounded-full bg-[#c98b4f]" /> : null}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-medium">{copy.title}</span>
                      <span className="block text-xs text-muted mt-0.5">{copy.subtitle}</span>
                    </span>
                    <span className="text-right flex-shrink-0">
                      {savingCents > 0 ? (
                        <span className="block text-xs text-muted line-through">{eur(fullPriceCents)}</span>
                      ) : null}
                      <span className="block font-medium">{price(v)}</span>
                      {savingCents > 0 ? (
                        <span className="block text-[11px] text-[#9b2c1f]">Ahorras {eur(savingCents)}</span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <button
            type="button"
            onClick={() => handleBuy(selected)}
            disabled={submitting !== null}
            className="mt-6 w-full rounded-full bg-accent text-white py-4 font-medium uppercase tracking-wide text-sm disabled:opacity-50"
          >
            {submitting ? "Redirigiendo al pago..." : `Comprar ahora • ${price(selected)}`}
          </button>

          <p className="mt-4 text-center text-xs text-muted">Pago seguro con tarjeta · IVA incluido</p>

          <div className="md:hidden mt-8">{infoAccordions}</div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="bg-[#f3ece1] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-center" style={serif}>
            Descubre por qué las familias lo tienen en <em>su hogar</em>
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {REVIEW_VIDEOS.map((name) => (
              <LazyVideo
                key={name}
                src={`${MEDIA}/${name}.mp4`}
                poster={`${MEDIA}/${name}.jpg`}
                className="w-full aspect-square object-cover rounded-lg shadow-sm bg-[#1a1410]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="bg-[#16110d] text-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          <LazyVideo
            src={`${MEDIA}/encendido.mp4`}
            poster={`${MEDIA}/encendido.jpg`}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Cómo funciona</p>
            <p className="mt-3 text-3xl sm:text-4xl leading-tight" style={serif}>
              Siente <em className="text-[#f2c879]">Su presencia</em> cada noche
            </p>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div className="rounded-lg border border-white/15 p-5">
                <p className="font-medium">Luz apagada</p>
                <ul className="mt-3 space-y-2 text-sm text-white/75 list-disc pl-4">
                  <li>Una ilustración pintada a mano, bonita incluso sin luz.</li>
                  <li>Un detalle de fe discreto para cualquier rincón.</li>
                </ul>
              </div>
              <div className="rounded-lg border border-[#f2c879]/40 bg-[#f2c879]/10 p-5">
                <p className="font-medium text-[#f2c879]">Luz encendida</p>
                <ul className="mt-3 space-y-2 text-sm text-white/75 list-disc pl-4">
                  <li>Aparece Jesús con una luz cálida y serena.</li>
                  <li>Perfecto para rezar o para dormir tranquilos.</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="font-medium">Tu tranquilidad es lo primero</p>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Si tu cuadro llega dañado o no llega, te enviamos uno nuevo sin coste. Queremos que llegue a tu casa
                perfecto y radiante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── In action ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-center" style={serif}>
            Míralo en casa
          </h2>
          <div className="mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            {IN_ACTION_VIDEOS.map((name) => (
              <LazyVideo
                key={name}
                src={`${MEDIA}/${name}.mp4`}
                poster={`${MEDIA}/${name}.jpg`}
                className="snap-start flex-shrink-0 w-[70%] sm:w-[calc((100%-3rem)/4)] aspect-[3/4] object-cover rounded-lg bg-[#1a1410]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bundle banner ─── */}
      {quantityOf(bestPack) === 3 ? (
        <section className="bg-[#f7e3cf] py-14 text-center px-4">
          <p className="text-sm uppercase tracking-[0.15em]">
            <strong>Paga 2 y recibe 3</strong>
          </p>
          <p className="mt-3 text-3xl sm:text-4xl" style={serif}>
            Ilumina tus noches con la presencia de Jesús
          </p>
          <p className="mt-3 text-muted">Quédate uno y regala dos: comparte la bendición con quien más quieres.</p>
          <button
            type="button"
            onClick={() => handleBuy(bestPack)}
            disabled={submitting !== null}
            className="mt-7 rounded-full bg-accent text-white px-10 py-4 font-medium uppercase tracking-wide text-sm disabled:opacity-50"
          >
            {submitting === bestPack.id ? "Redirigiendo al pago..." : `Comprar pack de 3 • ${price(bestPack)}`}
          </button>
        </section>
      ) : null}

      {/* ─── FAQ ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-center" style={serif}>
            Preguntas frecuentes
          </h2>
          <p className="mt-3 text-center text-sm text-muted">
            ¿Tienes otra pregunta? Escríbenos a <span className="text-foreground">info@velle.es</span>.
          </p>
          <div className="mt-8 border-t border-border">
            {FAQ.map((item) => (
              <Accordion key={item.q} title={item.q}>
                {item.a}
              </Accordion>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
