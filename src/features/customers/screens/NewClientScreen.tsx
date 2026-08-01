import { Screen, Text, useTheme } from '@/shared/design-system';

export default function NewClientScreen() {
  const { space } = useTheme();

  return (
    <Screen style={{ padding: space.lg }}>
      <Text variant="body" muted>
        Client form will go here.
      </Text>
    </Screen>
  );
}
