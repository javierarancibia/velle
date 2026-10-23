"use client";

import { usePathname } from "next/navigation";

// Promo strip above the header. Per-route because the copy is product- and
// language-specific; routes without an entry render nothing.
const BANNERS: Record<string, { text: string; cta: string; href: string }> = {
  "/products/cuadro-jesus": {
    text: "PAGA 2 Y RECIBE 3 CUADROS · ENVÍO GRATIS",
    cta: "COMPRAR AHORA",
    href: "#comprar",
  },
};

export default function AnnouncementBar() {
  const pathname = usePathname();
  const banner = BANNERS[pathname];
  if (!banner) return null;

  return (
    <div className="bg-[#1f2452] text-white text-[11px] sm:text-xs font-medium tracking-wide text-center px-4 py-2.5">
      {banner.text}{" "}
      <a href={banner.href} className="font-bold underline underline-offset-2 whitespace-nowrap">
        {banner.cta}
      </a>
    </div>
  );
}
