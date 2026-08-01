import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
} from 'date-fns';
import { outstandingOf, STATUS_LABEL } from '@/features/invoices/constants';
import type { Invoice, InvoiceStatus } from '@/features/invoices/types';

export type ReportPeriod =
  | 'week'
  | 'month'
  | 'last_month'
  | '30d'
  | 'year'
  | 'all'
  | 'custom';

export type DateRange = {
  start: string;
  end: string;
};

export const REPORT_PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: 'last_month', label: 'Last month' },
  { id: '30d', label: '30 days' },
  { id: 'year', label: 'This year' },
  { id: 'all', label: 'All time' },
  { id: 'custom', label: 'Custom' },
];

const CLOSED = new Set<InvoiceStatus>(['cancelled', 'void', 'draft']);

function periodRange(
  period: Exclude<ReportPeriod, 'custom'>,
  now: Date,
): { start: Date; end: Date } | null {
  switch (period) {
    case 'all':
      return null;
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'last_month': {
      const prev = subMonths(now, 1);
      return { start: startOfMonth(prev), end: endOfMonth(prev) };
    }
    case '30d':
      return { start: subDays(now, 30), end: now };
    case 'year':
      return { start: startOfYear(now), end: now };
  }
}

function inRange(iso: string, start: Date, end: Date): boolean {
  try {
    return isWithinInterval(parseISO(iso), {
      start: startOfDay(start),
      end: endOfDay(end),
    });
  } catch {
    return false;
  }
}

export function parseDateInput(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return null;
  try {
    const date = parseISO(value.trim());
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function formatRangeLabel(range: DateRange): string {
  const start = parseDateInput(range.start);
  const end = parseDateInput(range.end);
  if (!start || !end) return 'Custom';
  return `${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`;
}

export function invoicesInPeriod(
  invoices: Invoice[],
  period: ReportPeriod,
  customRange?: DateRange | null,
  now = new Date(),
): Invoice[] {
  if (period === 'custom') {
    if (!customRange) return [];
    const start = parseDateInput(customRange.start);
    const end = parseDateInput(customRange.end);
    if (!start || !end || start > end) return [];
    return invoices.filter((invoice) =>
      inRange(invoice.issueDate, start, end),
    );
  }

  const range = periodRange(period, now);
  if (!range) return invoices;
  return invoices.filter((invoice) =>
    inRange(invoice.issueDate, range.start, range.end),
  );
}

export type ReportSummary = {
  collected: number;
  billed: number;
  outstanding: number;
  overdue: number;
  invoiceCount: number;
  byStatus: { status: InvoiceStatus; label: string; count: number }[];
  topClients: { name: string; billed: number; outstanding: number }[];
};

export function summarizeInvoices(invoices: Invoice[]): ReportSummary {
  let collected = 0;
  let billed = 0;
  let outstanding = 0;
  let overdue = 0;
  const statusCounts = new Map<InvoiceStatus, number>();
  const clientMap = new Map<
    string,
    { billed: number; outstanding: number }
  >();

  for (const invoice of invoices) {
    collected += invoice.paid;
    billed += invoice.total;
    statusCounts.set(
      invoice.status,
      (statusCounts.get(invoice.status) ?? 0) + 1,
    );

    const due = CLOSED.has(invoice.status) ? 0 : outstandingOf(invoice);
    outstanding += due;
    if (invoice.status === 'overdue') overdue += due;

    const client = clientMap.get(invoice.customerName) ?? {
      billed: 0,
      outstanding: 0,
    };
    client.billed += invoice.total;
    client.outstanding += due;
    clientMap.set(invoice.customerName, client);
  }

  const byStatus = [...statusCounts.entries()]
    .map(([status, count]) => ({
      status,
      label: STATUS_LABEL[status],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const topClients = [...clientMap.entries()]
    .map(([name, totals]) => ({ name, ...totals }))
    .sort((a, b) => b.billed - a.billed)
    .slice(0, 5);

  return {
    collected,
    billed,
    outstanding,
    overdue,
    invoiceCount: invoices.length,
    byStatus,
    topClients,
  };
}

export type MonthBar = {
  key: string;
  label: string;
  collected: number;
};

/** Last `count` calendar months of collections (oldest → newest). */
export function monthlyCollected(
  invoices: Invoice[],
  count = 6,
  now = new Date(),
): MonthBar[] {
  const buckets: MonthBar[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const monthDate = startOfMonth(subMonths(now, i));
    buckets.push({
      key: format(monthDate, 'yyyy-MM'),
      label: format(monthDate, 'MMM'),
      collected: 0,
    });
  }
  const index = new Map(buckets.map((b, i) => [b.key, i]));
  for (const invoice of invoices) {
    try {
      const key = format(parseISO(invoice.issueDate), 'yyyy-MM');
      const at = index.get(key);
      if (at !== undefined) buckets[at].collected += invoice.paid;
    } catch {
      // skip bad dates
    }
  }
  return buckets;
}
