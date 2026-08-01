import { create } from 'zustand';
import { SAMPLE_CATALOGUE, type CatalogueItem } from './types';

type CatalogueState = {
  items: CatalogueItem[];
  removeItem: (id: string) => void;
  addItems: (items: CatalogueItem[]) => void;
  upsertItem: (item: CatalogueItem) => void;
};

export const useCatalogueStore = create<CatalogueState>((set) => ({
  items: SAMPLE_CATALOGUE,
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  addItems: (items) =>
    set((state) => ({ items: [...state.items, ...items] })),
  upsertItem: (item) =>
    set((state) => {
      const index = state.items.findIndex((row) => row.id === item.id);
      if (index === -1) {
        return { items: [item, ...state.items] };
      }
      const items = [...state.items];
      items[index] = item;
      return { items };
    }),
}));
