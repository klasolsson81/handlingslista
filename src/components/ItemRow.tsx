import { Check, X } from "lucide-react";
import type { Item } from "../types";

type ItemRowProps = {
  item: Item;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ItemRow({ item, onToggle, onDelete }: ItemRowProps) {
  return (
    <div className="group flex items-center min-h-12 gap-3">
      <button
        type="button"
        onClick={() => onToggle(item.id)}
        className="flex-1 flex items-center gap-3 text-left py-2 pr-2 -mx-1 px-1 rounded-lg active:bg-(--accent-soft) transition-colors"
        aria-pressed={item.checked}
      >
        <span
          className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors shrink-0 ${
            item.checked
              ? "bg-(--accent) border-(--accent)"
              : "bg-transparent border-(--text-muted)"
          }`}
          aria-hidden="true"
        >
          {item.checked && (
            <Check
              className="w-3.5 h-3.5 text-white animate-pop"
              strokeWidth={3}
            />
          )}
        </span>
        <span
          className={`text-base font-medium transition-colors break-words ${
            item.checked
              ? "line-through text-(--text-muted)"
              : "text-(--text-primary)"
          }`}
        >
          {item.name}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        aria-label={`Ta bort ${item.name}`}
        className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full opacity-40 hover:opacity-80 active:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" strokeWidth={2} />
      </button>
    </div>
  );
}
