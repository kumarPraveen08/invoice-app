import { Screen } from '@/shared/design-system';
import { EmptyState, FloatingAddButton } from '@/shared/ui';

export default function ClientsScreen() {
  const onCreate = () => {
    // TODO: navigate to add client
  };

  return (
    <Screen>
      <EmptyState
        icon="people-outline"
        title="No clients yet"
        description="Add clients so you can create invoices and estimates faster."
        actionLabel="Add Client"
        onAction={onCreate}
      />
      <FloatingAddButton
        onPress={onCreate}
        accessibilityLabel="Add client"
      />
    </Screen>
  );
}
