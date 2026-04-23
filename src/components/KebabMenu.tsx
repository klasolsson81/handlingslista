import { useEffect, useRef } from "react";

type MenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
};

type KebabMenuProps = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
};

export function KebabMenu({ open, onClose, items }: KebabMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label="Meny"
    >
      <button
        type="button"
        aria-label="Stäng meny"
        onClick={onClose}
        className="absolute inset-0 bg-black/10 animate-overlay-in"
      />
      <div
        ref={menuRef}
        className="absolute top-14 right-4 min-w-56 bg-(--surface) border border-(--border) rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden animate-expand-down"
      >
        <ul className="flex flex-col py-1">
          {items.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className={`w-full text-left px-4 py-3 text-base hover:bg-(--accent-soft) active:bg-(--accent-soft) ${
                  item.danger ? "text-(--danger)" : "text-(--text-primary)"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
