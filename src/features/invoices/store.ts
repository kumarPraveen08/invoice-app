import { create } from 'zustand';
import { SAMPLE_INVOICES } from './constants';
import type { Invoice } from './types';

type InvoicesState = {
  invoices: Invoice[];
};

export const useInvoicesStore = create<InvoicesState>(() => ({
  invoices: SAMPLE_INVOICES,
}));
