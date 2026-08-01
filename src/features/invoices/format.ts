import {
  format,
  isSameDay,
  isThisYear,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns';
import type { Invoice, InvoiceLine } from './types';

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

export function formatInvoiceDate(iso: string): string {
  try {
    return format(parseISO(iso), 'd MMM yyyy');
  } catch {
    return iso;
  }
}

export type InvoiceTotals = {
  subtotal: number;
  discount: number;
  taxable: number;
  tax: number;
  additionalCharges: number;
  total: number;
};

/** Subtotal → discount → tax → additional charges → total. */
export function computeInvoiceTotals(input: {
  lines: Pick<InvoiceLine, 'quantity' | 'unitPrice'>[];
  discount: number;
  taxRate: number;
  additionalCharges: number;
}): InvoiceTotals {
  const subtotal = input.lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0,
  );
  const discount = Math.min(Math.max(0, input.discount), Math.max(0, subtotal));
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * (Math.max(0, input.taxRate) / 100);
  const additionalCharges = Math.max(0, input.additionalCharges);
  const total = taxable + tax + additionalCharges;
  return {
    subtotal,
    discount,
    taxable,
    tax,
    additionalCharges,
    total,
  };
}

export function dateSectionLabel(iso: string, now = new Date()): string {
  const day = startOfDay(parseISO(iso));
  const today = startOfDay(now);
  const yesterday = subDays(today, 1);

  if (isSameDay(day, today)) return 'Today';
  if (isSameDay(day, yesterday)) return 'Yesterday';
  if (isThisYear(day)) return format(day, 'MMMM');
  return format(day, 'MMMM yyyy');
}

export function groupInvoicesByDate(
  invoices: Invoice[],
  now = new Date(),
): { title: string; data: Invoice[] }[] {
  const sorted = [...invoices].sort((a, b) =>
    b.issueDate.localeCompare(a.issueDate),
  );
  const sections: { title: string; data: Invoice[] }[] = [];
  for (const invoice of sorted) {
    const title = dateSectionLabel(invoice.issueDate, now);
    const last = sections[sections.length - 1];
    if (last && last.title === title) {
      last.data.push(invoice);
    } else {
      sections.push({ title, data: [invoice] });
    }
  }
  return sections;
}
