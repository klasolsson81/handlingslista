export function formatKr(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString("sv-SE")} kr`;
}

export function parseAmount(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "") return null;
  const n = parseFloat(normalized);
  if (!isFinite(n) || n <= 0) return null;
  return Math.round(n);
}
