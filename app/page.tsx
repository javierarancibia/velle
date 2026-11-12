import Link from "next/link";
import { HAPPY_CUSTOMERS, MEDIA, PRODUCT_PATH, REVIEWS, SIZE_LABEL } from "@/lib/cuadroJesus";
import { getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";
import { cormorant } from "@/lib/fonts";
import { formatPrice } from "@/lib/format";
import type { ProductVariantRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Velle — Cuadro 'La Luz de Jesús' que se ilumina",
  description:
    "Apagado es un cuadro; al encenderlo aparece Jesús llevando a un niño de la mano. \"Siempre estaré contigo\" — Salmo 73:23. Envío gratis a toda España.",
};

const serif = { fontFamily: "var(--font-cuadro-serif), Georgia, serif" };

// Who it's for -- the avatars the Navidad 2026 ads are built on
// (docs/marketing/7-maletas-velle-2026-11-02.html).
const FOR_WHOM = [
  { photo: `${MEDIA}/abuela.webp`, title: "Para la abuela", text: "Para que encienda su fe cada noche en el salón." },
  { photo: `${MEDIA}/madre-hija.webp`, title: "Para mamá", text: "Para la madre que te enseñó a rezar." },
  { photo: `${MEDIA}/nino.webp`, title: "Para los niños", text: "Una luz para sus oraciones antes de dormir." },
  { photo: `${MEDIA}/salmo.webp`, title: "Para ti", text: "Siente Su protección cada noche en tu hogar." },
];

const TRUST = [
  "Marco de madera con luz LED",
  "Envío gratis a toda España",
  "Si llega dañado, te enviamos otro",
  "Pago con tarjeta o Bizum",
];

const FEATURES = [
  "Ilustración bonita incluso apagada",
  "Luz LED con 3 tonos de color",
  "Regulador en el cable: encendido, brillo y color",
  `${SIZE_LABEL}, para la mesita, una estantería o el salón`,
];

const eur = (cents: number) => formatPrice(cents, "eur", "es-ES");

// The home must render even if the database is down; it only needs prices
// for the buttons, and the product page handles the purchase itself.
async function loadPacks(): Promise<ProductVariantRow[]> {
  try {
    const product = await getProductBySlug("cuadro-jesus");
    if (!product) return [];
    const variants = await getActiveVariantsByProduct(product.id);
    return [...variants].sort((a, b) => (parseInt(a.label, 10) || 1) - (parseInt(b.label, 10) || 1));
  } catch (err) {
    console.error("Home: could not load cuadro-jesus prices", err);
    return [];
  }
}

function Stars() {
  return (
    <span className="text-[#e0a526] tracking-wider" aria-label="5 estrellas">
      ★★★★★
    </span>
  );
}

export default async function Home() {
  const packs = await loadPacks();
  const single = packs[0];
  const pack3 = packs.find((v) => parseInt(v.label, 10) === 3);

  const buyLabel = single ? `Lo quiero · ${eur(single.price_cents)}` : "Ver el cuadro";

  return (
    <div lang="es" className={`${cormorant.variable} w-full`}>
      {/* ─── Hero ─── */}
      <section className="bg-[#16110d] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <p className="flex items-center gap-2 text-sm text-white/75">
              <Stars />
              <span>
                <span className="font-medium text-white">{HAPPY_CUSTOMERS}</span> clientes felices
              </span>
            </p>
            <h1 className="mt-4 text-4xl sm:text-5xl leading-[1.1]" style={serif}>
              Apágalo y es un cuadro.{" "}
              <em className="text-[#f2c879]">Enciéndelo y aparece Jesús.</em>
            </h1>
            <p className="mt-5 text-white/75 leading-relaxed max-w-lg">
              Un niño camina solo… y al encender la luz, Jesús lo lleva de la mano:{" "}
              <em className="text-white">&ldquo;Siempre estaré contigo&rdquo;</em> (Salmo 73:23). El regalo que emociona
              a quien más quieres.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href={PRODUCT_PATH}
                className="rounded-full bg-accent text-white px-8 py-4 text-center font-medium uppercase tracking-wide text-sm"
              >
                {buyLabel}
              </Link>
              <p className="text-sm text-white/70 text-center sm:text-left">
                <strong className="text-white">Paga 2 y recibe 3</strong> · Envío gratis
              </p>
            </div>
          </div>
          <video
            src={`${MEDIA}/encendido.mp4`}
            poster={`${MEDIA}/encendido.jpg`}
            autoPlay
            muted
            loop
            playsInline
            aria-label="El cuadro pasando de apagado a encendido"
            className="order-1 md:order-2 w-full aspect-square object-cover rounded-lg"
          />
        </div>
      </section>

      {/* ─── Trust strip ─── */}
      <section className="border-b border-border">
        <ul className="mx-auto max-w-6xl px-4 sm:px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs sm:text-sm text-muted">
          {TRUST.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      {/* ─── For whom ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-center" style={serif}>
            Un regalo para quien más quieres
          </h2>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FOR_WHOM.map((item) => (
              <Link key={item.title} href={PRODUCT_PATH} className="group block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.photo}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover rounded-lg"
                />
                <p className="mt-3 text-xl group-hover:underline" style={serif}>
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-muted leading-relaxed">{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Off / on ─── */}
      <section className="bg-[#f3ece1] py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${MEDIA}/luz-apagada-encendida.webp`}
            alt="El cuadro con la luz apagada y con la luz encendida"
            loading="lazy"
            className="w-full rounded-lg"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Cómo funciona</p>
            <h2 className="mt-3 text-3xl sm:text-4xl leading-tight" style={serif}>
              Precioso de día, <em>mágico de noche</em>
            </h2>
            <ul className="mt-6 space-y-3 text-muted">
              {FEATURES.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="text-[#c98b4f]" aria-hidden>
                    ✦
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href={PRODUCT_PATH} className="mt-8 inline-block text-sm font-medium text-[#c98b4f] hover:underline">
              Ver todos los detalles →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-center" style={serif}>
            Lo que dicen nuestros clientes
          </h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.slice(0, 4).map((r) => (
              <article key={r.name} className="rounded-xl border border-border bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{r.name}</p>
                  <Stars />
                </div>
                {r.verified ? (
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#c98b4f]">
                    Compra verificada
                  </p>
                ) : null}
                <p className="mt-3 text-sm text-muted leading-relaxed">&ldquo;{r.text.trim()}&rdquo;</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pack offer + guarantee ─── */}
      <section className="bg-[#f7e3cf] py-14 text-center px-4">
        <p className="text-sm uppercase tracking-[0.15em]">
          <strong>Paga 2 y recibe 3</strong>
        </p>
        <p className="mt-3 text-3xl sm:text-4xl" style={serif}>
          Quédate uno y regala dos
        </p>
        {single && pack3 ? (
          <p className="mt-3 text-muted">
            3 cuadros por <strong className="text-foreground">{eur(pack3.price_cents)}</strong>{" "}
            <span className="line-through">{eur(single.price_cents * 3)}</span>
          </p>
        ) : null}
        <Link
          href={`${PRODUCT_PATH}#comprar`}
          className="mt-7 inline-block rounded-full bg-accent text-white px-10 py-4 font-medium uppercase tracking-wide text-sm"
        >
          Elegir mi pack
        </Link>
        <p className="mt-5 text-xs text-muted max-w-md mx-auto">
          Envío gratis · Pago seguro con tarjeta o Bizum · Si no llega o llega dañado, te enviamos otro gratis · 14
          días de devolución
        </p>
      </section>
    </div>
  );
}
