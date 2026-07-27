import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from '@/shared/design-system';
import { BottomSheet } from '@/shared/ui';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function CreateInvoiceSheet({ visible, onClose }: Props) {
  const { space } = useTheme();

  const onStartBlank = () => {
    // TODO: navigate to blank invoice form
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Create Invoice">
      <Text variant="body" muted style={styles.description}>
        Start a new invoice for a client. You can save it as a draft and send it
        later.
      </Text>
      <View style={{ gap: space.md }}>
        <Button
          label="Start Blank Invoice"
          icon="document-text-outline"
          onPress={onStartBlank}
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
