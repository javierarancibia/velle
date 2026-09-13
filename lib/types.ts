export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "payment_failed"
  | "sent_to_gelato"
  | "fulfilled"
  | "canceled";

export const STAR_MAP_THEMES = ["midnight", "deep-blue", "black", "ivory", "galaxy"] as const;
export type StarMapTheme = (typeof STAR_MAP_THEMES)[number];

export type PersonalizationStarMap = {
  kind: "star-map";
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm, optional
  lat: number;
  lon: number;
  locationLabel: string;
  title: string;
  message?: string;
  theme?: StarMapTheme; // defaults to "midnight" when omitted
};

export type PersonalizationPetPortrait = {
  kind: "pet-portrait";
  photoUrl: string;
  petName: string;
  note?: string;
};

export type Personalization = PersonalizationStarMap | PersonalizationPetPortrait;

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
}

export interface ProductVariantRow {
  id: string;
  product_id: string;
  label: string;
  price_cents: number;
  currency: string;
  stripe_price_id: string | null;
  gelato_product_uid: string | null;
  active: boolean;
  created_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  product_id: string;
  variant_id: string;
  status: OrderStatus;
  personalization: Personalization;
  print_file_url: string | null;
  customer_email: string | null;
  customer_name: string | null;
  shipping_address: Record<string, unknown> | null;
  amount_total_cents: number | null;
  currency: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  gelato_order_id: string | null;
  gelato_status: string | null;
  notes: string | null;
  created_at: string;
  paid_at: string | null;
  sent_to_gelato_at: string | null;
  fulfilled_at: string | null;
}
