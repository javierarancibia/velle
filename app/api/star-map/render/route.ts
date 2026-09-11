import { renderStarMapPng } from "@/lib/starMap/render";
import { starMapPersonalizationSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = starMapPersonalizationSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const png = await renderStarMapPng(
    { ...parsed.data, kind: "star-map" },
    { width: 600, height: 750 }
  );

  return new Response(new Uint8Array(png), {
    headers: { "content-type": "image/png", "cache-control": "no-store" },
  });
}
