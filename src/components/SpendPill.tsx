import { Flame } from "lucide-react";
import { formatKr } from "../lib/formatKr";

type SpendPillProps = {
  total: number;
  onClick: () => void;
};

const WARN_AT = 3000;
const OVER_AT = 5000;

export function SpendPill({ total, onClick }: SpendPillProps) {
  const level: 0 | 1 | 2 = total >= OVER_AT ? 2 : total >= WARN_AT ? 1 : 0;

  const amountColor =
    level === 2
      ? "text-(--danger)"
      : level === 1
        ? "text-(--warn)"
        : "text-(--text-primary)";

  const amountSize = level === 2 ? "text-base" : "text-sm";

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
      {level === 2 && (
        <Flame
          className="w-4 h-4 text-(--danger) animate-pop"
          strokeWidth={2.4}
          aria-hidden="true"
        />
      )}
      <span
        className={`font-semibold tabular-nums transition-all duration-300 ${amountSize} ${amountColor}`}
      >
        {formatKr(total)}
      </span>
    </button>
  );
}
