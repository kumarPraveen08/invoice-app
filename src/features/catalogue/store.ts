import { create } from 'zustand';
import { SAMPLE_CATALOGUE, type CatalogueItem } from './types';

type CatalogueState = {
  items: CatalogueItem[];
};

export const useCatalogueStore = create<CatalogueState>(() => ({
  items: SAMPLE_CATALOGUE,
}));
