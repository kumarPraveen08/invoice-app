import { CURRENCIES, DATE_FORMATS, TIME_FORMATS } from '../constants';
import { SettingsField } from '../components/SettingsField';
import { SettingsScroll } from '../components/SettingsScroll';
import { SettingsSelect } from '../components/SettingsSelect';
import { useSettingsStore } from '../store';
import type { DateFormat, TimeFormat } from '../types';

export function PreferencesScreen() {
  const preferences = useSettingsStore((s) => s.preferences);
  const updatePreferences = useSettingsStore((s) => s.updatePreferences);

  return (
    <SettingsScroll>
      <SettingsSelect
        label="Currency"
        value={preferences.currency}
        options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
        onChange={(currency) => updatePreferences({ currency })}
      />
      <SettingsField
        label="Default tax rate (%)"
        value={preferences.taxRate}
        onChangeText={(taxRate) => updatePreferences({ taxRate })}
        placeholder="18"
        keyboardType="decimal-pad"
      />
      <SettingsSelect
        label="Date format"
        value={preferences.dateFormat}
        options={DATE_FORMATS}
        onChange={(dateFormat: DateFormat) => updatePreferences({ dateFormat })}
      />
      <SettingsSelect
        label="Time format"
        value={preferences.timeFormat}
        options={TIME_FORMATS}
        onChange={(timeFormat: TimeFormat) => updatePreferences({ timeFormat })}
      />
      <SettingsField
        label="Invoice number prefix"
        value={preferences.invoicePrefix}
        onChangeText={(invoicePrefix) => updatePreferences({ invoicePrefix })}
        placeholder="INV-"
        autoCapitalize="characters"
      />
      <SettingsField
        label="Next invoice number"
        value={preferences.invoiceNextNumber}
        onChangeText={(invoiceNextNumber) =>
          updatePreferences({ invoiceNextNumber })
        }
        placeholder="1001"
        keyboardType="number-pad"
      />
    </SettingsScroll>
  );
}
