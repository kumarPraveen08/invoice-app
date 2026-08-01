import { Screen } from '@/shared/design-system';
import { EmptyState } from '@/shared/ui';

export default function EstimatesScreen() {
  return (
    <Screen>
      <EmptyState
        icon="document-text-outline"
        title="No estimates yet"
        description="Send quotes to clients before converting them into invoices."
        actionLabel="Create Estimate"
        onAction={() => {
          // TODO: navigate to create estimate
        }}
      />
    </Screen>
  );
}
