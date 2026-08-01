import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { showSnackbar } from '@/shared/ui';
import { SettingsField } from '../components/SettingsField';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';

export function BrandingScreen() {
  const { colors, space } = useTheme();
  const branding = useSettingsStore((s) => s.branding);
  const updateBranding = useSettingsStore((s) => s.updateBranding);

  const stubUpload = (kind: 'logo' | 'signature') => {
    showSnackbar(
      kind === 'logo'
        ? 'Logo picker coming in a follow-up build.'
        : 'Signature picker coming in a follow-up build.',
    );
  };

  return (
    <SettingsScroll>
      <AssetRow
        label="Business logo"
        value={branding.logoUri ? 'Uploaded' : 'None'}
        action={branding.logoUri ? 'Replace' : 'Add'}
        onPress={() => stubUpload('logo')}
        onClear={
          branding.logoUri
            ? () => updateBranding({ logoUri: null })
            : undefined
        }
      />
      <AssetRow
        label="Authorized signature"
        value={branding.signatureUri ? 'Uploaded' : 'None'}
        action={branding.signatureUri ? 'Replace' : 'Add'}
        onPress={() => stubUpload('signature')}
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
}: {
  label: string;
  value: string;
  action: string;
  onPress: () => void;
  onClear?: () => void;
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
});
