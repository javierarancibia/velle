// Cookie consent for the one optional cookie group the store uses: Meta Pixel
// ad measurement. Spanish law (LSSI art. 22.2 + AEPD cookie guide) requires
// the visitor's opt-in before any non-essential cookie or tracker loads, and
// rejecting must be as easy as accepting.
//
// The choice is stored in a first-party cookie (itself strictly necessary, so
// it needs no consent) for 12 months, after which the banner asks again.

export type ConsentChoice = "granted" | "denied";

const COOKIE = "velle_consent";
const MAX_AGE_S = 60 * 60 * 24 * 365;
const CHANGE_EVENT = "velle:consent-change";
const OPEN_EVENT = "velle:consent-open";

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)velle_consent=(granted|denied)/);
  return m ? (m[1] as ConsentChoice) : null;
}

// First-party cookies Meta's pixel sets on our domain. Deleted when consent is
// refused or withdrawn (Meta's own "fr" lives on facebook.com, out of reach).
const META_COOKIES = ["_fbp", "_fbc"];

function deleteMetaCookies(): void {
  // The pixel writes them on the registrable domain (".velle.es"), so expire
  // both the host-only and the parent-domain variants.
  const parts = location.hostname.split(".");
  const domains = ["", parts.length > 1 ? `; Domain=.${parts.slice(-2).join(".")}` : ""];
  for (const name of META_COOKIES) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; Path=/${d}`;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${choice}; Max-Age=${MAX_AGE_S}; Path=/; SameSite=Lax${secure}`;
  if (choice === "denied") deleteMetaCookies();
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CHANGE_EVENT, { detail: choice }));
}

export function onConsentChange(cb: (choice: ConsentChoice) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<ConsentChoice>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

// Lets the footer's "Configurar cookies" link reopen the banner.
export function openConsentBanner(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentOpen(cb: () => void): () => void {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}
