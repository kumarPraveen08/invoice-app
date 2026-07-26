import { Screen } from '@/shared/design-system';
import { EmptyState, FloatingAddButton } from '@/shared/ui';

export default function InvoicesScreen() {
  const onCreate = () => {
    // TODO: navigate to create invoice
  };

  return (
    <Screen>
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
    </Screen>
  );
}
