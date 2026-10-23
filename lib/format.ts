export function formatPrice(cents: number, currency: string = "eur", locale: string = "en-IE"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100
  );
}
