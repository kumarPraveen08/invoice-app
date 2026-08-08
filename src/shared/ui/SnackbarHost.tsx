import { useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSegments } from 'expo-router';
import {
  Box,
  Host,
  Snackbar,
  SnackbarHost as ComposeSnackbarHost,
  type SnackbarHostRef,
} from '@expo/ui/jetpack-compose';
import {
  align,
  fillMaxSize,
  fillMaxWidth,
} from '@expo/ui/jetpack-compose/modifiers';
import { Text, applyElevation, useTheme } from '@/shared/design-system';
import {
  bindAndroidSnackbarHost,
  useSnackbarStore,
} from './snackbarStore';
import { useTabBarVisibility } from './tabBarVisibility';

/** Height of the Compose strip that anchors the snackbar. */
const STRIP_HEIGHT = 72;

/**
 * App-root snackbar host.
 * Android: Expo UI Material 3 SnackbarHost in a bottom strip.
 * Clears the floating tab bar only while tabs are focused; stack screens
 * (new client, branding, etc.) hug the safe area.
 * iOS: RN fallback bar (same clearance rules).
 */
export function SnackbarHost() {
  if (Platform.OS === 'android') {
    return <AndroidSnackbarHost />;
  }
  return <IosSnackbarHost />;
}

function useSnackbarBottomPad() {
  const { layout, space } = useTheme();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const present = useTabBarVisibility((s) => s.present);
  const hidden = useTabBarVisibility((s) => s.hidden);
  // Tabs stay mounted under stack pushes — only clear when tabs are focused.
  const onTabs = segments[0] === '(tabs)';

  if (onTabs && present && !hidden) {
    return (
      Math.max(insets.bottom, layout.tabBar.marginBottom) +
      5 +
      Math.max(layout.tabBar.height, layout.fab.size) +
      8
    );
  }

  return Math.max(insets.bottom, space.md) + space.sm;
}

function AndroidSnackbarHost() {
  const { colors, layout } = useTheme();
  const hostRef = useRef<SnackbarHostRef>(null);
  const visible = useSnackbarStore((s) => s.androidVisible);
  const bottom = useSnackbarBottomPad();

  useEffect(() => {
    bindAndroidSnackbarHost(hostRef.current);
    return () => bindAndroidSnackbarHost(null);
  }, []);

  return (
    <View
      pointerEvents={visible ? 'box-none' : 'none'}
      style={[
        styles.strip,
        {
          bottom,
          height: STRIP_HEIGHT,
          paddingHorizontal: layout.tabBar.marginHorizontal,
        },
      ]}
    >
      <Host style={styles.stripHost} pointerEvents="box-none">
        <Box modifiers={[fillMaxSize()]}>
          <Box modifiers={[align('bottomCenter'), fillMaxWidth()]}>
            <ComposeSnackbarHost
              ref={(ref) => {
                hostRef.current = ref;
                bindAndroidSnackbarHost(ref);
              }}
            >
              <Snackbar
                containerColor={colors.onSurface}
                contentColor={colors.surface}
                actionContentColor={colors.primary}
                dismissActionContentColor={colors.surface}
              />
            </ComposeSnackbarHost>
          </Box>
        </Box>
      </Host>
    </View>
  );
}

function IosSnackbarHost() {
  const { colors, radii, space } = useTheme();
  const current = useSnackbarStore((s) => s.current);
  const hide = useSnackbarStore((s) => s.hide);
  const bottom = useSnackbarBottomPad();
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

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.iosDock,
        {
          paddingBottom: bottom,
          paddingHorizontal: space.md,
        },
      ]}
    >
      <View
        style={[
          styles.bar,
          applyElevation('md', colors.shadow),
          {
            backgroundColor: colors.onSurface,
            borderRadius: radii.md,
            paddingVertical: space.md,
            paddingHorizontal: space.lg,
          },
        ]}
      >
        <Text
          variant="body"
          style={{ color: colors.surface, flex: 1, marginRight: space.sm }}
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
                color: colors.primary,
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
  strip: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  stripHost: {
    flex: 1,
    width: '100%',
  },
  iosDock: {
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
