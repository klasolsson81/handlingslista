import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { parseAmount } from "../lib/formatKr";

type PriceSheetProps = {
  itemName: string;
  onAdd: (amount: number) => void;
  onSkip: () => void;
};

export function PriceSheet({ itemName, onAdd, onSkip }: PriceSheetProps) {
  const [value, setValue] = useState("");
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  const close = (action: () => void) => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(action, 200);
  };

  const submit = () => {
    const amount = parseAmount(value);
    if (amount === null) {
      close(onSkip);
      return;
    }
    close(() => onAdd(amount));
  };

  const amount = parseAmount(value);
  const canAdd = amount !== null;

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Lägg till pris"
    >
      <button
        type="button"
        aria-label="Stäng"
        onClick={() => close(onSkip)}
        className={`absolute inset-0 bg-black/30 ${closing ? "animate-overlay-out" : "animate-overlay-in"}`}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={`relative bg-(--surface) rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 px-5 ${closing ? "animate-sheet-out" : "animate-sheet-in"}`}
      >
        <div className="mx-auto w-10 h-1.5 rounded-full bg-(--border) mb-4" />

        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-(--text-secondary)">
              Pris
            </p>
            <p className="mt-0.5 text-lg font-semibold text-(--text-primary) truncate">
              {itemName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => close(onSkip)}
            aria-label="Stäng"
            className="w-10 h-10 flex items-center justify-center rounded-full text-(--text-secondary) hover:bg-(--accent-soft) shrink-0 -mr-2"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputMode="decimal"
          placeholder="Belopp i kr"
          className="w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg) text-base outline-none focus:border-(--accent)"
          aria-label="Pris"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => close(onSkip)}
            className="flex-1 px-4 py-3 rounded-full border border-(--border) bg-(--surface) text-(--text-primary) font-medium"
          >
            Hoppa över
          </button>
          <button
            type="submit"
            disabled={!canAdd}
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
