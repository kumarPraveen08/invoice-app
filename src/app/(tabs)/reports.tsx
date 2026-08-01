import { EmptyState } from '@/shared/ui';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';

export default function ReportsScreen() {
  return (
    <SettingsScroll withTabBar>
      <EmptyState
        title="No reports yet"
        description="Reports will show sales, payments, and outstanding totals."
      />
    </SettingsScroll>
  );
}
