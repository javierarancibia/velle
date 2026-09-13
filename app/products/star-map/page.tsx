import { notFound } from "next/navigation";
import StarMapProductClient from "@/components/StarMapProductClient";
import { getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StarMapPage() {
  const product = await getProductBySlug("star-map");
  if (!product) notFound();
  const variants = await getActiveVariantsByProduct(product.id);
  if (variants.length === 0) notFound();

  return <StarMapProductClient product={product} variants={variants} />;
}
