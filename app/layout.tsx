import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AnnouncementBar from "@/components/AnnouncementBar";
import MetaPixel from "@/components/MetaPixel";
import CookieBanner, { CookieSettingsLink } from "@/components/CookieBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velle — Cuadro 'La Luz de Jesús'",
  description:
    "Cuadro con luz de Jesús y el niño: apagado es una ilustración, encendido aparece Jesús. \"Siempre estaré contigo\" — Salmo 73:23. Envío gratis a toda España.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {process.env.NEXT_PUBLIC_META_PIXEL_ID ? (
          <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
        ) : null}
        <AnnouncementBar />
        <header className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <Link href="/" aria-label="Velle — inicio">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Velle" width={261} height={96} className="h-7 w-auto" />
            </Link>
            {/* Star Map and Pet Portrait are off the nav while the store focuses on
                the cuadro; their pages still work by direct link. */}
            <nav className="flex gap-6 text-sm text-muted">
              <Link href="/products/cuadro-jesus" className="hover:text-foreground transition-colors">
                El cuadro
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-muted flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Velle</span>
            {/* The store now sells the cuadro in Spain; /returns stays for the
                personalized prints. */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
              <Link href="/devoluciones" className="hover:text-foreground transition-colors">
                Garantía y devoluciones
              </Link>
              <Link href="/condiciones" className="hover:text-foreground transition-colors">
                Condiciones de venta
              </Link>
              <Link href="/privacidad" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/aviso-legal" className="hover:text-foreground transition-colors">
                Aviso legal
              </Link>
              <Link href="/cookies" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
              <CookieSettingsLink className="hover:text-foreground transition-colors" />
            </div>
          </div>
        </footer>
        <CookieBanner />
        {/* Vercel Web Analytics: cookieless visit counts, so it runs without
            cookie consent (unlike the Meta Pixel). */}
        <Analytics />
      </body>
    </html>
  );
}
