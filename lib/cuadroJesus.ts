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

// Real customer reviews (confirmed by the owner). Only set `verified: true`
// for someone who actually bought (shows "Compra verificada").
// `video`: a short vertical (9:16) clip of the customer, in MEDIA/reviews/
// (720p, no audio; `photo` is its poster frame). Reviews without one show
// their photo instead.
export type Review = { name: string; photo: string; video?: string; text: string; verified: boolean };

const reviewClip = (n: string) => ({ photo: `${MEDIA}/reviews/${n}.jpg`, video: `${MEDIA}/reviews/${n}.mp4` });

export const REVIEWS: Review[] = [
  {
    name: "Valeria M. Z., Murcia",
    ...reviewClip("valeria"),
    text: "Se lo he regalado a mi abuela para su cumpleaños y de verdad que ha llorado cuando lo encendí. Ahora lo prende cada noche para iluminar su sala.",
    verified: true,
  },
  {
    name: "Fernanda M., Cádiz",
    ...reviewClip("fernanda"),
    text: "Mi Yayo lloró cuando vio a Jesús al iluminarse.",
    verified: true,
  },
  {
    name: "Carolina S., Sevilla",
    ...reviewClip("carolina"),
    text: "Es nuestro pequeño ritual con mi hijo: rezar antes de dormir.",
    verified: true,
  },
  {
    name: "Teresa M., Zamora",
    ...reviewClip("teresa"),
    text: "¡A mi hermana le ha encantado! Siempre se ha sentido cerca de Cristo, así que apenas ha estrenado su piso, le hemos regalado esta belleza de cuadro.",
    verified: true,
  },
  {
    name: "Clara Z., Madrid",
    ...reviewClip("clara"),
    text: "Mi hija Josefina ama su Luz de Cristo.",
    verified: true,
  },
  {
    name: "Luz R., Granada",
    ...reviewClip("luz"),
    text: "El mejor regalo que me han dado para Navidad.",
    verified: true,
  },
  {
    name: "Leonor, Madrid",
    photo: `${MEDIA}/madre-hija.webp`,
    text: "¡Lo amamos! Con mi hija encendemos todas las noches nuestro cuadro para rezar antes de dormir. Se ha hecho nuestra tradición de madre e hija :)",
    verified: true,
  },
];
