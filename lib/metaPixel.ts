// Thin wrapper around window.fbq — safe to call from any client component
// even before the base pixel script has loaded (e.g. fast navigation).
export type MetaPixelEventParams = Record<string, string | number | string[]>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackMetaPixelEvent(eventName: string, params?: MetaPixelEventParams): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }
}
