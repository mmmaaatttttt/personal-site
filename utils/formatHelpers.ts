export function formatCurrency(
  value: number,
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}
