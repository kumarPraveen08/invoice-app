import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme, type IconName } from '@/shared/design-system';
import { BottomSheet } from './BottomSheet';

export type SheetAction = {
  key: string;
  label: string;
  icon?: IconName;
  destructive?: boolean;
  disabled?: boolean;
  badge?: string;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  actions: SheetAction[];
};

/** Long-press / overflow actions in a bottom sheet. */
export function ActionSheet({ visible, onClose, title, actions }: Props) {
  const { colors, radii, space } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={{ gap: space.xs }}>
        {actions.map((action) => {
          const muted = action.disabled;
          const tint = action.destructive
            ? '#B3261E'
            : muted
              ? colors.onSurfaceMuted
              : colors.onSurface;

          return (
            <Pressable
              key={action.key}
              accessibilityRole="button"
              accessibilityState={{ disabled: Boolean(action.disabled) }}
              disabled={action.disabled}
              onPress={() => {
                if (action.disabled) return;
                onClose();
                action.onPress();
              }}
              style={({ pressed }) => [
                styles.row,
                {
                  paddingVertical: space.md,
                  opacity: muted ? 0.55 : pressed ? 0.7 : 1,
                },
              ]}
            >
              {action.icon ? (
                <Icon
                  name={action.icon}
                  size={22}
                  color={tint}
                  style={{ marginRight: space.md }}
                />
              ) : null}
              <Text
                variant="body"
                style={{
                  flex: 1,
                  fontWeight: '600',
                  color: tint,
                }}
              >
                {action.label}
              </Text>
              {action.badge ? (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.iconSoft,
                      borderRadius: radii.full,
                      paddingHorizontal: space.sm,
                      paddingVertical: 4,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: colors.primary,
                      fontWeight: '700',
                      fontSize: 11,
                    }}
                  >
                    {action.badge}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: 8,
  },
});
