import { notFound } from "next/navigation";
import StarMapProductClient from "@/components/StarMapProductClient";
import { getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StarMapPage() {
  const product = await getProductBySlug("star-map");
  if (!product) notFound();
  const variants = await getActiveVariantsByProduct(product.id);
  const variant = variants[0];
  if (!variant) notFound();

  return <StarMapProductClient product={product} variant={variant} />;
}
