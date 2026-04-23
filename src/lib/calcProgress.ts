import type { Item } from "../types";

export type Progress = { done: number; total: number };

export function calcProgress(items: Item[]): Progress {
  let done = 0;
  for (const item of items) {
    if (item.checked) done += 1;
  }
  return { done, total: items.length };
}

export function progressPercent({ done, total }: Progress): number {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}
