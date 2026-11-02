// Shared by the cuadro product page and the home page, which is about the
// same product.

// Optimized copies of public/web-media (the originals are ~90MB of 1080p
// video), re-encoded to 720p/no-audio H.264 + webp stills.
export const MEDIA = "/products/jesus-frame";

export const PRODUCT_PATH = "/products/cuadro-jesus";

export const SIZE_LABEL = "17,5 × 23,5 cm";

// TODO(javier): both must stay true. EU price rules (Omnibus) require a
// struck-through "before" price to be the lowest price actually charged in
// the 30 days before the discount, and the customer count must be real.
export const COMPARE_AT_CENTS = 5990;
export const HAPPY_CUSTOMERS = "+500";

// TODO(javier): placeholders -- fill in real customer reviews. Only set
// `verified: true` for someone who actually bought (shows "Compra verificada").
export const REVIEWS: { name: string; photo: string; text: string; verified: boolean }[] = [
  {
    name: "Valeria, Murcia",
    photo: `${MEDIA}/abuela.webp`,
    text: "Se lo he regalado a mi abuela para su cumpleaños y de verdad que ha llorado cuando lo encendí. Ahora lo prende cada noche para iluminar su sala. ",
    verified: true,
  },
  {
    name: "Leonor, Madrid",
    photo: `${MEDIA}/madre-hija.webp`,
    text: "Lo amamos! Con mi hija encendemos todas las noches nuestro cuadro para rezar antes de dormir. Se ha hecho nuestra tradición de madre e hija :)",
    verified: true,
  },
  {
    name: "Teresa, Zamora",
    photo: `${MEDIA}/joven.webp`,
    text: "A mi hermana le ha encantado! Siempre se ha sentido cerca de Cristo así que apenas ha estrenado su piso, le hemos regalado esta belleza de cuadro.",
    verified: true,
  },
  {
    name: "José María, Zaragoza",
    photo: `${MEDIA}/nino.webp`,
    text: "Apenas lo ví quise comprarlo para mi hijo pequeño, para que aprenda sobre Cristo y lo tenga en su habitación",
    verified: true,
  },
  {
    name: "José María, Zaragoza",
    photo: `${MEDIA}/pareja.webp`,
    text: "Apenas lo ví quise comprarlo para mi hijo pequeño, para que aprenda sobre Cristo y lo tenga en su habitación",
    verified: true,
  },

];
