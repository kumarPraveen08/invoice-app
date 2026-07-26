import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { colors } from '@/shared/constants';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: theme.iconBg }]}>
        <Ionicons name={icon} size={36} color={theme.primary} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textMuted }]}>
        {description}
      </Text>
      <Pressable
        onPress={onAction}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.primary,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
      >
        <Ionicons name="add" size={18} color={theme.primaryContrast} />
        <Text style={[styles.buttonLabel, { color: theme.primaryContrast }]}>
          {actionLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 96,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
