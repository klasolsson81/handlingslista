import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatKr, parseAmount } from "../lib/formatKr";

type SpendSheetProps = {
  total: number;
  onClose: () => void;
  onAdd: (amount: number) => void;
  onSubtract: (amount: number) => void;
};

export function SpendSheet({
  total,
  onClose,
  onAdd,
  onSubtract,
}: SpendSheetProps) {
  const [value, setValue] = useState("");
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 200);
  };

  const submit = (sign: 1 | -1) => {
    const amount = parseAmount(value);
    if (amount === null) return;
    if (sign === 1) onAdd(amount);
    else onSubtract(amount);
    close();
  };

  const amount = parseAmount(value);
  const canSubmit = amount !== null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Lägg till belopp"
    >
      <button
        type="button"
        aria-label="Stäng"
        onClick={close}
        className={`absolute inset-0 bg-black/30 ${closing ? "animate-overlay-out" : "animate-overlay-in"}`}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(1);
        }}
        className={`relative bg-(--surface) rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 px-5 ${closing ? "animate-sheet-out" : "animate-sheet-in"}`}
      >
        <div className="mx-auto w-10 h-1.5 rounded-full bg-(--border) mb-4" />

        <p className="text-xs uppercase tracking-wide text-(--text-secondary)">
          Nuvarande summa
        </p>
        <p className="mt-1 text-2xl font-semibold text-(--text-primary) tabular-nums">
          {formatKr(total)}
        </p>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="decimal"
          placeholder="Belopp i kr"
          className="mt-5 w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg) text-base outline-none focus:border-(--accent)"
          aria-label="Belopp"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => submit(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-(--border) bg-(--surface) text-(--text-primary) font-medium disabled:opacity-40"
          >
            <Minus className="w-4 h-4" strokeWidth={2.4} />
            Dra av
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-(--accent) text-white font-medium disabled:opacity-40"
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
            Lägg till
          </button>
        </div>
      </form>
    </div>
  );
}
