import * as Sharing from 'expo-sharing';
import {
  FREE_FOOTER_COPYRIGHT,
  FREE_PLAN_BRANDING,
  findTemplate,
} from '@/features/settings/templateConstants';
import { useSettingsStore } from '@/features/settings/store';
import {
  computeInvoiceTotals,
  formatInvoiceDate,
  formatMoney,
} from './format';
import type { Invoice } from './types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildInvoicePdfHtml(
  invoice: Invoice,
  currency: string,
  templateId: string,
): string {
  const state = useSettingsStore.getState();
  const template = findTemplate(templateId, state.invoiceTemplates.customs);
  const { business, branding, bank } = state;
  const fields = template?.fields;
  const totals = computeInvoiceTotals({
    lines: invoice.lines,
    discount: invoice.discount,
    taxRate: invoice.taxRate,
    additionalCharges: invoice.additionalCharges,
  });

  const linesHtml = invoice.lines
    .map(
      (line) => `
      <tr>
        <td>${escapeHtml(line.name)}</td>
        <td style="text-align:right">${line.quantity}</td>
        <td style="text-align:right">${escapeHtml(formatMoney(line.unitPrice, currency))}</td>
        <td style="text-align:right">${escapeHtml(formatMoney(line.quantity * line.unitPrice, currency))}</td>
      </tr>`,
    )
    .join('');

  const signatureBlock =
    fields?.signature !== false && branding.signatureUri
      ? `<div style="margin-top:24px;text-align:right">
          <img src="${branding.signatureUri}" style="height:48px;width:auto" />
          <div style="font-size:11px;color:#666;margin-top:4px">${escapeHtml(branding.signatureName || 'Authorized signature')}</div>
        </div>`
      : fields?.signature !== false
        ? `<div style="margin-top:24px;text-align:right">
            <div style="border-bottom:1px solid #999;width:160px;margin-left:auto;height:40px"></div>
            <div style="font-size:11px;color:#666;margin-top:4px">${escapeHtml(branding.signatureName || 'Authorized signature')}</div>
          </div>`
        : '';

  const bankBlock =
    fields?.bankDetails !== false && (bank.bankName || bank.accountNumber)
      ? `<div style="margin-top:16px;font-size:12px">
          <strong>Payment</strong><br/>
          ${escapeHtml([bank.bankName, bank.accountName, bank.accountNumber].filter(Boolean).join(' · '))}
        </div>`
      : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    @page { margin: 28px; }
    body { font-family: Helvetica, Arial, sans-serif; color: #111; font-size: 13px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .muted { color: #666; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 8px 4px; border-bottom: 1px solid #e5e5e5; }
    th { text-align: left; font-size: 11px; color: #666; text-transform: uppercase; }
    .totals { margin-top: 16px; width: 240px; margin-left: auto; }
    .totals div { display: flex; justify-content: space-between; padding: 3px 0; }
    .totals .grand { font-weight: 700; font-size: 15px; border-top: 1px solid #111; margin-top: 6px; padding-top: 8px; }
  </style>
</head>
<body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <h1>${escapeHtml(business.name || 'Invoice')}</h1>
      <div class="muted">${escapeHtml([business.email, business.phone].filter(Boolean).join(' · '))}</div>
      ${business.address ? `<div class="muted" style="margin-top:4px;white-space:pre-line">${escapeHtml(business.address)}</div>` : ''}
    </div>
    <div style="text-align:right">
      <div style="font-size:18px;font-weight:700">INVOICE</div>
      <div class="muted">${escapeHtml(invoice.number)}</div>
    </div>
  </div>

  <div style="margin-top:24px;display:flex;justify-content:space-between">
    <div>
      <div class="muted" style="font-size:11px;text-transform:uppercase">Bill to</div>
      <div style="font-weight:600">${escapeHtml(invoice.customerName)}</div>
    </div>
    <div style="text-align:right;font-size:12px">
      <div>Issued: ${escapeHtml(formatInvoiceDate(invoice.issueDate))}</div>
      <div>Due: ${escapeHtml(formatInvoiceDate(invoice.dueDate))}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:right">Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>${linesHtml || '<tr><td colspan="4" class="muted">No line items</td></tr>'}</tbody>
  </table>

  <div class="totals">
    <div><span class="muted">Subtotal</span><span>${escapeHtml(formatMoney(totals.subtotal, currency))}</span></div>
    <div><span class="muted">Discount</span><span>${escapeHtml(formatMoney(totals.discount, currency))}</span></div>
    <div><span class="muted">Tax (${invoice.taxRate}%)</span><span>${escapeHtml(formatMoney(totals.tax, currency))}</span></div>
    <div><span class="muted">Charges</span><span>${escapeHtml(formatMoney(totals.additionalCharges, currency))}</span></div>
    <div class="grand"><span>Total</span><span>${escapeHtml(formatMoney(invoice.total, currency))}</span></div>
  </div>

  ${invoice.notes ? `<div style="margin-top:20px"><div class="muted" style="font-size:11px">Notes</div><div>${escapeHtml(invoice.notes)}</div></div>` : ''}
  ${invoice.terms ? `<div style="margin-top:12px"><div class="muted" style="font-size:11px">Terms</div><div>${escapeHtml(invoice.terms)}</div></div>` : ''}
  ${bankBlock}
  ${signatureBlock}
  ${FREE_PLAN_BRANDING ? `<div style="margin-top:32px;text-align:center;font-size:10px;color:#999">${escapeHtml(FREE_FOOTER_COPYRIGHT)}</div>` : ''}
</body>
</html>`;
}

export async function downloadInvoicePdf(
  invoice: Invoice,
  currency: string,
  templateId: string,
): Promise<void> {
  // Lazy-load so missing native ExpoPrint does not crash tab boot.
  let Print: typeof import('expo-print');
  try {
    Print = await import('expo-print');
  } catch {
    throw new Error(
      'PDF needs a native rebuild. Stop the app and run pnpm android once.',
    );
  }

  const html = buildInvoicePdfHtml(invoice, currency, templateId);
  let uri: string;
  try {
    ({ uri } = await Print.printToFileAsync({ html }));
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('ExpoPrint') || message.includes('native module')) {
      throw new Error(
        'PDF needs a native rebuild. Stop the app and run pnpm android once.',
      );
    }
    throw error;
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new Error('Sharing is not available on this device.');
  }
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: `${invoice.number}.pdf`,
    UTI: 'com.adobe.pdf',
  });
}
