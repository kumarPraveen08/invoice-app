import { Host, LoadingIndicator } from '@expo/ui/jetpack-compose';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '@/shared/design-system';

/** Lightweight placeholder while a route's content mounts. */
export function ScreenLoading() {
  const { colors } = useTheme();

  return (
    <View style={styles.center} accessibilityLabel="Loading">
      {Platform.OS === 'android' ? (
        <Host matchContents>
          <LoadingIndicator color={colors.primary} />
        </Host>
      ) : (
        <ActivityIndicator color={colors.primary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
