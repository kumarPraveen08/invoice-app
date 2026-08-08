import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {Icon, Text, useTheme} from '@/shared/design-system';
import { BottomSheet } from '@/shared/ui';

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
};

export function SettingsSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  const { colors, space } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value)?.label ?? value;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.row,
          {
            marginBottom: space.xl,
            borderBottomColor: colors.onSurfaceMuted,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={styles.copy}>
          <Text variant="caption" muted style={styles.label}>
            {label}
          </Text>
          <Text variant="body" style={{ color: colors.onSurface }}>
            {selected}
          </Text>
        </View>
        <Icon name="expand-more" size={18} color={colors.onSurfaceMuted} />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)} title={label}>
        <ScrollView
          style={{ maxHeight: 360 }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.option,
                  {
                    paddingVertical: space.md,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  variant="body"
                  style={{
                    flex: 1,
                    fontWeight: isSelected ? '600' : '400',
                    color: colors.onSurface,
                  }}
                >
                  {option.label}
                </Text>
                {isSelected ? (
                  <Icon name="check" size={20} color={colors.primary} />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  label: {
    letterSpacing: 0.2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
