export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'opened'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'void';

export type Invoice = {
  id: string;
  number: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  total: number;
  paid: number;
  status: InvoiceStatus;
};

export type InvoiceFilter =
  | 'all'
  | 'draft'
  | 'unpaid'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'void';
