import type { ReactNode } from 'react';
import { useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text, useTheme } from '@/shared/design-system';

const ACTION_WIDTH = 72;
const ACTIONS_WIDTH = ACTION_WIDTH * 2;
const OPEN_THRESHOLD = 48;

type Props = {
  children: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Swipe left to reveal Edit / Delete. */
export function SwipeableRow({ children, onEdit, onDelete, style }: Props) {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const offset = useRef(0);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        translateX.stopAnimation((value) => {
          offset.current = value;
        });
      },
      onPanResponderMove: (_, g) => {
        const next = Math.min(0, Math.max(-ACTIONS_WIDTH, offset.current + g.dx));
        translateX.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const shouldOpen =
          g.dx < -OPEN_THRESHOLD || offset.current + g.dx < -ACTIONS_WIDTH / 2;
        const toValue = shouldOpen ? -ACTIONS_WIDTH : 0;
        offset.current = toValue;
        Animated.spring(translateX, {
          toValue,
          useNativeDriver: true,
          bounciness: 0,
          speed: 20,
        }).start();
      },
    }),
  ).current;

  const close = () => {
    offset.current = 0;
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  };

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit"
          onPress={() => {
            close();
            onEdit();
          }}
          style={[styles.action, { backgroundColor: colors.primary }]}
        >
          <Text variant="label" style={{ color: colors.onPrimary }}>
            Edit
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete"
          onPress={() => {
            close();
            onDelete();
          }}
          style={[styles.action, { backgroundColor: '#B3261E' }]}
        >
          <Text variant="label" style={{ color: '#FFFFFF' }}>
            Delete
          </Text>
        </Pressable>
      </View>
      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...pan.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  actions: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  action: {
    width: ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
