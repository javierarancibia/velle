export function formatPrice(cents: number, currency: string = "eur"): string {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100
  );
}
