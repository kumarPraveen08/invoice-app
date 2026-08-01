import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { BottomSheet } from './BottomSheet';

export type SheetAction = {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
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
  const { colors, space } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={{ gap: space.xs }}>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            accessibilityRole="button"
            onPress={() => {
              onClose();
              action.onPress();
            }}
            style={({ pressed }) => [
              styles.row,
              {
                paddingVertical: space.md,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            {action.icon ? (
              <Ionicons
                name={action.icon}
                size={22}
                color={action.destructive ? '#B3261E' : colors.onSurface}
                style={{ marginRight: space.md }}
              />
            ) : null}
            <Text
              variant="body"
              style={{
                flex: 1,
                fontWeight: '600',
                color: action.destructive ? '#B3261E' : colors.onSurface,
              }}
            >
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
