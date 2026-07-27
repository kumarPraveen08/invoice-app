import { useState } from 'react';
import { CreateInvoiceSheet } from '@/features/invoices/components/CreateInvoiceSheet';
import { Screen } from '@/shared/design-system';
import { EmptyState, FloatingAddButton } from '@/shared/ui';

export default function InvoicesScreen() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const onCreate = () => setSheetOpen(true);

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
      <CreateInvoiceSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </Screen>
  );
}
