"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onConsentOpen, openConsentBanner, readConsent, writeConsent } from "@/lib/consent";

// Cookie banner per the AEPD cookie guide (2023): shown before any optional
// cookie loads, "Rechazar" sits next to "Aceptar" with the same weight, and
// "Configurar" lets the visitor choose per purpose. The footer link
// (CookieSettingsLink) reopens it so consent can be withdrawn at any time.
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    // Cookies are only readable after mount, so the first visit shows the
    // banner one frame after hydration rather than flashing on returning visitors.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readConsent() === null) setOpen(true);
    return onConsentOpen(() => {
      setAds(readConsent() === "granted");
      setConfiguring(true);
      setOpen(true);
    });
  }, []);

  if (!open) return null;

  const choose = (granted: boolean) => {
    writeConsent(granted ? "granted" : "denied");
    setOpen(false);
    setConfiguring(false);
  };

  const btn =
    "flex-1 sm:flex-none rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Preferencias de cookies"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background shadow-[0_8px_40px_rgba(0,0,0,0.18)] p-5 sm:p-6">
        <p className="text-sm font-semibold text-foreground">Tu privacidad</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Usamos cookies necesarias para que la tienda funcione y, solo si las aceptas, cookies de
          Meta para medir qué anuncios funcionan.{" "}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-foreground">
            Política de cookies
          </Link>
        </p>

        {configuring && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
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

        <div className="mt-4 flex flex-wrap gap-2 sm:justify-end">
          {configuring ? (
            <button
              type="button"
              onClick={() => choose(ads)}
              className={`${btn} w-full sm:w-auto order-last sm:order-first border border-foreground text-foreground hover:bg-foreground hover:text-background`}
            >
              Guardar preferencias
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfiguring(true)}
              className={`${btn} w-full sm:w-auto order-last sm:order-first text-muted underline underline-offset-2 hover:text-foreground px-2`}
            >
              Configurar
            </button>
          )}
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
