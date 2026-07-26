import { useColorScheme, View } from 'react-native';
import { colors } from '@/shared/constants';
import { EmptyState, FloatingAddButton } from '@/shared/ui';

export default function InvoicesScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];

  const onCreate = () => {
    // TODO: navigate to create invoice
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <EmptyState
        icon="receipt-outline"
        title="No invoices yet"
        description="Create your first invoice to bill clients and track payments."
        actionLabel="Create Invoice"
        onAction={onCreate}
      />
      <FloatingAddButton
        onPress={onCreate}
        accessibilityLabel="Create invoice"
      />
    </View>
  );
}
