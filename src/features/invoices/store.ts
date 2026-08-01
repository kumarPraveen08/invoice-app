import { create } from 'zustand';
import { SAMPLE_INVOICES } from './constants';
import type { Invoice } from './types';

type InvoicesState = {
  invoices: Invoice[];
  upsertInvoice: (invoice: Invoice) => void;
  patchInvoice: (id: string, patch: Partial<Invoice>) => void;
  removeInvoice: (id: string) => void;
};

export const useInvoicesStore = create<InvoicesState>((set) => ({
  invoices: SAMPLE_INVOICES,
  upsertInvoice: (invoice) =>
    set((state) => {
      const index = state.invoices.findIndex((row) => row.id === invoice.id);
      if (index === -1) {
        return { invoices: [invoice, ...state.invoices] };
      }
      const invoices = [...state.invoices];
      invoices[index] = invoice;
      return { invoices };
    }),
  patchInvoice: (id, patch) =>
    set((state) => ({
      invoices: state.invoices.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    })),
  removeInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((row) => row.id !== id),
    })),
}));
