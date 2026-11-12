import Link from "next/link";
import { LEGAL } from "@/lib/legal";

// Shared shell for the legal pages so they look like /cookies and /devoluciones.
export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div lang="es" className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-medium">{title}</h1>
      <div className="legal mt-6 text-muted">{children}</div>
      <p className="mt-12 text-xs text-muted">
        Última actualización: {LEGAL.updated} ·{" "}
        <Link href="/" className="underline underline-offset-2 hover:text-foreground">
          Volver a la tienda
        </Link>
      </p>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 text-lg font-medium text-foreground">{children}</h2>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 list-disc space-y-2 pl-5">{children}</ul>;
}

export function Email() {
  return <span className="font-medium text-foreground">{LEGAL.email}</span>;
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
      {children}
    </a>
  ) : (
    <Link href={href} className="underline underline-offset-2 hover:text-foreground">
      {children}
    </Link>
  );
}
