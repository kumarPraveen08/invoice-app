import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { BottomSheet as ExpoBottomSheet, RNHostView } from '@expo/ui';
import {
  Column,
  Host,
  ModalBottomSheet,
  RNHostView as ComposeRNHostView,
  type ModalBottomSheetRef,
} from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';
import { Text, useTheme } from '@/shared/design-system';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  /** Extra context under the title (e.g. list-item details). */
  subtitle?: string;
  children: ReactNode;
  /** Stretch sheet toward full screen (e.g. search focused). */
  expanded?: boolean;
};

function SheetBody({
  title,
  subtitle,
  children,
  expanded,
  width,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  expanded: boolean;
  width: number;
}) {
  return (
    <View
      style={[
        { width, paddingHorizontal: 16, paddingBottom: 16 },
        expanded ? styles.bodyExpanded : null,
      ]}
    >
      <View style={styles.header}>
        <Text variant="subtitle">{title}</Text>
        {subtitle ? (
          <Text variant="caption" muted style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={expanded ? styles.bodyExpanded : undefined}>{children}</View>
    </View>
  );
}

/** Android: full-width + matchContents so height follows RN content. */
function AndroidBottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  expanded,
}: Props & { expanded: boolean }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const [mount, setMount] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMount(true);
      return;
    }
    let cancelled = false;
    sheetRef.current?.hide().then(() => {
      if (!cancelled) setMount(false);
    });
    return () => {
      cancelled = true;
    };
  }, [visible]);

  if (!mount) return null;

  return (
    <Host style={styles.host} pointerEvents="none">
      <ModalBottomSheet
        ref={sheetRef}
        onDismissRequest={onClose}
        skipPartiallyExpanded
        showDragHandle
        containerColor={colors.surface}
      >
        <Column modifiers={[fillMaxWidth()]}>
          <ComposeRNHostView matchContents>
            <SheetBody
              title={title}
              subtitle={subtitle}
              expanded={expanded}
              width={width}
            >
              {children}
            </SheetBody>
          </ComposeRNHostView>
        </Column>
      </ModalBottomSheet>
    </Host>
  );
}

/** App sheet over Expo UI BottomSheet — drag to dismiss, no close icon. */
export function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  expanded = false,
}: Props) {
  const { width } = useWindowDimensions();

  if (Platform.OS === 'android') {
    return (
      <AndroidBottomSheet
        visible={visible}
        onClose={onClose}
        title={title}
        subtitle={subtitle}
        expanded={expanded}
      >
        {children}
      </AndroidBottomSheet>
    );
  }

  return (
    <ExpoBottomSheet
      isPresented={visible}
      onDismiss={onClose}
      snapPoints={expanded ? ['full'] : undefined}
    >
      <RNHostView matchContents={!expanded}>
        <SheetBody
          title={title}
          subtitle={subtitle}
          expanded={expanded}
          width={width}
        >
          {children}
        </SheetBody>
      </RNHostView>
    </ExpoBottomSheet>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
  },
  bodyExpanded: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    marginBottom: 16,
    gap: 4,
  },
  subtitle: {
    marginTop: 2,
  },
});
