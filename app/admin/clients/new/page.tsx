import Link from "next/link";
import { getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import NewClientForm from "./NewClientForm";

// Add a customer who bought outside the website checkout, so they show up in
// /admin/clients and can get the customer emails.

export const dynamic = "force-dynamic";

export const metadata = { title: "Añadir cliente", robots: { index: false, follow: false } };

export default async function NewClientPage() {
  const product = await getProductBySlug("cuadro-jesus");
  const variants = product ? await getActiveVariantsByProduct(product.id) : [];
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link href="/admin/clients" className="text-sm text-muted hover:text-foreground">
        ← Clientes
      </Link>
      <h1 className="mt-4 text-2xl font-medium">Añadir cliente</h1>
      <p className="mt-2 text-sm text-muted">
        Para clientes que compraron fuera de la web. Se guarda como un pedido pagado del cuadro y aparece en Clientes
        con sus tres emails.
      </p>
      <NewClientForm
        today={today}
        variants={variants.map((v) => ({ id: v.id, label: v.label, price: formatPrice(v.price_cents, v.currency, "es-ES") }))}
      />
    </div>
  );
}
