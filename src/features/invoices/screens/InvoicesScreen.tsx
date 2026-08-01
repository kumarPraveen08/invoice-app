import { Screen } from '@/shared/design-system';
import { EmptyState } from '@/shared/ui';

export default function InvoicesScreen() {
  return (
    <Screen>
      <EmptyState
        icon="receipt-outline"
        title="No invoices yet"
        description="Create your first invoice to bill clients and track payments."
      />
    </Screen>
  );
}
