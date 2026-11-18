import { readConsent } from "./consent";

// Thin wrapper around window.fbq, safe to call from any client component
// before the base pixel has loaded.
//
// The pixel only loads after cookie consent, but product pages fire
// ViewContent as soon as they mount, which for a first-time visitor is before
// they answer the banner. Those events wait here, in memory only (nothing is
// stored or sent): MetaPixel sends them right after the pixel loads on
// "Aceptar" and throws them away on "Rechazar". A full page load clears them.
export type MetaPixelEventParams = Record<string, string | number | string[]>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type PendingEvent = [eventName: string, params: MetaPixelEventParams | undefined];

const MAX_PENDING = 20;
let pending: PendingEvent[] = [];

function send(eventName: string, params?: MetaPixelEventParams): void {
  if (params) {
    window.fbq!("track", eventName, params);
  } else {
    window.fbq!("track", eventName);
  }
}

export function trackMetaPixelEvent(eventName: string, params?: MetaPixelEventParams): void {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    send(eventName, params);
    return;
  }
  // Also held when consent is already "granted" but MetaPixel's effect hasn't
  // loaded the pixel yet (child components' effects run first on mount).
  if (readConsent() !== "denied" && pending.length < MAX_PENDING) {
    pending.push([eventName, params]);
  }
}

// Called by MetaPixel once the pixel is loaded with consent.
export function flushPendingMetaPixelEvents(): void {
  if (typeof window.fbq !== "function") return;
  const queued = pending;
  pending = [];
  for (const [eventName, params] of queued) send(eventName, params);
}

// Called by MetaPixel when the visitor rejects.
export function dropPendingMetaPixelEvents(): void {
  pending = [];
}
