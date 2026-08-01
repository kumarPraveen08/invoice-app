import { SettingsField } from '../components/SettingsField';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';

export function InvoiceDefaultsScreen() {
  const invoiceDefaults = useSettingsStore((s) => s.invoiceDefaults);
  const updateInvoiceDefaults = useSettingsStore(
    (s) => s.updateInvoiceDefaults,
  );

  return (
    <SettingsScroll>
      <SettingsField
        label="Default invoice notes"
        value={invoiceDefaults.notes}
        onChangeText={(notes) => updateInvoiceDefaults({ notes })}
        placeholder="Thank you for your business."
        multiline
      />
      <SettingsField
        label="Default terms and conditions"
        value={invoiceDefaults.terms}
        onChangeText={(terms) => updateInvoiceDefaults({ terms })}
        placeholder="Payment due within 15 days."
        multiline
      />
    </SettingsScroll>
  );
}
