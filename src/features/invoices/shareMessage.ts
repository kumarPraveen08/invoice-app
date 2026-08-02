import type { Invoice } from './types';
import { invoiceSummaryText } from './format';
import {
  FREE_FOOTER_COPYRIGHT,
  FREE_PLAN_BRANDING,
  findTemplate,
} from '@/features/settings/templateConstants';
import { useSettingsStore } from '@/features/settings/store';

export function buildInvoiceShareMessage(
  invoice: Invoice,
  currency: string,
  templateId: string,
): string {
  const customs = useSettingsStore.getState().invoiceTemplates.customs;
  const template = findTemplate(templateId, customs);
  const name = template?.name ?? 'Base';
  const body = invoiceSummaryText(invoice, currency);
  const lines = [body, '', `Template: ${name}`];
  if (FREE_PLAN_BRANDING) {
    lines.push(FREE_FOOTER_COPYRIGHT);
  }
  return lines.join('\n');
}
