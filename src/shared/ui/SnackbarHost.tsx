import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, applyElevation, useTheme } from '@/shared/design-system';
import { useSnackbarStore } from './snackbarStore';

/**
 * Material Design 3 snackbar host — single floating bar, optional one action.
 * Mount once near the app root.
 */
export function SnackbarHost() {
  const { colors, radii, space } = useTheme();
  const insets = useSafeAreaInsets();
  const current = useSnackbarStore((s) => s.current);
  const hide = useSnackbarStore((s) => s.hide);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!current) return;
    timer.current = setTimeout(() => hide(), current.duration ?? 4000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [current, hide]);

  if (!current) return null;

  // M3 inverse-surface treatment on light/dark surfaces.
  const containerBg = colors.onSurface;
  const labelColor = colors.surface;
  const actionColor = colors.primary;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          paddingBottom: Math.max(insets.bottom, space.md) + space.sm,
          paddingHorizontal: space.md,
        },
      ]}
    >
      <View
        style={[
          styles.bar,
          applyElevation('md', colors.shadow),
          {
            backgroundColor: containerBg,
            borderRadius: radii.md,
            paddingVertical: space.md,
            paddingHorizontal: space.lg,
          },
        ]}
      >
        <Text
          variant="body"
          style={{ color: labelColor, flex: 1, marginRight: space.sm }}
          numberOfLines={2}
        >
          {current.message}
        </Text>
        {current.action ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              const action = current.action;
              hide();
              action?.onPress();
            }}
            hitSlop={8}
            style={{ paddingVertical: 4, paddingHorizontal: 4 }}
          >
            <Text
              variant="label"
              style={{
                color: actionColor,
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {current.action.label}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 1000,
    elevation: 1000,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
});
