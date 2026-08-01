export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'opened'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'void';

export type InvoiceLine = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  number: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  lines: InvoiceLine[];
  discount: number;
  taxRate: number;
  additionalCharges: number;
  notes: string;
  terms: string;
  paymentInstructions: string;
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
