import type { AppState, Item } from "../types";

const OVRIGT_HEADING = "ÖVRIGT";

function formatItem(item: Item): string {
  return `- [${item.checked ? "x" : " "}] ${item.name}`;
}

function groupForCategory(
  heading: string,
  items: Item[],
): string {
  if (items.length === 0) return "";
  const lines = [heading, ...items.map(formatItem)];
  return lines.join("\n");
}

export function exportAsText(state: AppState): string {
  const byCategory = new Map<string, Item[]>();
  const uncategorized: Item[] = [];

  for (const item of state.items) {
    if (item.categoryId === null) {
      uncategorized.push(item);
    } else {
      const bucket = byCategory.get(item.categoryId);
      if (bucket) {
        bucket.push(item);
      } else {
        byCategory.set(item.categoryId, [item]);
      }
    }
  }

  const blocks: string[] = [state.listName];

  const sortedCategories = [...state.categories].sort(
    (a, b) => a.createdAt - b.createdAt,
  );
  for (const cat of sortedCategories) {
    const items = byCategory.get(cat.id) ?? [];
    const block = groupForCategory(cat.name.toUpperCase(), items);
    if (block) blocks.push(block);
  }

  const ovrigtBlock = groupForCategory(OVRIGT_HEADING, uncategorized);
  if (ovrigtBlock) blocks.push(ovrigtBlock);

  return blocks.join("\n\n");
}

export async function copyAsText(state: AppState): Promise<boolean> {
  const text = exportAsText(state);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
