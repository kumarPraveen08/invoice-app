import {
  endOfMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subDays,
} from 'date-fns';
import { outstandingOf, STATUS_LABEL } from '@/features/invoices/constants';
import type { Invoice, InvoiceStatus } from '@/features/invoices/types';

export type ReportPeriod = 'month' | '30d' | 'all';

export const REPORT_PERIODS: { id: ReportPeriod; label: string }[] = [
  { id: 'month', label: 'This month' },
  { id: '30d', label: '30 days' },
  { id: 'all', label: 'All time' },
];

const CLOSED = new Set<InvoiceStatus>(['cancelled', 'void', 'draft']);

export function invoicesInPeriod(
  invoices: Invoice[],
  period: ReportPeriod,
  now = new Date(),
): Invoice[] {
  if (period === 'all') return invoices;
  const end = now;
  const start =
    period === 'month' ? startOfMonth(now) : subDays(now, 30);
  const rangeEnd = period === 'month' ? endOfMonth(now) : end;
  return invoices.filter((invoice) => {
    try {
      return isWithinInterval(parseISO(invoice.issueDate), {
        start,
        end: rangeEnd,
      });
    } catch {
      return false;
    }
  });
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
