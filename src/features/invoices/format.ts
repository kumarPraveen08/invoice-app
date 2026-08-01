import {
  format,
  isSameDay,
  isThisYear,
  parseISO,
  startOfDay,
  subDays,
} from 'date-fns';
import type { Invoice } from './types';

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
