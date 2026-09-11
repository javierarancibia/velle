import { notFound } from "next/navigation";
import PetPortraitProductClient from "@/components/PetPortraitProductClient";
import { getActiveVariantsByProduct, getProductBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PetPortraitPage() {
  const product = await getProductBySlug("pet-portrait");
  if (!product) notFound();
  const variants = await getActiveVariantsByProduct(product.id);
  const variant = variants[0];
  if (!variant) notFound();

  return <PetPortraitProductClient product={product} variant={variant} />;
}
