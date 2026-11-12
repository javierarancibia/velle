import Link from "next/link";
import { PRODUCT_PATH } from "@/lib/cuadroJesus";

export const metadata = {
  title: "Pago cancelado — Velle",
};

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-medium">Pago cancelado</h1>
      <p className="mt-4 text-muted">No se ha hecho ningún cargo. Puedes volver a intentarlo cuando quieras.</p>
      <Link href={PRODUCT_PATH} className="mt-8 inline-block text-accent hover:underline">
        Volver al cuadro
      </Link>
    </div>
  );
}
