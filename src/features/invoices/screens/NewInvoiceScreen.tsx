import { Screen, Text, useTheme } from '@/shared/design-system';

export default function NewInvoiceScreen() {
  const { space } = useTheme();

  return (
    <Screen style={{ padding: space.lg }}>
      <Text variant="body" muted>
        Invoice form will go here.
      </Text>
    </Screen>
  );
}
