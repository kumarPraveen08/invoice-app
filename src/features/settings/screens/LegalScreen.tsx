import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import { SettingsScroll } from '../components/SettingsScroll';

const COPY = {
  privacy: {
    title: 'Privacy policy',
    body: [
      'Invoice App stores your business data on this device (settings, invoices, clients, and catalogue).',
      'We do not sell your personal information. Backups you export are shared only when you choose to save or send them.',
      'If you import contacts, access is used only to fill client details and is not uploaded by us.',
      'When cloud sync or online payments are added, this policy will be updated before those features go live.',
      'Contact support from Settings if you have privacy questions.',
    ],
  },
  terms: {
    title: 'Terms of use',
    body: [
      'Invoice App is provided as-is for creating and managing business invoices on your device.',
      'You are responsible for the accuracy of invoices, tax calculations, and records you create.',
      'Subscription features and limits may change. Paid plans, when available, renew according to the store account rules.',
      'Do not misuse the app for fraud or unlawful activity.',
      'Continued use means you accept these terms. Contact support from Settings for questions.',
    ],
  },
} as const;

type Kind = keyof typeof COPY;

export function LegalScreen() {
  const { space } = useTheme();
  const navigation = useNavigation();
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  const page = COPY[(kind as Kind) in COPY ? (kind as Kind) : 'privacy'];

  useEffect(() => {
    navigation.setOptions({ title: page.title });
  }, [navigation, page.title]);

  return (
    <SettingsScroll>
      {page.body.map((paragraph) => (
        <Text
          key={paragraph}
          variant="body"
          style={{ marginBottom: space.lg, lineHeight: 24 }}
        >
          {paragraph}
        </Text>
      ))}
    </SettingsScroll>
  );
}
