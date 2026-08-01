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
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'void', label: 'Void' },
];

function dayOffset(daysAgo: number): string {
  return format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
}

const CLIENTS = [
  'Northwind Studio',
  'Brightline Co.',
  'Cedar & Oak',
  'Kala Print House',
  'Orbit Labs',
  'Harbor Dental',
  'Pixel Forge',
  'Sunrise Bakery',
  'Astra Logistics',
  'Greenfield Clinic',
  'Nova Retail',
  'Summit Advisors',
] as const;

const STATUS_CYCLE: InvoiceStatus[] = [
  'overdue',
  'partial',
  'sent',
  'paid',
  'draft',
  'opened',
  'paid',
  'sent',
  'cancelled',
  'void',
  'partial',
  'overdue',
];

/** Spread across today → months ago so list sections + scroll are testable. */
const DAY_OFFSETS = [
  0, 0, 0, 1, 1, 2, 3, 5, 7, 9, 12, 15, 18, 22, 28, 35, 42, 50, 60, 75, 90,
  110, 130, 150, 180,
];

function buildSampleInvoices(): Invoice[] {
  return DAY_OFFSETS.map((daysAgo, index) => {
    const status = STATUS_CYCLE[index % STATUS_CYCLE.length];
    const total = 4500 + ((index * 3700) % 52000);
    const paid =
      status === 'paid'
        ? total
        : status === 'partial'
          ? Math.round(total * 0.4)
          : 0;

    return {
      id: String(index + 1),
      number: `INV-${1000 + DAY_OFFSETS.length - index}`,
      customerName: CLIENTS[index % CLIENTS.length],
      issueDate: dayOffset(daysAgo),
      dueDate: dayOffset(daysAgo - 14),
      total,
      paid,
      status,
    };
  });
}

export const SAMPLE_INVOICES: Invoice[] = buildSampleInvoices();

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
    case 'cancelled':
      return invoice.status === 'cancelled';
    case 'void':
      return invoice.status === 'void';
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
