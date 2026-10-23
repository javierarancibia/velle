import { Cormorant_Garamond } from "next/font/google";
import { notFound } from "next/navigation";
import CuadroJesusProductClient from "@/components/CuadroJesusProductClient";
import { getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cuadro 'La Luz de Jesús' — Velle",
  description:
    "Cuadro pintado a mano que se ilumina con una luz cálida y regulable. \"Siempre estaré contigo\" — Salmo 73:23.",
};

// Serif headings only on this page, to match the devotional look of its
// creatives -- the rest of the store stays on Geist.
const cormorant = Cormorant_Garamond({
  variable: "--font-cuadro-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export default async function CuadroJesusPage() {
  const product = await getProductBySlug("cuadro-jesus");
  if (!product) notFound();
  const variants = await getActiveVariantsByProduct(product.id);
  if (!variants.length) notFound();

  return (
    <div className={cormorant.variable}>
      <CuadroJesusProductClient product={product} variants={variants} />
    </div>
  );
}
