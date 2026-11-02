import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import AnnouncementBar from "@/components/AnnouncementBar";
import MetaPixel from "@/components/MetaPixel";
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
  title: "Velle — Keepsakes made from your own story",
  description:
    "Custom pet portraits and star maps, printed as a personal keepsake. Made from your photo or your moment, not a template.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
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
          <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-muted flex items-center justify-between">
            <span>© {new Date().getFullYear()} Velle. Made to order.</span>
            {/* The store now sells the cuadro in Spain; /returns stays for the
                personalized prints. */}
            <Link href="/devoluciones" className="hover:text-foreground transition-colors">
              Garantía y devoluciones
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
