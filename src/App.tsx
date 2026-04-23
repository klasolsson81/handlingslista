import { useMemo, useState } from "react";
import type { AppState, Category, Item } from "./types";
import { STORAGE_KEY, createDefaultState } from "./types";
import { useLocalState } from "./hooks/useLocalState";
import { calcProgress } from "./lib/calcProgress";
import { copyAsText } from "./lib/exportText";
import { Header } from "./components/Header";
import { CategoryCard } from "./components/CategoryCard";
import { Fab } from "./components/Fab";
import { AddSheet } from "./components/AddSheet";
import { KebabMenu } from "./components/KebabMenu";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { UndoToast } from "./components/UndoToast";

const OVRIGT_ID = "__ovrigt__";

type PendingDelete = {
  item: Item;
};

type ConfirmState = {
  title: string;
  message?: string;
  onConfirm: () => void;
  danger?: boolean;
};

export default function App() {
  const [state, setState] = useLocalState<AppState>(
    STORAGE_KEY,
    createDefaultState,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [ovrigtExpanded, setOvrigtExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);

  const itemsByCategory = useMemo(() => {
    const map = new Map<string, Item[]>();
    const uncategorized: Item[] = [];
    const sorted = [...state.items].sort((a, b) => a.createdAt - b.createdAt);
    for (const item of sorted) {
      if (item.categoryId === null) {
        uncategorized.push(item);
      } else {
        const bucket = map.get(item.categoryId);
        if (bucket) bucket.push(item);
        else map.set(item.categoryId, [item]);
      }
    }
    return { map, uncategorized };
  }, [state.items]);

  const sortedCategories = useMemo(
    () => [...state.categories].sort((a, b) => a.createdAt - b.createdAt),
    [state.categories],
  );

  const globalProgress = calcProgress(state.items);

  const toggleItem = (id: string) => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i,
      ),
    }));
  };

  const deleteItem = (id: string) => {
    const item = state.items.find((i) => i.id === id);
    if (!item) return;
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
    setPendingDelete({ item });
  };

  const undoDelete = () => {
    if (!pendingDelete) return;
    setState((s) => ({ ...s, items: [...s.items, pendingDelete.item] }));
    setPendingDelete(null);
  };

  const toggleCategoryExpanded = (id: string) => {
    if (id === OVRIGT_ID) {
      setOvrigtExpanded((v) => !v);
      return;
    }
    setState((s) => ({
      ...s,
      categories: s.categories.map((c) =>
        c.id === id ? { ...c, expanded: !c.expanded } : c,
      ),
    }));
  };

  const addCategory = (name: string) => {
    const cat: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      expanded: true,
      createdAt: Date.now(),
    };
    setState((s) => ({ ...s, categories: [...s.categories, cat] }));
  };

  const addItem = (name: string, categoryId: string | null) => {
    const item: Item = {
      id: crypto.randomUUID(),
      name: name.trim(),
      checked: false,
      categoryId,
      createdAt: Date.now(),
    };
    setState((s) => ({ ...s, items: [...s.items, item] }));
  };

  const commitListName = (draft: string) => {
    const trimmed = draft.trim();
    if (trimmed.length > 0 && trimmed !== state.listName) {
      setState((s) => ({ ...s, listName: trimmed }));
    }
    setEditingTitle(false);
  };

  const clearAllChecks = () => {
    setState((s) => ({
      ...s,
      items: s.items.map((i) => (i.checked ? { ...i, checked: false } : i)),
    }));
  };

  const resetAll = () => {
    setState((s) => ({
      ...createDefaultState(),
      listName: s.listName,
      createdAt: Date.now(),
    }));
  };

  const handleCopyAsText = async () => {
    await copyAsText(state);
  };

  const menuItems = [
    { label: "Byt namn på listan", onClick: () => setEditingTitle(true) },
    { label: "Kopiera som text", onClick: handleCopyAsText },
    { label: "Rensa alla bockar", onClick: clearAllChecks },
    {
      label: "Rensa hela listan",
      danger: true,
      onClick: () =>
        setConfirm({
          title: "Rensa hela listan?",
          message:
            "Alla kategorier och varor försvinner. Detta går inte att ångra.",
          danger: true,
          onConfirm: resetAll,
        }),
    },
  ];

  const hasUncategorized = itemsByCategory.uncategorized.length > 0;
  const ovrigtVirtual: Category = {
    id: OVRIGT_ID,
    name: "ÖVRIGT",
    expanded: ovrigtExpanded,
    createdAt: Number.MAX_SAFE_INTEGER,
  };

  return (
    <div className="min-h-full max-w-2xl mx-auto">
      <Header
        listName={state.listName}
        progress={globalProgress}
        editing={editingTitle}
        onStartEdit={() => setEditingTitle(true)}
        onCommit={commitListName}
        onCancel={() => setEditingTitle(false)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <main className="px-5 pb-32 flex flex-col gap-3">
        {sortedCategories.length === 0 && !hasUncategorized && (
          <div className="mt-10 text-center text-sm text-(--text-muted)">
            Tryck på <span className="font-semibold">Lägg till</span> för att
            börja bygga listan.
          </div>
        )}

        {sortedCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            items={itemsByCategory.map.get(cat.id) ?? []}
            onToggleExpanded={toggleCategoryExpanded}
            onToggleItem={toggleItem}
            onDeleteItem={deleteItem}
          />
        ))}

        {hasUncategorized && (
          <CategoryCard
            category={ovrigtVirtual}
            items={itemsByCategory.uncategorized}
            onToggleExpanded={toggleCategoryExpanded}
            onToggleItem={toggleItem}
            onDeleteItem={deleteItem}
            virtual
          />
        )}
      </main>

      <Fab onClick={() => setSheetOpen(true)} />

      {sheetOpen && (
        <AddSheet
          categories={sortedCategories}
          onClose={() => setSheetOpen(false)}
          onAddCategory={addCategory}
          onAddItem={addItem}
        />
      )}

      <KebabMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
      />

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ""}
        message={confirm?.message}
        danger={confirm?.danger}
        onConfirm={() => {
          confirm?.onConfirm();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />

      <UndoToast
        open={pendingDelete !== null}
        message={`"${pendingDelete?.item.name ?? ""}" borttagen`}
        onUndo={undoDelete}
        onDismiss={() => setPendingDelete(null)}
      />
    </div>
  );
}
