import { Screen, Text, useTheme } from '@/shared/design-system';

export default function NewCatalogueScreen() {
  const { space } = useTheme();

  return (
    <Screen style={{ padding: space.lg }}>
      <Text variant="body" muted>
        Catalogue item form will go here.
      </Text>
    </Screen>
  );
}
