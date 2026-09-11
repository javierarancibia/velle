import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const SHIP_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection["allowed_countries"] =
  ["NL", "DE", "FR", "BE"];
