export function formatSwedishDate(date: Date = new Date()): string {
  return date.toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
