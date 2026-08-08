/** One-shot pick results from invoice picker screens back to NewInvoiceScreen. */

export type InvoicePickResult =
  | { type: 'client'; id: string }
  | { type: 'catalogue'; ids: string[] };

let pending: InvoicePickResult | null = null;

export function setInvoicePick(result: InvoicePickResult) {
  pending = result;
}

export function takeInvoicePick(): InvoicePickResult | null {
  const next = pending;
  pending = null;
  return next;
}
