export function datelineFor({
  date,
  timeToRead,
}: {
  date: string;
  timeToRead?: number;
}): string {
  return timeToRead ? `${date} - ${timeToRead} minute read` : date;
}

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
