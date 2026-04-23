import { useEffect } from "react";

type UndoToastProps = {
  open: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
};

export function UndoToast({
  open,
  message,
  onUndo,
  onDismiss,
  durationMs = 5000,
}: UndoToastProps) {
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(t);
  }, [open, onDismiss, durationMs]);

  if (!open) return null;

  return (
    <div
      className="fixed left-1/2 bottom-24 z-50 animate-toast-in"
      role="status"
      aria-live="polite"
      style={{ transform: "translate(-50%, 0)" }}
    >
      <div className="flex items-center gap-3 bg-(--text-primary) text-white rounded-full pl-5 pr-2 py-2 shadow-lg">
        <span className="text-sm">{message}</span>
        <button
          type="button"
          onClick={onUndo}
          className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-sm font-medium"
        >
          Ångra
        </button>
      </div>
    </div>
  );
}
