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
