// Maps a product_variants.label to the pixel dimensions the print file
// should be rendered at. The 30x40cm entry is unchanged from the original
// single-size build (3000x3750, ~254 DPI) -- proven to print fine, not
// worth re-deriving.
//
// The larger sizes are deliberately NOT scaled to the same DPI (that would
// be 4724x7087+ for 60x90cm). Measured directly: at that size, rendering
// took 45s+ even after merging the ~2300 stars/lines into a handful of
// <path> elements (see render.tsx) -- a real webhook-timeout risk, since
// the Stripe webhook currently awaits this render before responding. 130
// DPI (M) / 110 DPI (L) keeps render time under ~5s and is still standard
// practice for large-format posters viewed from a few feet away -- a
// 60x90cm print doesn't need the same DPI as something held in your hand.
const PRINT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "30x40cm poster": { width: 3000, height: 3750 }, // ~254 DPI, unchanged, ~5s
  "45x60cm poster": { width: 2300, height: 3070 }, // ~130 DPI, ~3.4s
  "60x90cm poster": { width: 2600, height: 3900 }, // ~110 DPI, ~4.7s
  // Framed variants print the identical star-chart file at the same size as
  // their unframed counterpart -- framing is a different physical product,
  // not a different print.
  "30x40cm framed poster": { width: 3000, height: 3750 },
  "45x60cm framed poster": { width: 2300, height: 3070 },
  "60x90cm framed poster": { width: 2600, height: 3900 },
};

const DEFAULT_DIMENSIONS = PRINT_DIMENSIONS["30x40cm poster"];

export function printDimensionsForVariantLabel(label: string): { width: number; height: number } {
  return PRINT_DIMENSIONS[label] ?? DEFAULT_DIMENSIONS;
}
