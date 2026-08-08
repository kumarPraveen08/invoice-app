import { Image, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Text, useTheme } from '@/shared/design-system';
import { showSnackbar } from '@/shared/ui';
import { SettingsField } from '../components/SettingsField';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';

export function BrandingScreen() {
  const { colors, space } = useTheme();
  const branding = useSettingsStore((s) => s.branding);
  const updateBranding = useSettingsStore((s) => s.updateBranding);

  const pickLogo = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showSnackbar(
          'Allow photo access in Settings to add a business logo.',
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]?.uri) return;
      updateBranding({ logoUri: result.assets[0].uri });
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Could not open photos.',
      );
    }
  };

  return (
    <SettingsScroll>
      <AssetRow
        label="Business logo"
        value={branding.logoUri ? 'Uploaded' : 'None'}
        action={branding.logoUri ? 'Replace' : 'Add'}
        onPress={pickLogo}
        previewUri={branding.logoUri}
        onClear={
          branding.logoUri
            ? () => updateBranding({ logoUri: null })
            : undefined
        }
      />
      <AssetRow
        label="Authorized signature"
        value={branding.signatureUri ? 'Saved' : 'None'}
        action={branding.signatureUri ? 'Redraw' : 'Draw'}
        onPress={() => router.push('/settings/signature')}
        previewUri={branding.signatureUri}
        tintPreview
        onClear={
          branding.signatureUri
            ? () => updateBranding({ signatureUri: null })
            : undefined
        }
      />
      <View style={{ height: space.md }} />
      <SettingsField
        label="Signature name"
        value={branding.signatureName}
        onChangeText={(signatureName) => updateBranding({ signatureName })}
        placeholder="Authorized signatory"
        autoCapitalize="words"
      />
    </SettingsScroll>
  );
}

function AssetRow({
  label,
  value,
  action,
  onPress,
  onClear,
  previewUri,
  tintPreview = false,
}: {
  label: string;
  value: string;
  action: string;
  onPress: () => void;
  onClear?: () => void;
  previewUri?: string | null;
  /** Signatures are ink strokes — tint to onSurface. Logos keep original colors. */
  tintPreview?: boolean;
}) {
  const { colors, space } = useTheme();

  return (
    <View
      style={[
        styles.asset,
        {
          marginBottom: space.xl,
          borderBottomColor: colors.onSurfaceMuted,
          paddingBottom: space.md,
        },
      ]}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="caption" muted>
          {label}
        </Text>
        <Text variant="body">{value}</Text>
        {previewUri ? (
          <Image
            source={{ uri: previewUri }}
            style={tintPreview ? styles.signaturePreview : styles.logoPreview}
            resizeMode="contain"
            tintColor={tintPreview ? colors.onSurface : undefined}
          />
        ) : null}
      </View>
      <View style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
        {onClear ? (
          <Pressable onPress={onClear} hitSlop={8}>
            <Text variant="body" style={{ color: colors.onSurfaceMuted }}>
              Remove
            </Text>
          </Pressable>
        ) : null}
        <Pressable onPress={onPress} hitSlop={8}>
          <Text variant="body" style={{ color: colors.primary, fontWeight: '600' }}>
            {action}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  asset: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logoPreview: {
    width: 64,
    height: 64,
    marginTop: 8,
    borderRadius: 8,
  },
  signaturePreview: {
    width: 120,
    height: 48,
    marginTop: 8,
  },
});
