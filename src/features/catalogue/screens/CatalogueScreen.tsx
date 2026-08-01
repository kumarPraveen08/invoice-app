import { Screen } from '@/shared/design-system';
import { EmptyState } from '@/shared/ui';

export default function CatalogueScreen() {
  return (
    <Screen>
      <EmptyState
        icon="grid-outline"
        title="No catalogue yet"
        description="Add products or services so you can invoice them quickly."
        actionLabel="Add item"
        onAction={() => {
          // Fab / create screen handles this
        }}
      />
    </Screen>
  );
}
