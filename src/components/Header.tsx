import { ChevronLeft, MoreVertical } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Progress } from "../lib/calcProgress";
import { formatSwedishDate } from "../lib/formatDate";
import { GlobalProgress } from "./GlobalProgress";

type HeaderProps = {
  listName: string;
  progress: Progress;
  editing: boolean;
  onStartEdit: () => void;
  onCommit: (name: string) => void;
  onCancel: () => void;
  onOpenMenu: () => void;
};

export function Header({
  listName,
  progress,
  editing,
  onStartEdit,
  onCommit,
  onCancel,
  onOpenMenu,
}: HeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    const value = inputRef.current?.value ?? "";
    onCommit(value);
  };

  return (
    <header className="pt-4 pb-3 px-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Tillbaka"
          className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full text-(--text-secondary) hover:bg-(--accent-soft) active:bg-(--accent-soft) transition-colors"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="flex-1 flex justify-center min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              defaultValue={listName}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commit();
                }
                if (e.key === "Escape") onCancel();
              }}
              className="text-lg font-semibold text-center bg-transparent border-b border-(--accent) outline-none max-w-full"
              aria-label="Listans namn"
            />
          ) : (
            <button
              type="button"
              onClick={onStartEdit}
              className="text-lg font-semibold text-(--text-primary) truncate px-2"
              aria-label="Byt namn på listan"
            >
              {listName}
            </button>
          )}
        </div>

        <button
          type="button"
          aria-label="Meny"
          onClick={onOpenMenu}
          className="w-10 h-10 flex items-center justify-center -mr-2 rounded-full text-(--text-secondary) hover:bg-(--accent-soft) active:bg-(--accent-soft) transition-colors"
        >
          <MoreVertical className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>

      <p className="mt-1 text-center text-sm text-(--text-secondary)">
        {formatSwedishDate()} · {progress.done} av {progress.total} klara
      </p>

      <div className="mt-3">
        <GlobalProgress progress={progress} />
      </div>
    </header>
  );
}
