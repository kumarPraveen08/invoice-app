import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format, parseISO, isValid } from 'date-fns';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, useTheme } from '@/shared/design-system';

const ERROR = '#B3261E';

type Props = {
  label: string;
  value: string;
  onChange: (isoDate: string) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

function toDate(iso: string): Date {
  try {
    const parsed = parseISO(iso);
    return isValid(parsed) ? parsed : new Date();
  } catch {
    return new Date();
  }
}

function displayLabel(iso: string): string {
  try {
    const parsed = parseISO(iso);
    return isValid(parsed) ? format(parsed, 'd MMM yyyy') : iso;
  } catch {
    return iso;
  }
}

/**
 * Native date field (YYYY-MM-DD).
 * Renders the picker inline so it works inside BottomSheet/Modal.
 */
export function DateField({ label, value, onChange, error, style }: Props) {
  const { colors, space } = useTheme();
  const [open, setOpen] = useState(false);

  const onPick = (_event: DateTimePickerEvent, selected?: Date) => {
    if (!selected) return;
    onChange(format(selected, 'yyyy-MM-dd'));
    if (Platform.OS === 'android') setOpen(false);
  };

  return (
    <View style={style}>
      <Text
        variant="caption"
        muted={!error}
        style={[styles.label, error ? { color: ERROR } : null]}
      >
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen((prev) => !prev)}
        style={[
          styles.field,
          {
            borderBottomColor: error ? ERROR : colors.onSurfaceMuted,
            paddingVertical: space.sm + 2,
          },
        ]}
      >
        <Text variant="body" style={{ color: colors.onSurface, flex: 1 }}>
          {displayLabel(value)}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'calendar-outline'}
          size={18}
          color={colors.onSurfaceMuted}
        />
      </Pressable>
      {error ? (
        <Text variant="caption" style={{ color: ERROR, marginTop: 4 }}>
          {error}
        </Text>
      ) : null}

      {open ? (
        <View style={{ marginTop: space.sm }}>
          <DateTimePicker
            value={toDate(value)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={onPick}
            style={Platform.OS === 'ios' ? { alignSelf: 'center' } : undefined}
          />
          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              onPress={() => setOpen(false)}
              style={{ alignSelf: 'flex-end', paddingVertical: space.sm }}
            >
              <Text
                variant="body"
                style={{ color: colors.primary, fontWeight: '600' }}
              >
                Done
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
});
