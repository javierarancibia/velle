import Link from "next/link";
import { CookieSettingsLink } from "@/components/CookieBanner";

export const metadata = {
  title: "Política de cookies — Velle",
  description: "Qué cookies usa velle.es, para qué sirven y cómo cambiar tu elección.",
};

// Lists every cookie and browser-storage item the site sets. Keep it in sync
// with lib/consent.ts, components/MetaPixel.tsx and components/TrackPurchase.tsx.
const ROWS = [
  {
    name: "velle_consent",
    owner: "Velle (propia)",
    purpose: "Recordar si aceptas o rechazas las cookies de medición.",
    duration: "12 meses",
    type: "Necesaria",
  },
  {
    name: "meta_pixel_purchase_tracked_*",
    owner: "Velle (propia, almacenamiento de sesión)",
    purpose: "Evitar que una misma compra se cuente dos veces si recargas la página de confirmación.",
    duration: "Hasta cerrar la pestaña",
    type: "Necesaria",
  },
  {
    name: "_fbp",
    owner: "Meta Platforms Ireland (terceros)",
    purpose: "Identificar tu navegador para medir visitas y compras que llegan desde anuncios de Facebook e Instagram.",
    duration: "90 días",
    type: "Medición publicitaria",
  },
  {
    name: "_fbc",
    owner: "Meta Platforms Ireland (terceros)",
    purpose: "Guardar el último clic en un anuncio de Meta que te trajo a la tienda.",
    duration: "90 días",
    type: "Medición publicitaria",
  },
  {
    name: "fr",
    owner: "Meta Platforms Ireland (terceros, dominio facebook.com)",
    purpose: "Entrega y medición de anuncios de Meta.",
    duration: "90 días",
    type: "Medición publicitaria",
  },
];

export default function CookiesPage() {
  return (
    <div lang="es" className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-medium">Política de cookies</h1>
      <p className="mt-6 text-muted">
        Una cookie es un pequeño archivo que una web guarda en tu navegador. En velle.es usamos solo las
        cookies necesarias para que la tienda funcione y, únicamente si nos das tu consentimiento, cookies de
        Meta para saber qué anuncios funcionan.
      </p>

      <h2 className="mt-10 text-lg font-medium">Qué cookies usamos</h2>
      <ul className="mt-4 space-y-3">
        {ROWS.map((r) => (
          <li key={r.name} className="rounded-xl border border-border p-4 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-mono text-xs text-foreground break-all">{r.name}</span>
              <span className="text-xs font-medium text-muted">
                {r.type} · {r.duration}
              </span>
            </div>
            <p className="mt-2 text-muted">{r.purpose}</p>
            <p className="mt-1 text-xs text-muted">Titular: {r.owner}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-medium">Cómo aceptar, rechazar o cambiar tu elección</h2>
      <p className="mt-3 text-muted">
        La primera vez que entras te preguntamos. Las cookies de Meta no se cargan hasta que pulsas
        «Aceptar» o las activas en «Configurar». Puedes cambiar de opinión en cualquier momento:{" "}
        <CookieSettingsLink className="font-medium text-foreground underline underline-offset-2" />.
      </p>
      <p className="mt-3 text-muted">
        También puedes borrar o bloquear las cookies desde la configuración de tu navegador (Chrome, Safari,
        Firefox o Edge). Si las bloqueas todas, es posible que el pago no funcione correctamente.
      </p>

      <h2 className="mt-10 text-lg font-medium">Transferencias y más información</h2>
      <p className="mt-3 text-muted">
        Meta puede tratar estos datos fuera del Espacio Económico Europeo con las garantías del Marco de
        Privacidad de Datos UE-EE. UU. Puedes leer cómo los usa en su{" "}
        <a
          href="https://www.facebook.com/privacy/policy/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          política de privacidad
        </a>
        . Para cualquier duda sobre tus datos escríbenos a{" "}
        <span className="font-medium">info@velle.es</span>.
      </p>

      <p className="mt-12 text-xs text-muted">
        Última actualización: 12 de noviembre de 2026 ·{" "}
        <Link href="/" className="underline underline-offset-2 hover:text-foreground">
          Volver a la tienda
        </Link>
      </p>
    </div>
  );
}
