import { notFound } from "next/navigation";
import CuadroJesusProductClient from "@/components/CuadroJesusProductClient";
import { getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";
import { cormorant } from "@/lib/fonts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cuadro 'La Luz de Jesús' — Velle",
  description:
    "Cuadro con marco de madera que se ilumina con una luz cálida y regulable. \"Siempre estaré contigo\" — Salmo 73:23.",
};

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
