"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { onConsentChange, readConsent } from "@/lib/consent";

// Meta's base pixel, loaded only after the visitor accepts ad-measurement
// cookies in the cookie banner. Until then fbevents.js is never requested, no
// _fbp cookie is set, and trackMetaPixelEvent() is a no-op (window.fbq is
// undefined). If the visitor later withdraws consent we send Meta's
// consent-revoke signal; the page reload that follows a withdrawal isn't
// forced, but nothing more is sent from that point on.
//
// App Router client-side navigations don't reload the document, so the
// pathname effect re-fires PageView on route changes, skipping the load that
// already sent the first one.
function loadPixel(pixelId: string) {
  if (typeof window.fbq === "function") {
    window.fbq("consent", "grant");
    return;
  }
  /* eslint-disable */
  // Meta's standard base code, unchanged apart from formatting.
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq!("consent", "grant");
  window.fbq!("init", pixelId);
  window.fbq!("track", "PageView");
}

export default function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const [granted, setGranted] = useState(false);
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    const apply = (choice: string | null) => {
      if (choice === "granted") {
        loadPixel(pixelId);
        lastTracked.current = window.location.pathname;
        setGranted(true);
      } else {
        if (typeof window.fbq === "function") window.fbq("consent", "revoke");
        setGranted(false);
      }
    };
    apply(readConsent());
    return onConsentChange(apply);
  }, [pixelId]);

  useEffect(() => {
    if (!granted || lastTracked.current === pathname) return;
    lastTracked.current = pathname;
    if (typeof window.fbq === "function") window.fbq("track", "PageView");
  }, [pathname, granted]);

  return null;
}
