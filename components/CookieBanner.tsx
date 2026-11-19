"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

// Pages the visitor may open from the dialog to read before choosing: there
// the dialog sits at the bottom without dimming or locking the page.
const READABLE_PAGES = ["/cookies", "/privacidad", "/aviso-legal", "/condiciones"];

export default function CookieBanner() {
  const pathname = usePathname();
  const blocking = !READABLE_PAGES.includes(pathname);
  const [open, setOpen] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [ads, setAds] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
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

  // While the dialog is open the page behind it doesn't scroll, and keyboard
  // focus starts inside the dialog.
  useEffect(() => {
    if (!open || !blocking) return;
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    return () => {
      body.style.overflow = prev;
    };
  }, [open, blocking]);

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

  const btn = "flex-1 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";

  // A centred dialog over a dimmed page that needs an answer before the page
  // can be used. The slim bottom bar it replaced (16–19 Nov 2026) was ignored
  // by ~80 % of ad visitors, which left Meta blind to most of them. Rechazar
  // and Aceptar keep the same size and colour, so rejecting is as easy as
  // accepting (AEPD guide), and there is no close button: ignoring isn't an
  // answer, and no optional cookie loads until one is given.
  return (
    <div
      className={
        blocking
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          : "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4"
      }
    >
      <div
        role="dialog"
        aria-modal={blocking}
        aria-labelledby="cookie-title"
        ref={dialogRef}
        tabIndex={-1}
        className="pointer-events-auto w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl outline-none sm:p-6"
      >
        <h2 id="cookie-title" className="mb-2 text-base font-semibold text-foreground">
          Tu privacidad
        </h2>
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

        <div className="flex flex-col gap-4">
          <p className="text-sm leading-snug text-muted">
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
