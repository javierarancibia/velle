import Link from "next/link";
import { PRODUCT_PATH } from "@/lib/cuadroJesus";

export const metadata = {
  title: "Página no encontrada — Velle",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-medium">Esta página no existe</h1>
      <p className="mt-4 text-muted">Puede que el enlace esté mal escrito o que la página ya no esté disponible.</p>
      <div className="mt-8 flex justify-center gap-6">
        <Link href={PRODUCT_PATH} className="font-medium text-accent hover:underline">
          Ver el cuadro
        </Link>
        <Link href="/" className="text-muted hover:text-foreground hover:underline">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
