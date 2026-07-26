import { useColorScheme, View } from 'react-native';
import { colors } from '@/shared/constants';
import { EmptyState, FloatingAddButton } from '@/shared/ui';

export default function EstimatesScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];

  const onCreate = () => {
    // TODO: navigate to create estimate
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <EmptyState
        icon="document-text-outline"
        title="No estimates yet"
        description="Send quotes to clients before converting them into invoices."
        actionLabel="Create Estimate"
        onAction={onCreate}
      />
      <FloatingAddButton
        onPress={onCreate}
        accessibilityLabel="Create estimate"
      />
    </View>
  );
}
