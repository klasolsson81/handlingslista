import { FolderPlus, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Category } from "../types";

type AddSheetProps = {
  categories: Category[];
  onClose: () => void;
  onAddCategory: (name: string) => void;
  onAddItem: (name: string, categoryId: string | null) => void;
};

type Mode = "menu" | "category" | "item";

export function AddSheet({
  categories,
  onClose,
  onAddCategory,
  onAddItem,
}: AddSheetProps) {
  const [mode, setMode] = useState<Mode>("menu");
  const [closing, setClosing] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCategoryId, setItemCategoryId] = useState<string | "">("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "category" || mode === "item") {
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [mode]);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 200);
  };

  const submitCategory = () => {
    const trimmed = categoryName.trim();
    if (!trimmed) return;
    onAddCategory(trimmed);
    close();
  };

  const submitItem = () => {
    const trimmed = itemName.trim();
    if (!trimmed) return;
    const catId = itemCategoryId === "" ? null : itemCategoryId;
    onAddItem(trimmed, catId);
    close();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Lägg till"
    >
      <button
        type="button"
        aria-label="Stäng"
        onClick={close}
        className={`absolute inset-0 bg-black/30 ${closing ? "animate-overlay-out" : "animate-overlay-in"}`}
      />
      <div
        className={`relative bg-(--surface) rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.08)] pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 px-5 ${closing ? "animate-sheet-out" : "animate-sheet-in"}`}
      >
        <div className="mx-auto w-10 h-1.5 rounded-full bg-(--border) mb-4" />

        {mode === "menu" && (
          <div className="flex flex-col gap-2 pb-2">
            <button
              type="button"
              onClick={() => setMode("category")}
              className="flex items-center gap-3 px-2 py-4 rounded-lg hover:bg-(--accent-soft) active:bg-(--accent-soft) text-left"
            >
              <FolderPlus
                className="w-5 h-5 text-(--accent)"
                strokeWidth={2}
              />
              <span className="text-base font-medium">+ Ny kategori</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("item")}
              className="flex items-center gap-3 px-2 py-4 rounded-lg hover:bg-(--accent-soft) active:bg-(--accent-soft) text-left"
            >
              <ShoppingBag
                className="w-5 h-5 text-(--accent)"
                strokeWidth={2}
              />
              <span className="text-base font-medium">+ Ny vara</span>
            </button>
          </div>
        )}

        {mode === "category" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitCategory();
            }}
            className="flex flex-col gap-3 pb-2"
          >
            <label className="text-sm font-medium text-(--text-secondary)">
              Ny kategori
            </label>
            <input
              ref={inputRef}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="t.ex. HUSHÅLL"
              className="w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg) text-base outline-none focus:border-(--accent)"
              aria-label="Kategorinamn"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setMode("menu")}
                className="px-4 py-2 rounded-full text-(--text-secondary) hover:bg-(--accent-soft)"
              >
                Tillbaka
              </button>
              <button
                type="submit"
                disabled={!categoryName.trim()}
                className="px-5 py-2 rounded-full bg-(--accent) text-white disabled:opacity-40"
              >
                Spara
              </button>
            </div>
          </form>
        )}

        {mode === "item" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitItem();
            }}
            className="flex flex-col gap-3 pb-2"
          >
            <label className="text-sm font-medium text-(--text-secondary)">
              Ny vara
            </label>
            <input
              ref={inputRef}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="t.ex. tandkräm"
              className="w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg) text-base outline-none focus:border-(--accent)"
              aria-label="Varunamn"
            />
            <select
              value={itemCategoryId}
              onChange={(e) => setItemCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-(--border) bg-(--bg) text-base outline-none focus:border-(--accent)"
              aria-label="Kategori"
            >
              <option value="">Ingen kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setMode("menu")}
                className="px-4 py-2 rounded-full text-(--text-secondary) hover:bg-(--accent-soft)"
              >
                Tillbaka
              </button>
              <button
                type="submit"
                disabled={!itemName.trim()}
                className="px-5 py-2 rounded-full bg-(--accent) text-white disabled:opacity-40"
              >
                Spara
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
