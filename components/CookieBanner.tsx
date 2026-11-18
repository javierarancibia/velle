"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { onConsentOpen, openConsentBanner, readConsent, writeConsent } from "@/lib/consent";

// Cookie banner per the AEPD cookie guide (2023): shown before any optional
// cookie loads, "Rechazar" sits next to "Aceptar" with the same weight, and
// "Configurar" lets the visitor choose per purpose. The footer link
// (CookieSettingsLink) reopens it so consent can be withdrawn at any time.

// Anonymous count of banner answers (see app/api/consent-event). Only the
// banner that opens by itself is counted, not a reopen from the footer.
function countConsentEvent(event: "shown" | "granted" | "denied", fromAd: boolean) {
  fetch("/api/consent-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, fromAd }),
    keepalive: true,
  }).catch(() => {});
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [ads, setAds] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  // Set when the banner opened by itself; read when the visitor answers.
  const counted = useRef<{ fromAd: boolean } | null>(null);

  useEffect(() => {
    // Cookies are only readable after mount, so the first visit shows the
    // banner one frame after hydration rather than flashing on returning visitors.
    if (readConsent() === null) {
      const fromAd = new URLSearchParams(window.location.search).has("fbclid");
      counted.current = { fromAd };
      countConsentEvent("shown", fromAd);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
    return onConsentOpen(() => {
      counted.current = null;
      setAds(readConsent() === "granted");
      setConfiguring(true);
      setOpen(true);
    });
  }, []);

  // Publish the bar's height as --cookie-bar-h so bottom-fixed elements (the
  // product page's sticky buy bar) sit above it instead of under it.
  useEffect(() => {
    const root = document.documentElement;
    const el = barRef.current;
    if (!open || !el) {
      root.style.setProperty("--cookie-bar-h", "0px");
      return;
    }
    const update = () => root.style.setProperty("--cookie-bar-h", `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--cookie-bar-h", "0px");
    };
  }, [open]);

  if (!open) return null;

  const choose = (granted: boolean) => {
    writeConsent(granted ? "granted" : "denied");
    if (counted.current) {
      countConsentEvent(granted ? "granted" : "denied", counted.current.fromAd);
      counted.current = null;
    }
    setOpen(false);
    setConfiguring(false);
  };

  const btn = "flex-1 sm:flex-none rounded-full px-5 py-2 text-sm font-semibold transition-colors";

  // A slim bar, not a card: on a phone it must leave the product, price and
  // "Comprar" visible. Rechazar and Aceptar keep the same weight.
  return (
    <div
      ref={barRef}
      role="dialog"
      aria-live="polite"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto max-w-5xl px-4 py-2.5 sm:py-3">
        {configuring && (
          <div className="mb-3 space-y-3 border-b border-border pb-3">
            <label className="flex items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-medium text-foreground">Necesarias</span>
                <span className="block text-xs text-muted">
                  Carrito, pago y recordar esta elección. Siempre activas.
                </span>
              </span>
              <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-[#1f2452]" />
            </label>
            <label className="flex items-start justify-between gap-4 cursor-pointer">
              <span>
                <span className="block text-sm font-medium text-foreground">Medición publicitaria</span>
                <span className="block text-xs text-muted">
                  Píxel de Meta (Facebook e Instagram): nos dice qué anuncios traen visitas y compras.
                </span>
              </span>
              <input
                type="checkbox"
                checked={ads}
                onChange={(e) => setAds(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#1f2452]"
              />
            </label>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <p className="flex-1 text-xs leading-snug text-muted">
            Usamos cookies necesarias y, solo si las aceptas, de Meta para medir nuestros anuncios.{" "}
            <Link href="/cookies" className="underline underline-offset-2 hover:text-foreground">
              Más info
            </Link>
            {configuring ? null : (
              <>
                {" · "}
                <button
                  type="button"
                  onClick={() => setConfiguring(true)}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Configurar
                </button>
              </>
            )}
          </p>
          <div className="flex gap-2">
            {configuring ? (
              <button
                type="button"
                onClick={() => choose(ads)}
                className={`${btn} border border-foreground text-foreground hover:bg-foreground hover:text-background`}
              >
                Guardar
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => choose(false)}
                  className={`${btn} bg-[#1f2452] text-white hover:bg-[#2c3270]`}
                >
                  Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => choose(true)}
                  className={`${btn} bg-[#1f2452] text-white hover:bg-[#2c3270]`}
                >
                  Aceptar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentBanner} className={className}>
      Configurar cookies
    </button>
  );
}
