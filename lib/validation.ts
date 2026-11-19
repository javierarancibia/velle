import { z } from "zod";
import { STAR_MAP_THEMES } from "./types";

export const starMapPersonalizationSchema = z.object({
  kind: z.literal("star-map"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Expected HH:mm")
    .optional(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  locationLabel: z.string().min(1).max(200),
  title: z.string().min(1).max(80),
  message: z.string().max(300).optional(),
  theme: z.enum(STAR_MAP_THEMES).optional(),
});

export const petPortraitPersonalizationSchema = z.object({
  kind: z.literal("pet-portrait"),
  photoUrl: z.string().url(),
  petName: z.string().min(1).max(80),
  note: z.string().max(300).optional(),
});

export const cuadroJesusPersonalizationSchema = z.object({
  kind: z.literal("cuadro-jesus"),
});

export const personalizationSchema = z.discriminatedUnion("kind", [
  starMapPersonalizationSchema,
  petPortraitPersonalizationSchema,
  cuadroJesusPersonalizationSchema,
]);

export const checkoutRequestSchema = z.object({
  productSlug: z.enum(["star-map", "pet-portrait", "cuadro-jesus"]),
  variantId: z.string().uuid(),
  personalization: personalizationSchema,
});

// Spanish phone for cash-on-delivery orders: 9 digits starting 6/7/8/9,
// with or without +34 / 0034 and spaces, dots or dashes. Returns +34XXXXXXXXX.
export function normalizeSpanishPhone(raw: string): string | null {
  const digits = raw.replace(/[\s.\-()]/g, "").replace(/^(\+34|0034)/, "");
  return /^[6789]\d{8}$/.test(digits) ? `+34${digits}` : null;
}

// Cash on delivery (cuadro only, Spain only). `website` is a honeypot: real
// people never see it, so any value means a bot.
export const codOrderRequestSchema = z.object({
  variantId: z.string().uuid(),
  name: z.string().trim().min(3).max(120),
  phone: z
    .string()
    .trim()
    .refine((v) => normalizeSpanishPhone(v) !== null, "Teléfono no válido"),
  email: z.string().trim().email().max(200),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional(),
  // Spanish postcodes 01–52, minus Ceuta (51) and Melilla (52): the warehouse
  // doesn't ship there (19 Nov 2026). Baleares (07) and Canarias (35, 38) are in.
  postalCode: z.string().trim().regex(/^(0[1-9]|[1-4]\d|50)\d{3}$/, "Código postal no válido"),
  city: z.string().trim().min(2).max(100),
  province: z.string().trim().max(100).optional(),
  website: z.string().max(0).optional(),
});
export type CodOrderRequest = z.infer<typeof codOrderRequestSchema>;
