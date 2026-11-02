import { Cormorant_Garamond } from "next/font/google";

// Serif headings for the cuadro pages (home + product), to match the
// devotional look of its creatives -- the rest of the store stays on Geist.
// Declared once here: next/font fails when two modules load the same font.
export const cormorant = Cormorant_Garamond({
  variable: "--font-cuadro-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});
