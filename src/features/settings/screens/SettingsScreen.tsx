import { Alert } from 'react-native';
import { router } from 'expo-router';
import { CURRENCIES } from '../constants';
import { SettingsGroup, SettingsRow } from '../components/SettingsList';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';
import { useCatalogueStore } from '@/features/catalogue/store';
import { useClientsStore } from '@/features/customers/store';
import { useInvoicesStore } from '@/features/invoices/store';
import { shareTextFile } from '@/shared/lib/files';

type Props = {
  withTabBar?: boolean;
};

export function SettingsScreen({ withTabBar = false }: Props) {
  const business = useSettingsStore((s) => s.business);
  const branding = useSettingsStore((s) => s.branding);
  const preferences = useSettingsStore((s) => s.preferences);
  const bank = useSettingsStore((s) => s.bank);
  const invoiceDefaults = useSettingsStore((s) => s.invoiceDefaults);

  const currencyLabel =
    CURRENCIES.find((c) => c.code === preferences.currency)?.label ??
    preferences.currency;

  const downloadBackup = async () => {
    try {
      const payload = {
        exportedAt: new Date().toISOString(),
        app: 'invoice-app',
        version: 1,
        settings: {
          business,
          branding,
          bank,
          preferences,
          invoiceDefaults,
        },
        invoices: useInvoicesStore.getState().invoices,
        catalogue: useCatalogueStore.getState().items,
        clients: useClientsStore.getState().clients,
      };
      const stamp = new Date().toISOString().slice(0, 10);
      await shareTextFile(
        `invoice-app-backup-${stamp}.json`,
        JSON.stringify(payload, null, 2),
        'application/json',
      );
    } catch (error) {
      Alert.alert(
        'Backup failed',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  };

  return (
    <SettingsScroll withTabBar={withTabBar}>
      <SettingsGroup title="Business">
        <SettingsRow
          icon="business-outline"
          title="Business details"
          subtitle={business.name || 'Name, contact, tax, address'}
          onPress={() => router.push('/settings/business')}
        />
        <SettingsRow
          icon="create-outline"
          title="Logo & signature"
          subtitle={
            branding.signatureName || branding.signatureUri
              ? branding.signatureName || 'Signature saved'
              : 'Brand assets for invoices'
          }
          onPress={() => router.push('/settings/branding')}
        />
        <SettingsRow
          icon="card-outline"
          title="Bank & payments"
          subtitle={bank.bankName || 'Account details for invoices'}
          onPress={() => router.push('/settings/bank')}
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Preferences">
        <SettingsRow
          icon="cash-outline"
          title="Currency, tax & formats"
          subtitle={`${currencyLabel} · ${preferences.dateFormat} · ${preferences.timeFormat}`}
          onPress={() => router.push('/settings/preferences')}
        />
        <SettingsRow
          icon="document-text-outline"
          title="Invoice defaults"
          subtitle={
            invoiceDefaults.notes || invoiceDefaults.terms
              ? 'Notes and terms configured'
              : 'Default notes and terms'
          }
          onPress={() => router.push('/settings/invoice-defaults')}
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Data">
        <SettingsRow
          icon="download-outline"
          title="Download backup"
          subtitle="Settings, invoices, catalogue, and clients as JSON"
          onPress={downloadBackup}
          last
        />
      </SettingsGroup>
    </SettingsScroll>
  );
}
