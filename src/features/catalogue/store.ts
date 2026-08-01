import { create } from 'zustand';
import { SAMPLE_CATALOGUE, type CatalogueItem } from './types';

type CatalogueState = {
  items: CatalogueItem[];
  removeItem: (id: string) => void;
  addItems: (items: CatalogueItem[]) => void;
};

export const useCatalogueStore = create<CatalogueState>((set) => ({
  items: SAMPLE_CATALOGUE,
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  addItems: (items) =>
    set((state) => ({ items: [...state.items, ...items] })),
}));
