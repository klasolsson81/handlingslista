type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Bekräfta",
  cancelLabel = "Avbryt",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <button
        type="button"
        aria-label="Stäng"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40 animate-overlay-in"
      />
      <div className="relative w-full max-w-sm bg-(--surface) rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-6 animate-expand-down">
        <h2
          id="confirm-title"
          className="text-lg font-semibold text-(--text-primary)"
        >
          {title}
        </h2>
        {message && (
          <p className="mt-2 text-sm text-(--text-secondary)">{message}</p>
        )}
        <div className="mt-5 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-(--text-secondary) hover:bg-(--accent-soft)"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 rounded-full text-white ${
              danger ? "bg-(--danger)" : "bg-(--accent)"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
