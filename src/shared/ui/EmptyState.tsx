import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';

type Props = {
  title: string;
  description: string;
};

/** Plain empty copy — create via FAB, not a button under the message. */
export function EmptyState({ title, description }: Props) {
  const { space } = useTheme();

  return (
    <View style={[styles.container, { paddingHorizontal: space['2xl'] }]}>
      <Text
        variant="subtitle"
        style={{ marginBottom: space.sm, textAlign: 'center' }}
      >
        {title}
      </Text>
      <Text variant="body" muted style={styles.description}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 280,
  },
});
