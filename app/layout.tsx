import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
        <header className="border-b border-border">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <Link href="/" className="text-lg tracking-[0.2em] uppercase font-medium">
              Velle
            </Link>
            <nav className="flex gap-6 text-sm text-muted">
              <Link href="/products/star-map" className="hover:text-foreground transition-colors">
                Star Map
              </Link>
              <Link href="/products/pet-portrait" className="hover:text-foreground transition-colors">
                Pet Portrait
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-muted">
            © {new Date().getFullYear()} Velle. Made to order.
          </div>
        </footer>
      </body>
    </html>
  );
}
