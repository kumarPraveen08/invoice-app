import { Linking, Platform, Share } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { CURRENCIES } from '../constants';
import { SettingsGroup, SettingsRow } from '../components/SettingsList';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';
import { useCatalogueStore } from '@/features/catalogue/store';
import { useClientsStore } from '@/features/customers/store';
import { useInvoicesStore } from '@/features/invoices/store';
import { shareTextFile } from '@/shared/lib/files';
import { showSnackbar } from '@/shared/ui';

type Props = {
  withTabBar?: boolean;
};

const SUPPORT_EMAIL = 'support@invoiceapp.example';
const APP_NAME = 'Invoice App';

function appVersion(): string {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const build =
    Constants.nativeBuildVersion ??
    Constants.expoConfig?.android?.versionCode?.toString() ??
    Constants.expoConfig?.ios?.buildNumber;
  return build ? `${version} (${build})` : version;
}

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
          appearance: useSettingsStore.getState().appearance,
          invoiceTemplates: useSettingsStore.getState().invoiceTemplates,
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
      showSnackbar(
        error instanceof Error ? error.message : 'Backup failed.',
      );
    }
  };

  const contactSupport = async () => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${APP_NAME} support`)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      showSnackbar(`Email us at ${SUPPORT_EMAIL}`);
      return;
    }
    await Linking.openURL(url);
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: `Try ${APP_NAME} — create invoices on the go.`,
      });
    } catch {
      // user cancelled
    }
  };

  const rateApp = () => {
    showSnackbar(
      Platform.select({
        ios: 'App Store rating opens after publish.',
        android: 'Play Store rating opens after publish.',
        default: 'Store rating available after release.',
      }) ?? 'Store rating available after release.',
    );
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
          icon="color-palette-outline"
          title="Appearance"
          subtitle="Theme mode and accent color"
          onPress={() => router.push('/settings/appearance')}
        />
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
        />
        <SettingsRow
          icon="newspaper-outline"
          title="Invoice templates"
          subtitle="Predesigned layouts and custom designs"
          onPress={() => router.push('/settings/invoice-template')}
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Subscription">
        <SettingsRow
          icon="diamond-outline"
          title="Plan & upgrades"
          subtitle="Free · In-app purchases coming soon"
          onPress={() => router.push('/settings/subscription')}
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

      <SettingsGroup title="Support">
        <SettingsRow
          icon="mail-outline"
          title="Contact support"
          subtitle={SUPPORT_EMAIL}
          onPress={() => {
            void contactSupport();
          }}
        />
        <SettingsRow
          icon="share-outline"
          title="Share app"
          onPress={() => {
            void shareApp();
          }}
        />
        <SettingsRow
          icon="star-outline"
          title="Rate app"
          onPress={rateApp}
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Legal">
        <SettingsRow
          icon="shield-checkmark-outline"
          title="Privacy policy"
          onPress={() =>
            router.push({
              pathname: '/settings/legal',
              params: { kind: 'privacy' },
            })
          }
        />
        <SettingsRow
          icon="reader-outline"
          title="Terms of use"
          onPress={() =>
            router.push({
              pathname: '/settings/legal',
              params: { kind: 'terms' },
            })
          }
          last
        />
      </SettingsGroup>

      <SettingsGroup title="About">
        <SettingsRow
          icon="information-circle-outline"
          title="Version"
          subtitle={appVersion()}
          showChevron={false}
          last
        />
      </SettingsGroup>
    </SettingsScroll>
  );
}
