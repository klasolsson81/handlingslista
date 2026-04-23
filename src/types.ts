export type Item = {
  id: string;
  name: string;
  checked: boolean;
  categoryId: string | null;
  createdAt: number;
};

export type Category = {
  id: string;
  name: string;
  expanded: boolean;
  createdAt: number;
};

export type AppState = {
  listName: string;
  createdAt: number;
  categories: Category[];
  items: Item[];
  version: 1;
};

export const STORAGE_KEY = "handlingslista:v1";

export const createDefaultState = (): AppState => ({
  listName: "Ullared",
  createdAt: Date.now(),
  categories: [],
  items: [],
  version: 1,
});
