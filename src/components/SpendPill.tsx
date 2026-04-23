import { formatKr } from "../lib/formatKr";

type SpendPillProps = {
  total: number;
  onClick: () => void;
};

export function SpendPill({ total, onClick }: SpendPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Summa ${formatKr(total)}. Tryck för att lägga till belopp.`}
      className="pointer-events-auto bg-(--surface) border border-(--border) rounded-full px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center gap-2 active:scale-95 transition-transform"
    >
      <span className="text-xs uppercase tracking-wide text-(--text-secondary)">
        Summa
      </span>
      <span className="text-sm font-semibold text-(--text-primary) tabular-nums">
        {formatKr(total)}
      </span>
    </button>
  );
}
