import { Image, StyleSheet, View } from 'react-native';
import { Text, THEME_SEEDS, useTheme } from '@/shared/design-system';

type Props = {
  name: string;
  imageUri?: string | null;
  size?: number;
};

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function initialOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed.charAt(0).toUpperCase();
}

/** Letter avatar from theme seed palette, or profile image when set. */
export function ClientAvatar({ name, imageUri, size = 40 }: Props) {
  const { colors, mode, radii } = useTheme();
  const seed = THEME_SEEDS[hashName(name) % THEME_SEEDS.length];
  const roles = mode === 'dark' ? seed.dark : seed.light;

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        accessibilityLabel={`${name} photo`}
        style={{
          width: size,
          height: size,
          borderRadius: radii.full,
          backgroundColor: colors.iconSoft,
        }}
      />
    );
  }

  return (
    <View
      accessibilityLabel={`${name} avatar`}
      style={[
        styles.letter,
        {
          width: size,
          height: size,
          borderRadius: radii.full,
          backgroundColor: roles.container,
        },
      ]}
    >
      <Text
        variant="body"
        style={{
          color: roles.primary,
          fontWeight: '700',
          fontSize: size * 0.4,
          lineHeight: size * 0.45,
        }}
      >
        {initialOf(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  letter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
