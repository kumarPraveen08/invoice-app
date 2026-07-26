import { Screen } from '@/shared/design-system';
import { EmptyState, FloatingAddButton } from '@/shared/ui';

export default function EstimatesScreen() {
  const onCreate = () => {
    // TODO: navigate to create estimate
  };

  return (
    <Screen>
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
    </Screen>
  );
}
