import { format, subDays } from 'date-fns';
import type { Invoice, InvoiceFilter, InvoiceStatus } from './types';

export const STATUS_LABEL: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  opened: 'Opened',
  partial: 'Partially paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
  void: 'Void',
};

export const FILTERS: { id: InvoiceFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'unpaid', label: 'Unpaid' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'draft', label: 'Draft' },
  { id: 'paid', label: 'Paid' },
];

function dayOffset(daysAgo: number): string {
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
}

export const SAMPLE_INVOICES: Invoice[] = [
  {
    id: '1',
    number: 'INV-1008',
    customerName: 'Northwind Studio',
    issueDate: dayOffset(0),
    dueDate: dayOffset(-14),
    total: 48500,
    paid: 0,
    status: 'overdue',
  },
  {
    id: '2',
    number: 'INV-1007',
    customerName: 'Brightline Co.',
    issueDate: dayOffset(0),
    dueDate: dayOffset(-14),
    total: 18200,
    paid: 5000,
    status: 'partial',
  },
  {
    id: '3',
    number: 'INV-1006',
    customerName: 'Cedar & Oak',
    issueDate: dayOffset(1),
    dueDate: dayOffset(-13),
    total: 9600,
    paid: 0,
    status: 'sent',
  },
  {
    id: '4',
    number: 'INV-1005',
    customerName: 'Kala Print House',
    issueDate: dayOffset(5),
    dueDate: dayOffset(-9),
    total: 27400,
    paid: 27400,
    status: 'paid',
  },
  {
    id: '5',
    number: 'INV-1004',
    customerName: 'Orbit Labs',
    issueDate: dayOffset(40),
    dueDate: dayOffset(26),
    total: 15200,
    paid: 0,
    status: 'draft',
  },
];

export function matchesFilter(
  invoice: Invoice,
  filter: InvoiceFilter,
): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'draft':
      return invoice.status === 'draft';
    case 'paid':
      return invoice.status === 'paid';
    case 'overdue':
      return invoice.status === 'overdue';
    case 'unpaid':
      return (
        invoice.status === 'sent' ||
        invoice.status === 'opened' ||
        invoice.status === 'partial' ||
        invoice.status === 'overdue'
      );
  }
}

export function outstandingOf(invoice: Invoice): number {
  return Math.max(0, invoice.total - invoice.paid);
}
