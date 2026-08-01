import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';

type SettingsGroupProps = {
  title: string;
  children: ReactNode;
};

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  const { colors, radii, space } = useTheme();

  return (
    <View style={{ marginBottom: space['2xl'] }}>
      <Text
        variant="caption"
        muted
        style={{
          marginBottom: space.sm,
          marginLeft: space.md,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          fontWeight: '600',
        }}
      >
        {title}
      </Text>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderRadius: radii.xl,
            overflow: 'hidden',
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

type SettingsRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: ReactNode;
  showChevron?: boolean;
  last?: boolean;
};

export function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  trailing,
  showChevron = true,
  last = false,
}: SettingsRowProps) {
  const { colors, radii, space } = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          paddingHorizontal: space.lg,
          paddingVertical: space.md,
          opacity: pressed && onPress ? 0.72 : 1,
          borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.iconSoft,
            borderRadius: radii.full,
            marginRight: space.md,
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <Text variant="body" style={{ fontWeight: '600' }}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" muted numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {showChevron && onPress ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.onSurfaceMuted}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // surface card
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
});
