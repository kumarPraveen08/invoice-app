import { Screen } from '@/shared/design-system';
import { EmptyState } from '@/shared/ui';

export default function ClientsScreen() {
  return (
    <Screen>
      <EmptyState
        icon="people-outline"
        title="No clients yet"
        description="Add clients so you can create invoices and estimates faster."
        actionLabel="Add Client"
        onAction={() => {
          // TODO: navigate to add client
        }}
      />
    </Screen>
  );
}
