import { Pressable, StyleSheet, View } from 'react-native';
import { Text, THEME_SEEDS, useTheme } from '@/shared/design-system';
import type { ThemePreference } from '@/shared/design-system/theme';
import type { ThemeSeed } from '@/shared/design-system/tokens/colors';
import { SettingsSelect } from '../components/SettingsSelect';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';

const MODE_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const SWATCH = 28;
const RING = 2;

export function AppearanceScreen() {
  const { colors, space } = useTheme();
  const appearance = useSettingsStore((s) => s.appearance);
  const updateAppearance = useSettingsStore((s) => s.updateAppearance);
  const selectedLabel =
    THEME_SEEDS.find((s) => s.id === appearance.seed)?.label ?? 'Accent';

  return (
    <SettingsScroll>
      <SettingsSelect
        label="Mode"
        value={appearance.mode}
        options={MODE_OPTIONS}
        onChange={(mode) => updateAppearance({ mode })}
      />

      <View style={{ marginBottom: space.sm }}>
        <Text variant="caption" muted style={styles.label}>
          Accent
        </Text>
        <Text variant="body" style={{ color: colors.onSurface }}>
          {selectedLabel}
        </Text>
      </View>

      <View style={[styles.row, { gap: space.md, marginTop: space.md }]}>
        {THEME_SEEDS.map((seed) => {
          const selected = appearance.seed === seed.id;
          return (
            <Pressable
              key={seed.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={seed.label}
              hitSlop={6}
              onPress={() =>
                updateAppearance({ seed: seed.id as ThemeSeed })
              }
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                padding: RING,
                borderRadius: (SWATCH + RING * 2) / 2,
                borderWidth: RING,
                borderColor: selected ? colors.onSurface : 'transparent',
              })}
            >
              <View
                style={{
                  width: SWATCH,
                  height: SWATCH,
                  borderRadius: SWATCH / 2,
                  backgroundColor: seed.light.primary,
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </SettingsScroll>
  );
}

const styles = StyleSheet.create({
  label: {
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
