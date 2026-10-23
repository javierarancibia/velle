import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const SHIP_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection["allowed_countries"] =
  ["NL", "DE", "FR", "BE"];

// The cuadro de Jesús isn't a Gelato print -- it ships from its own stock to
// the Spanish market its page is written for, so it gets its own list.
export const SHIP_COUNTRIES_CUADRO_JESUS: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection["allowed_countries"] =
  ["ES"];
