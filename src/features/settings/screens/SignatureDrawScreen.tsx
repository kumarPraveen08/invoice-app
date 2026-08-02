import { useRef, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SignatureCanvas, {
  type SignatureViewRef,
} from 'react-native-signature-canvas';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { showSnackbar } from '@/shared/ui';
import { useSettingsStore } from '../store';

const TRANSPARENT = 'rgba(255,255,255,0)';
const INK = '#111111';
const PAD_BG = '#FFFFFF';
const SCREEN_W = Dimensions.get('window').width;

export function SignatureDrawScreen() {
  const { colors, space } = useTheme();
  const insets = useSafeAreaInsets();
  const updateBranding = useSettingsStore((s) => s.updateBranding);
  const existing = useSettingsStore((s) => s.branding.signatureUri);
  const ref = useRef<SignatureViewRef>(null);
  const [busy, setBusy] = useState(false);

  const padWidth = SCREEN_W - space.lg * 2;
  const padHeight = Math.min(padWidth * 0.55, 240);

  const webStyle = `
    .m-signature-pad { box-shadow: none; border: none; margin: 0; background-color: transparent; }
    .m-signature-pad--body { border: none; background-color: transparent; }
    .m-signature-pad--body canvas { background-color: transparent; }
    .m-signature-pad--footer { display: none; margin: 0; }
    body,html { margin: 0; background: transparent; }
  `;

  const onOK = (signature: string) => {
    setBusy(false);
    updateBranding({ signatureUri: signature });
    showSnackbar('Signature saved');
    router.back();
  };

  const onEmpty = () => {
    setBusy(false);
    showSnackbar('Draw a signature first');
  };

  return (
    <Screen>
      <View
        style={[
          styles.body,
          {
            paddingHorizontal: space.lg,
            paddingBottom: Math.max(insets.bottom, space.lg),
            gap: space.md,
          },
        ]}
      >
        <Text variant="body" muted>
          Sign on the white pad. Ink is saved without a background — app
          previews follow your theme; invoices stay dark ink on paper.
        </Text>

        {existing ? (
          <View
            style={[styles.preview, { borderColor: colors.onSurfaceMuted }]}
          >
            <Image
              source={{ uri: existing }}
              style={styles.previewImage}
              resizeMode="contain"
              tintColor={colors.onSurface}
            />
          </View>
        ) : null}

        <View
          style={[
            styles.pad,
            {
              width: padWidth,
              height: padHeight,
              borderColor: colors.onSurfaceMuted,
              backgroundColor: PAD_BG,
            },
          ]}
        >
          <SignatureCanvas
            ref={ref}
            onOK={onOK}
            onEmpty={onEmpty}
            autoClear={false}
            descriptionText=""
            webStyle={webStyle}
            backgroundColor={TRANSPARENT}
            penColor={INK}
            imageType="image/png"
            trimWhitespace
            nestedScrollEnabled
            style={styles.canvas}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: space.sm }}>
          <IconBtn
            label="Undo"
            icon="arrow-undo-outline"
            color={colors.primary}
            background={colors.iconSoft}
            onPress={() => ref.current?.undo()}
          />
          <IconBtn
            label="Redo"
            icon="arrow-redo-outline"
            color={colors.primary}
            background={colors.iconSoft}
            onPress={() => ref.current?.redo()}
          />
          <IconBtn
            label="Clear"
            icon="trash-outline"
            color={colors.primary}
            background={colors.iconSoft}
            onPress={() => ref.current?.clearSignature()}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={() => {
            setBusy(true);
            ref.current?.readSignature();
          }}
          style={({ pressed }) => [
            styles.save,
            {
              backgroundColor: colors.primary,
              opacity: busy ? 0.5 : pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text
            style={{
              color: colors.onPrimary,
              fontWeight: '700',
              fontSize: 17,
            }}
          >
            Save
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

function IconBtn({
  label,
  icon,
  color,
  background,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: background, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Ionicons name={icon} size={20} color={color} />
      <Text style={{ color, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 8,
  },
  preview: {
    height: 72,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  previewImage: {
    width: '80%',
    height: '100%',
  },
  pad: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  iconBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  save: {
    minHeight: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
