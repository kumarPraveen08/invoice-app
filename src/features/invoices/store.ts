import { create } from 'zustand';
import { SAMPLE_INVOICES } from './constants';
import type { Invoice } from './types';

type InvoicesState = {
  invoices: Invoice[];
  patchInvoice: (id: string, patch: Partial<Invoice>) => void;
};

export const useInvoicesStore = create<InvoicesState>((set) => ({
  invoices: SAMPLE_INVOICES,
  patchInvoice: (id, patch) =>
    set((state) => ({
      invoices: state.invoices.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    })),
}));
