import { ChevronDown, ChevronUp, Check } from "lucide-react";
import type { Category, Item } from "../types";
import { calcProgress, progressPercent } from "../lib/calcProgress";
import { ItemRow } from "./ItemRow";
import { ProgressBar } from "./ProgressBar";

type CategoryCardProps = {
  category: Category;
  items: Item[];
  onToggleExpanded: (id: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  virtual?: boolean;
};

export function CategoryCard({
  category,
  items,
  onToggleExpanded,
  onToggleItem,
  onDeleteItem,
  virtual = false,
}: CategoryCardProps) {
  const progress = calcProgress(items);
  const isComplete = progress.total > 0 && progress.done === progress.total;
  const isEmpty = progress.total === 0;
  const percent = progressPercent(progress);

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        type="button"
        onClick={() => onToggleExpanded(category.id)}
        className="w-full flex items-center gap-3 px-5 pt-5 pb-4 text-left"
      >
        <span className="flex-1 text-base font-bold tracking-wide uppercase text-(--text-primary)">
          {category.name}
        </span>

        {isEmpty ? (
          <span className="text-sm text-(--text-muted)" />
        ) : isComplete ? (
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full bg-(--accent)"
            aria-label="Alla varor klara"
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </span>
        ) : (
          <span className="text-sm text-(--text-secondary) tabular-nums">
            {progress.done}/{progress.total} klara
          </span>
        )}

        <span className="text-(--text-muted) shrink-0">
          {category.expanded ? (
            <ChevronUp className="w-5 h-5" strokeWidth={2} />
          ) : (
            <ChevronDown className="w-5 h-5" strokeWidth={2} />
          )}
        </span>
      </button>

      {!category.expanded && !isEmpty && (
        <div className="px-5 pb-5">
          <ProgressBar percent={percent} />
        </div>
      )}
      {!category.expanded && isEmpty && <div className="pb-1" />}

      {category.expanded && (
        <div className="px-5 pb-4 animate-expand-down">
          {isEmpty ? (
            <p className="text-sm text-(--text-muted) py-2">
              {virtual ? "Inga lösa varor" : "Inga varor än"}
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-(--border)/70">
              {items.map((item) => (
                <li key={item.id}>
                  <ItemRow
                    item={item}
                    onToggle={onToggleItem}
                    onDelete={onDeleteItem}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
