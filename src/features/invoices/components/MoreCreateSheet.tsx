import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Text, useTheme } from '@/shared/design-system';
import { BottomSheet } from '@/shared/ui';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function MoreCreateSheet({ visible, onClose }: Props) {
  const { space } = useTheme();

  const go = (path: '/invoice/new' | '/catalogue/new' | '/clients/new') => {
    onClose();
    router.push(path);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Create">
      <Text variant="body" muted style={styles.description}>
        Choose what you want to add.
      </Text>
      <View style={{ gap: space.md }}>
        <Button
          label="Invoice"
          icon="receipt-outline"
          onPress={() => go('/invoice/new')}
        />
        <Button
          label="Catalogue item"
          icon="grid-outline"
          onPress={() => go('/catalogue/new')}
        />
        <Button
          label="Client"
          icon="person-add-outline"
          onPress={() => go('/clients/new')}
        />
        <Button label="Cancel" variant="ghost" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
  },
});
