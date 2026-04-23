import { Plus } from "lucide-react";

type FabProps = {
  onClick: () => void;
  label?: string;
};

export function Fab({ onClick, label = "Lägg till" }: FabProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="pointer-events-auto bg-(--surface) border border-(--border) rounded-full px-4 py-2.5 text-sm font-medium text-(--text-primary) shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        aria-hidden="true"
      >
        {label}
      </span>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="pointer-events-auto w-14 h-14 rounded-full bg-(--accent) text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" strokeWidth={2.4} />
      </button>
    </div>
  );
}
