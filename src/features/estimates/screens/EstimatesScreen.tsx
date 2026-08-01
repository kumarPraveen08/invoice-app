import { EmptyState } from '@/shared/ui';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';

export default function EstimatesScreen() {
  return (
    <SettingsScroll>
      <EmptyState
        title="No estimates yet"
        description="Use + to create a quote before invoicing."
      />
    </SettingsScroll>
  );
}
