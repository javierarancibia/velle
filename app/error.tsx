"use client";

import Link from "next/link";
import { useEffect } from "react";

// Spanish replacement for Next's default English error screen.
export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-medium">Algo ha fallado</h1>
      <p className="mt-4 text-muted">
        No hemos podido cargar esta página. Inténtalo de nuevo y, si sigue sin funcionar, escríbenos a{" "}
        <span className="font-medium text-foreground">info@velle.es</span>.
      </p>
      <div className="mt-8 flex justify-center gap-6">
        <button type="button" onClick={() => retry()} className="font-medium text-accent hover:underline">
          Reintentar
        </button>
        <Link href="/" className="text-muted hover:text-foreground hover:underline">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
